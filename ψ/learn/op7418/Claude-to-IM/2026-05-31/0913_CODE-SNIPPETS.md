---
name: 0913-code-snippets
description: This document captures the most important code patterns from the Claude-to-IM re
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-15
  source: fleet-memory
---

# Claude-to-IM: Telegram → tmux Bridge Code Snippets

## Overview

This document captures the most important code patterns from the Claude-to-IM repository for implementing a **Telegram → tmux bridge**. The repository provides a host-agnostic bridge architecture that can connect Telegram messages to any backend (in this case, a tmux session runner).

---

## 1. Package Dependencies

### Required Dependencies (from `package.json`)

```json
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.2.62",
    "discord.js": "^14.25.1",
    "markdown-it": "^14.1.1",
    "ws": "^8.18.0"
  }
}
```

**Key Notes:**
- **No external Telegram library** — the code directly uses Telegram Bot API via HTTP fetch
- The architecture is provider-agnostic: adapters exist for Telegram, Discord, Feishu
- `@anthropic-ai/claude-agent-sdk` handles the Claude integration
- Build with TypeScript 5+, Node.js >=20

---

## 2. Telegram Adapter Initialization (Long Polling Setup)

### Start the Adapter

```typescript
async start(): Promise<void> {
  if (this.running) return;

  const configError = this.validateConfig();
  if (configError) {
    console.warn('[telegram-adapter] Cannot start:', configError);
    return;
  }

  // Resolve bot identity via getMe before starting the poll loop.
  // This provides a stable offset key that survives token rotation.
  await this.resolveBotIdentity();

  this.running = true;
  this.abortController = new AbortController();

  // Register bot commands menu with Telegram
  this.registerCommands().catch(() => {});

  // Start polling in background (no await — runs until stop())
  this.pollLoop().catch(err => {
    console.error('[telegram-adapter] Poll loop error:', err);
  });

  console.log('[telegram-adapter] Started (botUserId:', this.botUserId || 'fallback-to-hash', ')');
}
```

### Validate Configuration

```typescript
validateConfig(): string | null {
  const token = getBridgeContext().store.getSetting('telegram_bot_token');
  if (!token) return 'telegram_bot_token not configured';

  const bridgeEnabled = getBridgeContext().store.getSetting('bridge_telegram_enabled');
  if (bridgeEnabled !== 'true') return 'bridge_telegram_enabled is not true';

  return null;
}
```

### Resolve Bot Identity (Stable Offset Tracking)

```typescript
private async resolveBotIdentity(): Promise<void> {
  const token = this.botToken;
  if (!token) return;

  try {
    const url = `${TELEGRAM_API}/bot${token}/getMe`;
    const res = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(10_000),
    });
    const data: any = await res.json();
    if (data.ok && data.result?.id) {
      this.botUserId = String(data.result.id);

      // Migrate offset from old token-hash key to new bot-ID key
      const newKey = 'telegram:bot' + this.botUserId;
      const oldKey = 'telegram:' + tokenShortHash(token);
      const existingNew = getBridgeContext().store.getChannelOffset(newKey);
      if (!existingNew || existingNew === '0') {
        const existingOld = getBridgeContext().store.getChannelOffset(oldKey);
        if (existingOld && existingOld !== '0') {
          getBridgeContext().store.setChannelOffset(newKey, existingOld);
          console.log(`[telegram-adapter] Migrated offset from ${oldKey} to ${newKey}: ${existingOld}`);
        }
      }
    }
  } catch (err) {
    console.warn('[telegram-adapter] getMe failed, falling back to token hash:', err);
  }
}
```

---

## 3. Long Polling Loop

### The Polling Loop Pattern

```typescript
private async pollLoop(): Promise<void> {
  const key = this.offsetKey();

  // Load persisted committed offset
  this.committedOffset = parseInt(getBridgeContext().store.getChannelOffset(key), 10) || 0;

  // fetchOffset is used for the getUpdates API call; starts at committed offset
  let fetchOffset = this.committedOffset;

  while (this.running) {
    try {
      const token = this.botToken;
      if (!token) {
        console.warn('[telegram-adapter] No bot token, waiting...');
        await new Promise(r => setTimeout(r, 5000));
        continue;
      }

      const url = `${TELEGRAM_API}/bot${token}/getUpdates`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offset: fetchOffset,
          timeout: 30,  // 30-second long poll
          allowed_updates: ['message', 'callback_query'],
        }),
        signal: this.abortController?.signal,
      });

      if (!this.running) break;

      const data: any = await res.json();
      if (!data.ok || !Array.isArray(data.result)) {
        console.warn('[telegram-adapter] getUpdates failed:', JSON.stringify(data).slice(0, 200));
        continue;
      }
      
      const updates: TelegramUpdate[] = data.result;
      for (const update of updates) {
        // Advance fetchOffset so the next getUpdates call skips this update
        if (update.update_id >= fetchOffset) {
          fetchOffset = update.update_id + 1;
        }

        // Idempotency: skip updates already processed (dedup on restart)
        if (this.recentUpdateIds.has(update.update_id)) {
          this.markUpdateProcessed(update.update_id);
          continue;
        }

        // Process callback_query or message
        if (update.callback_query) {
          // ... handle button callback
        } else if (update.message) {
          // ... handle incoming message
        }
      }

      // Persist committed offset after processing the batch
      this.persistCommittedOffset();
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') break;
      console.warn('[telegram-adapter] Polling error:', err);
      this.persistCommittedOffset();
      if (this.running) {
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }
}
```

---

## 4. Receiving Messages (Pattern)

### Text Message Processing

```typescript
} else if (update.message) {
  const m = update.message;
  const chatId = String(m.chat.id);
  const userId = m.from ? String(m.from.id) : chatId;
  const displayName = m.from?.username || m.from?.first_name || chatId;

  if (!this.isAuthorized(userId, chatId)) {
    console.warn('[telegram-adapter] Unauthorized message from userId:', userId);
    this.markUpdateProcessed(update.update_id);
    continue;
  }

  const messageText = m.text ?? m.caption ?? '';

  if (messageText) {
    const msg: InboundMessage = {
      messageId: String(m.message_id),
      address: {
        channelType: 'telegram',
        chatId,
        userId,
        displayName,
      },
      text: messageText,
      timestamp: m.date * 1000,
      raw: update,
      updateId: update.update_id,
    };

    // Audit log
    try {
      getBridgeContext().store.insertAuditLog({
        channelType: 'telegram',
        chatId,
        direction: 'inbound',
        messageId: String(m.message_id),
        summary: messageText.slice(0, 200),
      });
    } catch { /* best effort */ }

    this.enqueue(msg);
  }
}
```

### Callback Query (Button Press)

```typescript
if (update.callback_query) {
  const cb = update.callback_query;
  const chatId = cb.message?.chat.id ? String(cb.message.chat.id) : '';
  const userId = String(cb.from.id);

  if (!this.isAuthorized(userId, chatId)) {
    console.warn('[telegram-adapter] Unauthorized callback from userId:', userId);
    this.markUpdateProcessed(update.update_id);
    continue;
  }

  const msg: InboundMessage = {
    messageId: cb.id,
    address: {
      channelType: 'telegram',
      chatId,
      userId,
      displayName: cb.from.username || cb.from.first_name,
    },
    text: '',
    timestamp: Date.now(),
    callbackData: cb.data,
    callbackMessageId: cb.message?.message_id ? String(cb.message.message_id) : undefined,
    raw: update,
    updateId: update.update_id,
  };

  this.enqueue(msg);

  // Answer callback to dismiss the loading state
  this.answerCallback(cb.id).catch(() => {});
}
```

### Message Consumption Interface

```typescript
consumeOne(): Promise<InboundMessage | null> {
  // If there's a queued message, return it immediately
  const queued = this.queue.shift();
  if (queued) return Promise.resolve(queued);

  // If not running, return null
  if (!this.running) return Promise.resolve(null);

  // Otherwise, wait for the poll loop to enqueue a message
  return new Promise<InboundMessage | null>((resolve) => {
    this.waiters.push(resolve);
  });
}
```

---

## 5. Sending Messages to Telegram

### Basic Send Implementation

```typescript
async send(message: OutboundMessage): Promise<SendResult> {
  const token = this.botToken;
  if (!token) return { ok: false, error: 'No bot token configured' };

  const params: Record<string, unknown> = {
    chat_id: message.address.chatId,
    text: message.text,
    disable_web_page_preview: true,
  };

  if (message.parseMode === 'HTML') {
    params.parse_mode = 'HTML';
  } else if (message.parseMode === 'Markdown') {
    params.parse_mode = 'Markdown';
  }

  if (message.replyToMessageId) {
    params.reply_to_message_id = message.replyToMessageId;
  }

  // Inline keyboard buttons
  if (message.inlineButtons && message.inlineButtons.length > 0) {
    params.reply_markup = {
      inline_keyboard: message.inlineButtons.map(row =>
        row.map(btn => ({
          text: btn.text,
          callback_data: btn.callbackData,
        }))
      ),
    };
  }

  return callTelegramApi(token, 'sendMessage', params);
}
```

### Call Telegram API

```typescript
export async function callTelegramApi(
  botToken: string,
  method: string,
  params: Record<string, unknown>,
): Promise<TelegramSendResult> {
  try {
    const url = `${TELEGRAM_API}/bot${botToken}/${method}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const httpStatus = res.status;
    const data = await res.json() as TelegramApiResponse;
    if (!data.ok) {
      return {
        ok: false,
        error: data.description || 'Unknown Telegram API error',
        httpStatus,
        retryAfter: data.parameters?.retry_after,
      };
    }
    return {
      ok: true,
      messageId: data.result?.message_id != null ? String(data.result.message_id) : undefined,
      httpStatus,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}
```

### Answer Callback Query

```typescript
async answerCallback(callbackQueryId: string, text?: string): Promise<void> {
  const token = this.botToken;
  if (!token) return;

  await callTelegramApi(token, 'answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text: text || 'OK',
  });
}
```

---

## 6. ConversationEngine Interface

### Processing a Message

```typescript
export async function processMessage(
  binding: ChannelBinding,
  text: string,
  onPermissionRequest?: OnPermissionRequest,
  abortSignal?: AbortSignal,
  files?: FileAttachment[],
  onPartialText?: OnPartialText,
  onToolEvent?: OnToolEvent,
): Promise<ConversationResult> {
  const { store, llm } = getBridgeContext();
  const sessionId = binding.codepilotSessionId;

  // Acquire session lock
  const lockId = crypto.randomBytes(8).toString('hex');
  const lockAcquired = store.acquireSessionLock(sessionId, lockId, `bridge-${binding.channelType}`, 600);
  if (!lockAcquired) {
    return {
      responseText: '',
      tokenUsage: null,
      hasError: true,
      errorMessage: 'Session is busy processing another request',
      permissionRequests: [],
      sdkSessionId: null,
    };
  }

  store.setSessionRuntimeStatus(sessionId, 'running');

  // Lock renewal interval
  const renewalInterval = setInterval(() => {
    try { store.renewSessionLock(sessionId, lockId, 600); } catch { /* best effort */ }
  }, 60_000);

  try {
    const session = store.getSession(sessionId);

    // Save user message with file attachments
    let savedContent = text;
    if (files && files.length > 0) {
      const workDir = binding.workingDirectory || session?.working_directory || '';
      if (workDir) {
        try {
          const uploadDir = path.join(workDir, '.codepilot-uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          const fileMeta = files.map((f) => {
            const safeName = path.basename(f.name).replace(/[^a-zA-Z0-9._-]/g, '_');
            const filePath = path.join(uploadDir, `${Date.now()}-${safeName}`);
            const buffer = Buffer.from(f.data, 'base64');
            fs.writeFileSync(filePath, buffer);
            return { id: f.id, name: f.name, type: f.type, size: buffer.length, filePath };
          });
          savedContent = `<!--files:${JSON.stringify(fileMeta)}-->${text}`;
        } catch (err) {
          console.warn('[conversation-engine] Failed to persist file:', err);
          savedContent = `[${files.length} image(s) attached] ${text}`;
        }
      }
    }
    store.addMessage(sessionId, 'user', savedContent);

    // Resolve provider
    let resolvedProvider: import('./host.js').BridgeApiProvider | undefined;
    const providerId = session?.provider_id || '';
    if (providerId && providerId !== 'env') {
      resolvedProvider = store.getProvider(providerId);
    }
    if (!resolvedProvider) {
      const defaultId = store.getDefaultProviderId();
      if (defaultId) resolvedProvider = store.getProvider(defaultId);
    }

    // Effective model
    const effectiveModel = binding.model || session?.model || store.getSetting('default_model') || undefined;

    // Permission mode from binding
    let permissionMode: string;
    switch (binding.mode) {
      case 'plan': permissionMode = 'plan'; break;
      case 'ask': permissionMode = 'default'; break;
      default: permissionMode = 'acceptEdits'; break;
    }

    // Load conversation history
    const { messages: recentMsgs } = store.getMessages(sessionId, { limit: 50 });
    const historyMsgs = recentMsgs.slice(0, -1).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const abortController = new AbortController();
    if (abortSignal) {
      if (abortSignal.aborted) {
        abortController.abort();
      } else {
        abortSignal.addEventListener('abort', () => abortController.abort(), { once: true });
      }
    }

    // Call LLM to get streaming response
    const stream = llm.streamChat({
      prompt: text,
      sessionId,
      sdkSessionId: binding.sdkSessionId || undefined,
      model: effectiveModel,
      systemPrompt: session?.system_prompt || undefined,
      workingDirectory: binding.workingDirectory || session?.working_directory || undefined,
      abortController,
      permissionMode,
      provider: resolvedProvider,
      conversationHistory: historyMsgs,
      files,
      onRuntimeStatusChange: (status: string) => {
        try { store.setSessionRuntimeStatus(sessionId, status); } catch { /* best effort */ }
      },
    });

    // Consume the stream server-side
    return await consumeStream(stream, sessionId, onPermissionRequest, onPartialText, onToolEvent);
  } finally {
    clearInterval(renewalInterval);
    store.releaseSessionLock(sessionId, lockId);
    store.setSessionRuntimeStatus(sessionId, 'idle');
  }
}
```

### Stream Consumption

```typescript
async function consumeStream(
  stream: ReadableStream<string>,
  sessionId: string,
  onPermissionRequest?: OnPermissionRequest,
  onPartialText?: OnPartialText,
  onToolEvent?: OnToolEvent,
): Promise<ConversationResult> {
  const { store } = getBridgeContext();
  const reader = stream.getReader();
  const contentBlocks: MessageContentBlock[] = [];
  let currentText = '';
  let previewText = '';
  let tokenUsage: TokenUsage | null = null;
  let hasError = false;
  let errorMessage = '';
  const permissionRequests: PermissionRequestInfo[] = [];
  let capturedSdkSessionId: string | null = null;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const lines = value.split('\n');
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;

        let event: SSEEvent;
        try {
          event = JSON.parse(line.slice(6));
        } catch {
          continue;
        }

        switch (event.type) {
          case 'text':
            currentText += event.data;
            if (onPartialText) {
              previewText += event.data;
              try { onPartialText(previewText); } catch { /* non-critical */ }
            }
            break;

          case 'tool_use': {
            if (currentText.trim()) {
              contentBlocks.push({ type: 'text', text: currentText });
              currentText = '';
            }
            try {
              const toolData = JSON.parse(event.data);
              contentBlocks.push({
                type: 'tool_use',
                id: toolData.id,
                name: toolData.name,
                input: toolData.input,
              });
              if (onToolEvent) {
                try { onToolEvent(toolData.id, toolData.name, 'running'); } catch { }
              }
            } catch { /* skip */ }
            break;
          }

          case 'tool_result': {
            try {
              const resultData = JSON.parse(event.data);
              contentBlocks.push({
                type: 'tool_result',
                tool_use_id: resultData.tool_use_id,
                content: resultData.content,
                is_error: resultData.is_error || false,
              });
              if (onToolEvent) {
                try {
                  onToolEvent(
                    resultData.tool_use_id,
                    '',
                    resultData.is_error ? 'error' : 'complete',
                  );
                } catch { }
              }
            } catch { }
            break;
          }

          case 'permission_request': {
            try {
              const permData = JSON.parse(event.data);
              const perm: PermissionRequestInfo = {
                permissionRequestId: permData.permissionRequestId,
                toolName: permData.toolName,
                toolInput: permData.toolInput,
                suggestions: permData.suggestions,
              };
              permissionRequests.push(perm);
              // Forward immediately — the stream blocks until permission is resolved
              if (onPermissionRequest) {
                onPermissionRequest(perm).catch((err) => {
                  console.error('[conversation-engine] Failed to forward permission:', err);
                });
              }
            } catch { }
            break;
          }

          case 'result': {
            try {
              const resultData = JSON.parse(event.data);
              if (resultData.usage) tokenUsage = resultData.usage;
              if (resultData.is_error) hasError = true;
            } catch { }
            break;
          }

          case 'error':
            hasError = true;
            errorMessage = event.data || 'Unknown error';
            break;
        }
      }
    }

    // Flush remaining text
    if (currentText.trim()) {
      contentBlocks.push({ type: 'text', text: currentText });
    }

    // Save assistant message
    if (contentBlocks.length > 0) {
      const hasToolBlocks = contentBlocks.some(
        (b) => b.type === 'tool_use' || b.type === 'tool_result'
      );
      const content = hasToolBlocks
        ? JSON.stringify(contentBlocks)
        : contentBlocks
            .filter((b): b is Extract<MessageContentBlock, { type: 'text' }> => b.type === 'text')
            .map((b) => b.text)
            .join('\n\n')
            .trim();

      if (content) {
        store.addMessage(sessionId, 'assistant', content, tokenUsage ? JSON.stringify(tokenUsage) : null);
      }
    }

    // Extract text-only response for IM delivery
    const responseText = contentBlocks
      .filter((b): b is Extract<MessageContentBlock, { type: 'text' }> => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    return {
      responseText,
      tokenUsage,
      hasError,
      errorMessage,
      permissionRequests,
      sdkSessionId: capturedSdkSessionId,
    };
  } catch (e) {
    // Error handling...
    return {
      responseText: '',
      tokenUsage,
      hasError: true,
      errorMessage: e instanceof Error ? e.message : 'Stream consumption error',
      permissionRequests,
      sdkSessionId: capturedSdkSessionId,
    };
  }
}
```

---

## 7. Host Interface (What You Need to Implement)

### BridgeStore Interface

```typescript
interface BridgeStore {
  // Settings
  getSetting(key: string): string | null;

  // Channel Bindings (Telegram chat → Code Pilot session mapping)
  getChannelBinding(channelType: string, chatId: string): ChannelBinding | null;
  upsertChannelBinding(data: {
    channelType: string;
    chatId: string;
    codepilotSessionId: string;
    sdkSessionId?: string;
    workingDirectory: string;
    model: string;
    mode?: string;
  }): ChannelBinding;
  updateChannelBinding(id: string, updates: Partial<ChannelBinding>): void;
  listChannelBindings(channelType?: ChannelType): ChannelBinding[];

  // Sessions
  getSession(id: string): BridgeSession | null;
  createSession(name: string, model: string, systemPrompt?: string, cwd?: string): BridgeSession;
  updateSessionProviderId(sessionId: string, providerId: string): void;

  // Messages
  addMessage(sessionId: string, role: string, content: string, tokenUsage?: string | null): void;
  getMessages(sessionId: string, opts?: { limit?: number }): { messages: BridgeMessage[] };

  // Session locks (for concurrency control)
  acquireSessionLock(sessionId: string, lockId: string, holderName: string, ttl: number): boolean;
  renewSessionLock(sessionId: string, lockId: string, ttl: number): void;
  releaseSessionLock(sessionId: string, lockId: string): void;
  setSessionRuntimeStatus(sessionId: string, status: string): void;

  // SDK session management
  updateSdkSessionId(sessionId: string, sdkSessionId: string): void;
  updateSessionModel(sessionId: string, model: string): void;
  syncSdkTasks(sessionId: string, todos: unknown[]): void;

  // Providers
  getProvider(providerId: string): BridgeApiProvider | undefined;
  getDefaultProviderId(): string | null;

  // Audit logging
  insertAuditLog(log: AuditLogEntry): void;

  // Deduplication
  checkDedup(dedupKey: string): boolean;
  insertDedup(dedupKey: string): void;
  cleanupExpiredDedup(): void;

  // Outbound references
  insertOutboundRef(ref: OutboundRef): void;

  // Permission links
  insertPermissionLink(link: PermissionLink): void;
  getPermissionLink(linkId: string): PermissionLink | null;
  markPermissionLinkResolved(linkId: string, approved: boolean): boolean;
  listPendingPermissionLinksByChat(chatId: string): PermissionLink[];

  // Channel offset tracking
  getChannelOffset(key: string): string;
  setChannelOffset(key: string, offset: string): void;
}
```

### LLMProvider Interface

```typescript
interface LLMProvider {
  streamChat(params: StreamChatParams): ReadableStream<string>;
}

interface StreamChatParams {
  prompt: string;
  sessionId: string;
  sdkSessionId?: string;
  model?: string;
  systemPrompt?: string;
  workingDirectory?: string;
  abortController: AbortController;
  permissionMode: string;
  provider?: BridgeApiProvider;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
  files?: FileAttachment[];
  onRuntimeStatusChange?: (status: string) => void;
}
```

### PermissionGateway Interface

```typescript
interface PermissionGateway {
  resolvePendingPermission(permissionRequestId: string): boolean;
}
```

### Initialization

```typescript
export function initBridgeContext(opts: {
  store: BridgeStore;
  llm: LLMProvider;
  permissions: PermissionGateway;
  lifecycle?: LifecycleHooks;
}): void {
  globalBridgeContext = {
    store: opts.store,
    llm: opts.llm,
    permissions: opts.permissions,
    lifecycle: opts.lifecycle || {},
  };
}
```

---

## 8. Delivery Layer (Sending Messages with Retry & Chunking)

### Deliver a Message

```typescript
export async function deliver(
  adapter: BaseChannelAdapter,
  message: OutboundMessage,
  opts?: {
    sessionId?: string;
    dedupKey?: string;
  },
): Promise<SendResult> {
  const { store } = getBridgeContext();

  // Dedup check
  if (opts?.dedupKey) {
    if (store.checkDedup(opts.dedupKey)) {
      return { ok: true, messageId: undefined };
    }
  }

  // Periodically clean up expired dedup entries
  if (Math.random() < 0.01) {
    try { store.cleanupExpiredDedup(); } catch { /* best effort */ }
  }

  const limit = limits[adapter.channelType] || 4096;
  let chunks = chunkText(message.text, limit);

  let lastMessageId: string | undefined;

  for (let i = 0; i < chunks.length; i++) {
    // Rate limit: wait if this chat is sending too fast
    await rateLimiter.acquire(message.address.chatId);

    // Inter-chunk delay to avoid hitting rate limits
    if (i > 0) {
      await new Promise(r => setTimeout(r, INTER_CHUNK_DELAY_MS));
    }

    const chunkMessage: OutboundMessage = {
      ...message,
      text: chunks[i],
      // Only attach inline buttons to the last chunk
      inlineButtons: i === chunks.length - 1 ? message.inlineButtons : undefined,
      replyToMessageId: message.replyToMessageId,
    };

    const result = await sendWithRetry(adapter, chunkMessage);
    if (!result.ok) {
      return result;
    }
    lastMessageId = result.messageId;

    // Track outbound reference
    if (result.messageId && opts?.sessionId) {
      try {
        store.insertOutboundRef({
          channelType: adapter.channelType,
          chatId: message.address.chatId,
          codepilotSessionId: opts.sessionId,
          platformMessageId: result.messageId,
          purpose: message.inlineButtons ? 'permission' : 'response',
        });
      } catch { /* best effort */ }
    }
  }

  // Mark as delivered for dedup
  if (opts?.dedupKey) {
    try { store.insertDedup(opts.dedupKey); } catch { /* best effort */ }
  }

  // Audit log
  try {
    store.insertAuditLog({
      channelType: adapter.channelType,
      chatId: message.address.chatId,
      direction: 'outbound',
      messageId: lastMessageId || '',
      summary: message.text.slice(0, 200),
    });
  } catch { /* best effort */ }

  return { ok: true, messageId: lastMessageId };
}
```

### Send with Retry

```typescript
async function sendWithRetry(
  adapter: BaseChannelAdapter,
  message: OutboundMessage,
  plainFallback?: string,
): Promise<SendResult> {
  let lastError: string | undefined;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const result = await adapter.send(message);
    if (result.ok) return result;

    lastError = result.error;
    const category = classifyError(result);

    // HTML parse error: fallback to plain text immediately
    if (category === 'parse_error' && message.parseMode === 'HTML') {
      const fallbackText = plainFallback || message.text;
      const plainResult = await adapter.send({
        ...message,
        text: fallbackText,
        parseMode: 'plain',
      });
      if (plainResult.ok) return plainResult;
      lastError = plainResult.error;
      const plainCategory = classifyError(plainResult);
      if (!shouldRetry(plainCategory)) {
        return plainResult;
      }
    }

    // Don't retry client errors
    if (!shouldRetry(category)) {
      return result;
    }

    // Wait before next retry
    if (attempt < MAX_RETRIES - 1) {
      await new Promise(r => setTimeout(r, retryDelay(result, attempt)));
    }
  }

  return { ok: false, error: lastError || 'Max retries exceeded' };
}
```

---

## 9. Mock Host Example (For Testing)

### In-Memory Store

```typescript
class InMemoryStore implements BridgeStore {
  private settings = new Map<string, string>();
  private sessions = new Map<string, BridgeSession>();
  private bindings = new Map<string, ChannelBinding>();
  private messages = new Map<string, BridgeMessage[]>();
  private nextId = 1;

  getSetting(key: string) { return this.settings.get(key) ?? null; }

  getChannelBinding(channelType: string, chatId: string) {
    return this.bindings.get(`${channelType}:${chatId}`) ?? null;
  }

  upsertChannelBinding(data: {
    channelType: string;
    chatId: string;
    codepilotSessionId: string;
    workingDirectory: string;
    model: string;
  }) {
    const key = `${data.channelType}:${data.chatId}`;
    const existing = this.bindings.get(key);
    const id = existing?.id || `binding-${this.nextId++}`;
    const binding: ChannelBinding = {
      id,
      channelType: data.channelType,
      chatId: data.chatId,
      codepilotSessionId: data.codepilotSessionId,
      workingDirectory: data.workingDirectory,
      model: data.model,
      mode: 'code',
      active: true,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.bindings.set(key, binding);
    return binding;
  }

  updateChannelBinding(id: string, updates: Partial<ChannelBinding>) {
    for (const [key, b] of this.bindings) {
      if (b.id === id) {
        this.bindings.set(key, { ...b, ...updates });
        break;
      }
    }
  }

  getSession(id: string) { return this.sessions.get(id) ?? null; }

  createSession(name: string, model: string, cwd?: string) {
    const session: BridgeSession = {
      id: `session-${this.nextId++}`,
      working_directory: cwd || '/tmp',
      model,
    };
    this.sessions.set(session.id, session);
    return session;
  }

  addMessage(sessionId: string, role: string, content: string) {
    const msgs = this.messages.get(sessionId) || [];
    msgs.push({ role, content });
    this.messages.set(sessionId, msgs);
  }

  getMessages(sessionId: string) {
    return { messages: this.messages.get(sessionId) || [] };
  }

  acquireSessionLock() { return true; }
  renewSessionLock() {}
  releaseSessionLock() {}
  setSessionRuntimeStatus() {}
  updateSdkSessionId() {}
  updateSessionModel() {}
  syncSdkTasks() {}
  getProvider() { return undefined; }
  getDefaultProviderId() { return null; }
  insertAuditLog() {}
  checkDedup() { return false; }
  insertDedup() {}
  cleanupExpiredDedup() {}
  insertOutboundRef() {}
  insertPermissionLink() {}
  getPermissionLink() { return null; }
  markPermissionLinkResolved() { return false; }
  listPendingPermissionLinksByChat() { return []; }
  getChannelOffset() { return '0'; }
  setChannelOffset() {}
}
```

### Echo LLM (For Testing)

```typescript
class EchoLLM implements LLMProvider {
  streamChat(params: StreamChatParams): ReadableStream<string> {
    const response = `Echo: ${params.prompt}`;
    return new ReadableStream({
      start(controller) {
        // Emit text event
        controller.enqueue(`data: ${JSON.stringify({ type: 'text', data: response })}\n`);
        // Emit result event
        controller.enqueue(`data: ${JSON.stringify({
          type: 'result',
          data: JSON.stringify({ usage: { input_tokens: 10, output_tokens: 5 } }),
        })}\n`);
        controller.close();
      },
    });
  }
}
```

### Full Example

```typescript
async function main() {
  console.log('=== Claude-to-IM Mock Host Example ===\n');

  // 1. Initialize context
  initBridgeContext({
    store: new InMemoryStore(),
    llm: new EchoLLM(),
    permissions: { resolvePendingPermission: () => true },
    lifecycle: {
      onBridgeStart: () => console.log('[lifecycle] Bridge started'),
      onBridgeStop: () => console.log('[lifecycle] Bridge stopped'),
    },
  });

  // 2. Simulate an inbound message
  const address = { channelType: 'telegram', chatId: '12345', displayName: 'Test User' };

  console.log('Resolving channel binding...');
  const binding = router.resolve(address);
  console.log(`  Session: ${binding.codepilotSessionId}`);
  console.log(`  CWD: ${binding.workingDirectory}\n`);

  // 3. Process message through conversation engine
  console.log('Processing message: "Hello, Claude!"');
  const result = await engine.processMessage(binding, 'Hello, Claude!');

  console.log(`\nResult:`);
  console.log(`  Response: "${result.responseText}"`);
  console.log(`  Has error: ${result.hasError}`);
  console.log(`  Token usage: ${JSON.stringify(result.tokenUsage)}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
```

---

## 10. Image/Media Handling

### Check if Image Support is Enabled

```typescript
export function isImageEnabled(): boolean {
  const setting = getBridgeContext().store.getSetting('bridge_telegram_image_enabled');
  // Default to true if not explicitly set to 'false'
  return setting !== 'false';
}
```

### Download Photo

```typescript
export async function downloadPhoto(
  botToken: string,
  photos: TelegramPhotoSize[],
  messageId: string,
): Promise<MediaDownloadResult> {
  const selected = selectOptimalPhoto(photos);
  return downloadFileById(botToken, selected.file_id, messageId);
}
```

### Download Document Image

```typescript
export async function downloadDocumentImage(
  botToken: string,
  doc: TelegramDocument,
  messageId: string,
): Promise<MediaDownloadResult> {
  // Check MIME type
  const mime = doc.mime_type || inferMimeType(doc.file_name || '');
  if (!mime || !isSupportedImageMime(mime)) {
    return { attachment: null, rejected: 'unsupported_type' };
  }

  // Pre-check file size before downloading
  const maxSize = getMaxImageSize();
  if (doc.file_size && doc.file_size > maxSize) {
    return {
      attachment: null,
      rejected: 'too_large',
      rejectedMessage: formatSizeError(doc.file_size, maxSize),
    };
  }

  return downloadFileById(botToken, doc.file_id, messageId);
}
```

### Download File by ID (With Retry)

```typescript
async function downloadFileById(
  botToken: string,
  fileId: string,
  messageId: string,
): Promise<MediaDownloadResult> {
  const maxSize = getMaxImageSize();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Step 1: Get file path from Telegram
      const getFileUrl = `${TELEGRAM_API}/bot${botToken}/getFile`;
      const getFileRes = await fetch(getFileUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_id: fileId }),
        signal: AbortSignal.timeout(15_000),
      });

      const getFileData: any = await getFileRes.json();
      if (!getFileData.ok || !getFileData.result?.file_path) {
        console.warn(`[telegram-media] getFile failed for ${fileId}`);
        if (attempt < MAX_RETRIES) {
          await sleep(1000 * Math.pow(2, attempt - 1));
          continue;
        }
        return {
          attachment: null,
          rejected: 'download_failed',
          rejectedMessage: 'Failed to get file info from Telegram.',
        };
      }

      const filePath: string = getFileData.result.file_path;
      const fileSize: number | undefined = getFileData.result.file_size;

      // Pre-check size
      if (fileSize && fileSize > maxSize) {
        console.warn(`[telegram-media] File too large: ${fileSize} bytes`);
        return {
          attachment: null,
          rejected: 'too_large',
          rejectedMessage: formatSizeError(fileSize, maxSize),
        };
      }

      // Step 2: Download the file
      const downloadUrl = `${TELEGRAM_API}/file/bot${botToken}/${filePath}`;
      const downloadRes = await fetch(downloadUrl, {
        signal: AbortSignal.timeout(60_000),
      });

      if (!downloadRes.ok) {
        console.warn(`[telegram-media] Download failed: HTTP ${downloadRes.status}`);
        if (attempt < MAX_RETRIES) {
          await sleep(1000 * Math.pow(2, attempt - 1));
          continue;
        }
        return {
          attachment: null,
          rejected: 'download_failed',
          rejectedMessage: 'Failed to download image from Telegram.',
        };
      }

      // Step 3: Read buffer and validate size
      const buffer = Buffer.from(await downloadRes.arrayBuffer());
      if (buffer.length > maxSize) {
        console.warn(`[telegram-media] Downloaded buffer too large: ${buffer.length} bytes`);
        return {
          attachment: null,
          rejected: 'too_large',
          rejectedMessage: formatSizeError(buffer.length, maxSize),
        };
      }

      // Step 4: Convert to base64
      const mime = inferMimeType(filePath) || 'image/jpeg';
      const base64 = buffer.toString('base64');
      const fileName = filePath.split('/').pop() || `image_${messageId}`;

      return {
        attachment: {
          id: `tg-${messageId}-${fileId.slice(0, 8)}`,
          name: fileName,
          type: mime,
          size: buffer.length,
          data: base64,
        },
      };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[telegram-media] Download attempt ${attempt}/${MAX_RETRIES} failed:`, errMsg);

      if (attempt < MAX_RETRIES) {
        await sleep(1000 * Math.pow(2, attempt - 1));
      }
    }
  }

  return {
    attachment: null,
    rejected: 'download_failed',
    rejectedMessage: 'Image download failed after retries.',
  };
}
```

---

## Key Architectural Patterns

### 1. **Long Polling Pattern**
- Continuous `getUpdates` with 30-second timeout
- Manages offset state in persistent store
- Idempotent processing with recent update ID deduplication
- Thread-safe with AbortController

### 2. **Async Queue Pattern**
- Messages enqueued by poll loop
- Consumers wait via Promise.resolve() or Promise
- Used by bridge-manager to process one message at a time

### 3. **Session Lock Pattern**
- 600-second TTL on conversation locks
- Renewed every 60 seconds during processing
- Prevents concurrent Claude invocations on same session

### 4. **Stream Consumption Pattern**
- Server-side SSE consumption (not forwarded to client)
- Real-time callbacks for permissions, tool events, previews
- Accumulates text and content blocks
- Saves to database for history

### 5. **Error Classification & Retry**
- Classifies Telegram API errors (rate limit, server, client, parse)
- Different retry logic per category
- HTML parse errors fall back to plain text immediately
- Exponential backoff with jitter

### 6. **Deduplication Pattern**
- Dedupkey checked before sending
- Set on successful delivery
- Prevents duplicate messages on bridge restart

### 7. **Rate Limiting**
- 20 messages/minute per chat
- Semaphore-based acquire before each send
- Inter-chunk delay (300ms) between message pieces

---

## Settings (Configuration)

Key settings stored in BridgeStore:

```
telegram_bot_token          → Bot token for @BotFather
bridge_telegram_enabled     → 'true' to enable Telegram adapter
bridge_telegram_stream_enabled → 'true' to enable draft message streaming
bridge_telegram_stream_private_only → 'true' (default) to stream only to private chats
telegram_chat_id            → Default chat ID for notifications
telegram_bridge_allowed_users → Comma-separated user/chat IDs
bridge_telegram_image_enabled → 'true' (default) to process images
bridge_telegram_max_image_size → Max image size in bytes (default: 20MB)
default_model               → Default Claude model if session doesn't specify
```

---

## Type Definitions (Key Structs)

### InboundMessage

```typescript
interface InboundMessage {
  messageId: string;
  address: {
    channelType: 'telegram' | 'discord' | 'feishu';
    chatId: string;
    userId: string;
    displayName: string;
  };
  text: string;
  timestamp: number; // milliseconds
  callbackData?: string; // For button presses
  callbackMessageId?: string;
  attachments?: FileAttachment[];
  raw: unknown; // Raw Telegram/Discord/Feishu object
  updateId: number; // For Telegram offset tracking
}
```

### OutboundMessage

```typescript
interface OutboundMessage {
  address: ChannelAddress;
  text: string;
  parseMode?: 'plain' | 'HTML' | 'Markdown';
  replyToMessageId?: string;
  inlineButtons?: InlineButton[][];
}

interface InlineButton {
  text: string;
  callbackData: string;
}
```

### ChannelBinding

```typescript
interface ChannelBinding {
  id: string;
  channelType: ChannelType;
  chatId: string;
  codepilotSessionId: string;
  sdkSessionId: string;
  workingDirectory: string;
  model: string;
  mode: 'plan' | 'code' | 'ask';
  active: boolean;
  createdAt: string; // ISO string
  updatedAt: string;
}
```

---

## Summary for Telegram → tmux Bridge Implementation

To implement a Telegram → tmux bridge:

1. **Create a BridgeStore** implementation that persists channel bindings and session data
2. **Create an LLMProvider** that sends commands to tmux (or delegates to Claude API)
3. **Initialize TelegramAdapter** with a bot token from @BotFather
4. **Start the adapter** — it will poll for messages automatically
5. **Process messages** via `processMessage()` which streams responses back
6. **Send responses** via the adapter's `send()` method, which handles chunking/retry
7. **Track permissions** and status via the store and lifecycle hooks

The architecture handles:
- Long polling with offset watermarking
- Idempotent message processing
- Session concurrency control
- Rate limiting and retry logic
- Image/media attachment support
- Streaming previews
- Permission request forwarding
- Full conversation history persistence

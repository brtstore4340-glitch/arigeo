# Claude-to-IM — Quick Implementation Reference

**Goal:** Get a working Telegram bridge to Claude in ~30 minutes.

---

## 1. Installation & Setup (5 min)

```bash
# Clone the library
git clone https://github.com/op7418/Claude-to-IM.git
cd Claude-to-IM
npm install

# Verify it works
npm run test
```

**What you get:** A host-agnostic Node.js library that routes IM messages to Claude and delivers responses back.

---

## 2. Required Environment Variables

Before starting, you need:

- **Telegram Bot Token**: Get from [@BotFather](https://t.me/BotFather)  
  Format: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`

- **Your User IDs** (who can talk to the bot):  
  Format: comma-separated (e.g., `"12345,67890"`)

- **Claude API Key** (optional for basic setup, needed for real LLM calls)

---

## 3. Minimal Working Example (10 min)

Create `my-bot.ts`:

```typescript
import { initBridgeContext } from 'claude-to-im/context';
import * as bridgeManager from 'claude-to-im/bridge-manager';
import type {
  BridgeStore,
  LLMProvider,
  PermissionGateway,
  StreamChatParams,
} from 'claude-to-im/host';
import type { ChannelBinding, BridgeSession, AuditLogInput } from 'claude-to-im/types';

// ============================================
// 1. MINIMAL IN-MEMORY STORE
// ============================================
class InMemoryStore implements BridgeStore {
  private settings = new Map<string, string>();
  private sessions = new Map<string, BridgeSession>();
  private bindings = new Map<string, ChannelBinding>();
  private locks = new Map<string, { lockId: string; expiry: number }>();
  private permissionLinks = new Map<string, any>();
  private offsets = new Map<string, string>();

  constructor() {
    // Pre-populate required settings
    this.settings.set('remote_bridge_enabled', 'true');
    this.settings.set('bridge_telegram_enabled', 'true');
    this.settings.set('bridge_telegram_bot_token', process.env.TELEGRAM_BOT_TOKEN || '');
    this.settings.set('bridge_telegram_allowed_users', process.env.ALLOWED_USERS || '');
    this.settings.set('bridge_telegram_stream_enabled', 'true');
    this.settings.set('bridge_default_cwd', process.env.HOME || '/root');
    this.settings.set('bridge_model', 'claude-3-5-sonnet-20241022');
  }

  // Settings
  getSetting(key: string): string | null {
    return this.settings.get(key) ?? null;
  }

  // Session bindings
  getChannelBinding(channelType: string, chatId: string): ChannelBinding | null {
    const key = `${channelType}:${chatId}`;
    return this.bindings.get(key) ?? null;
  }

  upsertChannelBinding(data: any): ChannelBinding {
    const id = `cb_${Date.now()}`;
    const binding = { id, ...data, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const key = `${data.channelType}:${data.chatId}`;
    this.bindings.set(key, binding);
    return binding;
  }

  // Sessions
  getSession(id: string): BridgeSession | null {
    return this.sessions.get(id) ?? null;
  }

  createSession(name: string, model: string, systemPrompt?: string, cwd?: string): BridgeSession {
    const id = `session_${Date.now()}`;
    const session = { id, working_directory: cwd || '/tmp', model, system_prompt: systemPrompt };
    this.sessions.set(id, session);
    return session;
  }

  // Messages
  addMessage(sessionId: string, role: string, content: string, usage?: string | null) {
    // In-memory; just log
    console.log(`[store] ${sessionId}: ${role} -> ${content.slice(0, 50)}`);
  }

  getMessages(sessionId: string, opts?: any) {
    return { messages: [] };
  }

  // Locks
  acquireSessionLock(sessionId: string, lockId: string, owner: string, ttlSecs: number): boolean {
    const existing = this.locks.get(sessionId);
    if (existing && existing.expiry > Date.now()) return false;
    this.locks.set(sessionId, { lockId, expiry: Date.now() + ttlSecs * 1000 });
    return true;
  }

  renewSessionLock(sessionId: string, lockId: string, ttlSecs: number) {
    const lock = this.locks.get(sessionId);
    if (lock && lock.lockId === lockId) {
      lock.expiry = Date.now() + ttlSecs * 1000;
    }
  }

  releaseSessionLock(sessionId: string, lockId: string) {
    const lock = this.locks.get(sessionId);
    if (lock && lock.lockId === lockId) {
      this.locks.delete(sessionId);
    }
  }

  // Placeholder methods (minimal implementations for quick start)
  updateChannelBinding() {}
  listChannelBindings() { return []; }
  updateSessionProviderId() {}
  updateSdkSessionId() {}
  updateSessionModel() {}
  syncSdkTasks() {}
  setSessionRuntimeStatus() {}
  getProvider() { return undefined; }
  getDefaultProviderId() { return null; }
  insertAuditLog(entry: AuditLogInput) { console.log('[audit]', entry); }
  checkDedup(key: string) { return false; }
  insertDedup(key: string) {}
  cleanupExpiredDedup() {}
  insertOutboundRef() {}
  insertPermissionLink(link: any) {
    this.permissionLinks.set(link.permissionRequestId, link);
  }
  getPermissionLink(id: string) { return this.permissionLinks.get(id) ?? null; }
  markPermissionLinkResolved(id: string): boolean {
    const link = this.permissionLinks.get(id);
    if (link && !link.resolved) {
      link.resolved = true;
      return true;
    }
    return false;
  }
  getChannelOffset(key: string) { return this.offsets.get(key) ?? '0'; }
  setChannelOffset(key: string, offset: string) { this.offsets.set(key, offset); }
}

// ============================================
// 2. MINIMAL ECHO LLM (no Claude API)
// ============================================
class EchoLLM implements LLMProvider {
  streamChat(params: StreamChatParams): ReadableStream<string> {
    const response = `Echo: ${params.prompt}`;
    return new ReadableStream({
      start(controller) {
        // Send text event
        controller.enqueue(`data: ${JSON.stringify({ type: 'text', data: response })}\n`);
        // Send final result event
        controller.enqueue(`data: ${JSON.stringify({
          type: 'result',
          data: JSON.stringify({
            usage: { input_tokens: 10, output_tokens: 5 },
            sdkSessionId: `sdk_${Date.now()}`,
          }),
        })}\n`);
        controller.close();
      },
    });
  }
}

// ============================================
// 3. PERMISSION GATEWAY
// ============================================
class SimplePermissionGateway implements PermissionGateway {
  resolvePendingPermission(id: string, resolution: any): boolean {
    console.log(`[perms] ${id}: ${resolution.behavior}`);
    return true; // Always allow for demo
  }
}

// ============================================
// 4. INITIALIZE AND START
// ============================================
async function main() {
  const store = new InMemoryStore();
  const llm = new EchoLLM();
  const permissions = new SimplePermissionGateway();

  console.log('Initializing bridge...');
  initBridgeContext({
    store,
    llm,
    permissions,
    lifecycle: {
      onBridgeStart: () => console.log('Bridge started!'),
      onBridgeStop: () => console.log('Bridge stopped!'),
    },
  });

  console.log('Starting bridge...');
  await bridgeManager.start();
  const status = bridgeManager.getStatus();
  console.log('Bridge status:', status);

  // Keep running
  console.log('Bridge is listening... Press Ctrl+C to stop');
  await new Promise(resolve => setTimeout(resolve, Infinity));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
```

**Run it:**
```bash
export TELEGRAM_BOT_TOKEN="your_bot_token_here"
export ALLOWED_USERS="your_user_id"
npx tsx my-bot.ts
```

Test: Send a message to your bot on Telegram. You should get an echo response.

---

## 4. How Messages Flow

```
┌─────────────────┐
│ Telegram User   │  Sends: "Hello"
└────────┬────────┘
         │
         v
┌──────────────────────────────────────┐
│ TelegramAdapter (long polling)       │
│ - Pulls updates from Telegram API    │
│ - Enqueues InboundMessage            │
└────────┬─────────────────────────────┘
         │
         v
┌──────────────────────────────────────┐
│ BridgeManager.processMessage()        │
│ - acquireSessionLock()               │
│ - channelRouter.resolve()            │
│   (maps chat → session)              │
└────────┬─────────────────────────────┘
         │
         v
┌──────────────────────────────────────┐
│ conversationEngine.processInput()     │
│ - Calls LLMProvider.streamChat()     │
│ - Parses SSE events                  │
│ - Emits text → OutboundMessage       │
└────────┬─────────────────────────────┘
         │
         v
┌──────────────────────────────────────┐
│ deliveryLayer.send()                 │
│ - Chunks message (if > 4096 chars)   │
│ - Retries on failure                 │
│ - Dedup check                        │
│ - Calls adapter.send()               │
└────────┬─────────────────────────────┘
         │
         v
┌──────────────────────────────────────┐
│ TelegramAdapter.send()               │
│ - Calls Telegram Bot API             │
└────────┬─────────────────────────────┘
         │
         v
┌─────────────────┐
│ Telegram User   │  Receives: "Echo: Hello"
└─────────────────┘
```

**Key insight:** Once you call `bridgeManager.start()`, the whole loop runs autonomously. The bridge polls Telegram, routes messages, calls your LLM, and sends responses back—all without your code doing anything else.

---

## 5. Custom Host (Execute in tmux instead of Claude API)

Want to run arbitrary shell commands instead of calling Claude?

```typescript
class TmuxLLM implements LLMProvider {
  streamChat(params: StreamChatParams): ReadableStream<string> {
    return new ReadableStream({
      async start(controller) {
        try {
          // Execute the user's message as a shell command
          const child = require('child_process').spawn('sh', ['-c', params.prompt], {
            cwd: params.workingDirectory,
          });

          let output = '';
          child.stdout.on('data', (chunk: any) => {
            output += chunk.toString();
            // Stream partial output
            controller.enqueue(`data: ${JSON.stringify({ 
              type: 'text', 
              data: chunk.toString() 
            })}\n`);
          });

          child.stderr.on('data', (chunk: any) => {
            output += chunk.toString();
          });

          await new Promise<void>((resolve, reject) => {
            child.on('close', (code: number) => {
              if (code !== 0) reject(new Error(`Command failed with code ${code}`));
              else resolve();
            });
          });

          // Send final result
          controller.enqueue(`data: ${JSON.stringify({
            type: 'result',
            data: JSON.stringify({
              usage: { input_tokens: 0, output_tokens: output.length },
              sdkSessionId: `sdk_${Date.now()}`,
            }),
          })}\n`);
          controller.close();
        } catch (err: any) {
          controller.enqueue(`data: ${JSON.stringify({ 
            type: 'error', 
            data: err.message 
          })}\n`);
          controller.close();
        }
      },
    });
  }
}
```

Use it instead of `EchoLLM`:
```typescript
const llm = new TmuxLLM();
initBridgeContext({ store, llm, permissions, lifecycle });
```

Now sending `"ls -la"` to your bot will execute it in tmux and send the output back to Telegram.

---

## 6. Security & Permissions

### User Whitelisting

```typescript
store.getSetting('bridge_telegram_allowed_users'); // Returns "12345,67890"
```

The adapter checks this before routing any message. Only listed user IDs can talk to the bot.

### Tool Approval Flow

When Claude requests permission to run a tool (e.g., Bash):

1. Bridge receives `permission_request` event from LLM
2. Creates interactive message with buttons:  
   - "Allow" (one-time)  
   - "Allow Session" (remember for this chat)  
   - "Deny"
3. Stores permission link: `permissionRequestId` → IM message
4. User clicks button → adapter routes callback → `handlePermissionCallback()`
5. Bridge calls `PermissionGateway.resolvePendingPermission()` → LLM resumes

### Rate Limiting

- Built-in: 20 messages/min per chat (token bucket)
- Per-adapter
- Enforced in `delivery-layer`

### Audit Logging

Every inbound and outbound message logged via `store.insertAuditLog()`:

```typescript
insertAuditLog({
  channelType: 'telegram',
  chatId: '12345',
  direction: 'in', // or 'out'
  messageId: 'msg_123',
  summary: 'Hello world',
});
```

---

## 7. Required Configuration Keys

Your `BridgeStore.getSetting()` must return these:

| Key | Example | Purpose |
|-----|---------|---------|
| `remote_bridge_enabled` | `"true"` | Master switch |
| `bridge_telegram_enabled` | `"true"` | Enable Telegram |
| `bridge_telegram_bot_token` | `"123:ABC..."` | Bot token from @BotFather |
| `bridge_telegram_allowed_users` | `"12345,67890"` | CSV of allowed user IDs |
| `bridge_telegram_stream_enabled` | `"true"` | Real-time preview (edit message as it types) |
| `bridge_default_cwd` | `"/home/user"` | Working directory for commands |
| `bridge_model` | `"claude-3-5-sonnet-20241022"` | Model name |

---

## 8. Testing Your Bot

### Step 1: Get IDs

```bash
# Your Telegram user ID (send any message to @userinfobot)
# Example: 12345

# Your bot token (from @BotFather)
# Example: 123456:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh
```

### Step 2: Start the bot

```bash
export TELEGRAM_BOT_TOKEN="123456:ABC..."
export ALLOWED_USERS="12345"
npx tsx my-bot.ts
```

### Step 3: Message your bot

1. Open Telegram
2. Search for your bot
3. Send a message: `"Hello"`
4. Wait ~2 seconds
5. Receive: `"Echo: Hello"`

### Step 4: Check logs

You should see:
```
[adapter:telegram] Received message from 12345: "Hello"
[bridge] Processing message in session session_...
[llm] streamChat() called
[delivery] Sending to Telegram
Bridge status: { running: true, adapters: [{channelType: 'telegram', running: true}] }
```

---

## 9. Connecting to Real Claude (Advanced)

Instead of `EchoLLM`, use the Claude API:

```typescript
import Anthropic from '@anthropic-ai/sdk';

class RealClaudeLLM implements LLMProvider {
  private client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  streamChat(params: StreamChatParams): ReadableStream<string> {
    return new ReadableStream({
      async start(controller) {
        try {
          const stream = await this.client.messages.stream({
            model: params.model || 'claude-3-5-sonnet-20241022',
            max_tokens: 2048,
            system: params.systemPrompt,
            messages: [{ role: 'user', content: params.prompt }],
          });

          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(`data: ${JSON.stringify({
                type: 'text',
                data: event.delta.text,
              })}\n`);
            }
          }

          controller.enqueue(`data: ${JSON.stringify({
            type: 'result',
            data: JSON.stringify({
              usage: { input_tokens: 0, output_tokens: 0 },
            }),
          })}\n`);
          controller.close();
        } catch (err: any) {
          controller.enqueue(`data: ${JSON.stringify({ type: 'error', data: err.message })}\n`);
          controller.close();
        }
      },
    });
  }
}
```

Replace `EchoLLM` with `RealClaudeLLM` and set `ANTHROPIC_API_KEY`.

---

## 10. Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/bridge/context.ts` | DI container — `initBridgeContext()` / `getBridgeContext()` |
| `src/lib/bridge/host.ts` | Host interface definitions (BridgeStore, LLMProvider, etc.) |
| `src/lib/bridge/bridge-manager.ts` | Main orchestrator — `start()` / `stop()` / `getStatus()` |
| `src/lib/bridge/adapters/telegram-adapter.ts` | Telegram long polling |
| `src/lib/bridge/conversation-engine.ts` | LLM stream parsing |
| `src/lib/bridge/delivery-layer.ts` | Message chunking, retry, dedup |
| `src/lib/bridge/permission-broker.ts` | Permission request handling |
| `src/lib/bridge/types.ts` | Type definitions |
| `src/lib/bridge/examples/mock-host.ts` | Full working example (reference) |

---

## 11. Troubleshooting

| Problem | Solution |
|---------|----------|
| "Context not initialized" | Call `initBridgeContext()` before any bridge module |
| Bot doesn't respond | Check `TELEGRAM_BOT_TOKEN` and `ALLOWED_USERS` env vars |
| "Missing bot token" | `BridgeStore.getSetting('bridge_telegram_bot_token')` returns `null` |
| Adapter won't start | Verify `remote_bridge_enabled` and `bridge_telegram_enabled` return `"true"` |
| Permission buttons don't work | Implement all permission link methods atomically |
| Messages duplicated | Check `checkDedup()` and `insertDedup()` logic |
| Streaming preview slow | Reduce `bridge_telegram_stream_enabled` or check network |

---

## 12. Next Steps

1. **Use the working example**: Copy code from `src/lib/bridge/examples/mock-host.ts`
2. **Persist data**: Replace in-memory store with SQLite or your DB
3. **Implement real LLM**: Swap `EchoLLM` for actual Claude/OpenAI/etc.
4. **Add more adapters**: Discord, Feishu following the adapter pattern
5. **Production hardening**: Implement proper lock mechanism, audit log storage, error handling

---

**Reference:** [GitHub](https://github.com/op7418/Claude-to-IM) | [Development Guide](https://github.com/op7418/Claude-to-IM/blob/main/docs/development.md)

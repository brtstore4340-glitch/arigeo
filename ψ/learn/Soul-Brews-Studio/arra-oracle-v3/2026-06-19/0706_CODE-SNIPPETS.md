# Arra Oracle v3 — Code Snippets & Patterns

**Project:** Soul-Brews-Studio/arra-oracle-v3  
**Date:** 2026-06-19  
**Version:** 26.6.1-alpha.1506

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Main Entry Point](#main-entry-point)
3. [Core Architecture](#core-architecture)
4. [Key Patterns & Idioms](#key-patterns--idioms)
5. [Database Schema](#database-schema)
6. [Vector Store Implementation](#vector-store-implementation)
7. [Tool Handlers](#tool-handlers)
8. [Configuration System](#configuration-system)
9. [Notable Patterns](#notable-patterns)

---

## Project Overview

**Arra Oracle v3** is an MCP (Model Context Protocol) memory layer with semantic search, philosophy, and knowledge management. It provides a knowledge base system with:

- Hybrid search (FTS5 keyword + vector semantic)
- Multi-model embeddings (bge-m3, nomic, qwen3)
- Pluggable vector stores (LanceDB, ChromaDB, Qdrant, sqlite-vec, Cloudflare Vectorize)
- Document preservation philosophy ("Nothing is Deleted" — supersedes instead of deletes)
- Forum threading, trace logging, and handoff systems
- HTTP server (Elysia) + MCP server (stdio)

**Tech Stack:**
- Runtime: Bun (native SQLite, fast TypeScript)
- Database: SQLite + Drizzle ORM
- Vector DB: LanceDB (default), ChromaDB, Qdrant, sqlite-vec, Cloudflare Vectorize
- HTTP: Elysia framework
- MCP: Model Context Protocol SDK

---

## Main Entry Point

### MCP Server Entry Point (`src/index.ts`)

```typescript
/**
 * Arra Oracle MCP Server
 *
 * Slim entry point: server lifecycle, tool registration, and routing.
 * Handler implementations live in src/tools/.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Tool aliases: backward compatibility chain for renamed tools
// arra_* (original) → muninn_* (brief) → oracle_* (current canonical)
const ALIAS_PREFIXES = ['arra_', 'muninn_'] as const;
export function resolveToolName(name: string): string {
  for (const p of ALIAS_PREFIXES) {
    if (name.startsWith(p)) return 'oracle_' + name.slice(p.length);
  }
  return name;
}

// Write tools disabled in read-only mode
const WRITE_TOOLS = [
  'oracle_learn',
  'oracle_thread',
  'oracle_thread_update',
  'oracle_trace',
  'oracle_supersede',
  'oracle_handoff',
];

class OracleMCPServer {
  private server: Server;
  private sqlite: Database | null = null;
  private db: BunSQLiteDatabase<typeof schema> | null = null;
  private repoRoot: string;
  private vectorStore: VectorStoreAdapter | null = null;
  private vectorStatus: 'unknown' | 'connected' | 'unavailable' = 'unknown';
  private readOnly: boolean;
  private version: string;
  private disabledTools: Set<string>;
  private stopToolGroupsWatch: (() => void) | null = null;
  private embeddedReady: Promise<void> | null = null;
  private readonly oracleApiBase: string | null;

  constructor(options: { readOnly?: boolean; toolGroups?: ToolGroupConfig } = {}) {
    this.readOnly = options.readOnly ?? false;
    this.oracleApiBase = resolveOracleApiBase();
    
    // Safe REPO_ROOT: never falls back to process.cwd() to avoid parasitic ψ/ dirs
    this.repoRoot = REPO_ROOT;
    
    // Hot reload: rebuild disabled tool set when config changes
    if (!options.toolGroups && process.env.ORACLE_TOOL_GROUPS_HOT_RELOAD !== '0') {
      this.stopToolGroupsWatch = watchToolGroupConfig((next) => {
        const nextDisabled = getDisabledTools(next);
        this.disabledTools.clear();
        for (const t of nextDisabled) this.disabledTools.add(t);
      }, this.repoRoot);
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Arra Oracle MCP Server running on stdio (FTS5 mode)');
  }
}

async function main() {
  const readOnly = process.env.ORACLE_READ_ONLY === 'true' || process.argv.includes('--read-only');
  const server = new OracleMCPServer({ readOnly });

  // Connect stdio transport FIRST (answers MCP initialize immediately)
  // Vector pre-connect is optional background task (never blocks handshake)
  await server.run();

  // Warm vector store in background
  console.error('[Startup] Pre-connecting to vector store (background)...');
  server.preConnectVector()
    .catch((e) => console.error('[Startup] Vector store pre-connect failed:', e));
}

if (import.meta.main) {
  main().catch(console.error);
}
```

### Tool Registration Pattern

```typescript
// List available tools handler
this.server.setRequestHandler(ListToolsRequestSchema, async () => {
  const allTools = [
    // Meta-documentation tool
    {
      name: '____IMPORTANT',
      description: `ORACLE WORKFLOW GUIDE (v${this.version}):...`,
      inputSchema: { type: 'object', properties: {} }
    },
    // Core tools
    searchToolDef,
    readToolDef,
    learnToolDef,
    listToolDef,
    statsToolDef,
    conceptsToolDef,
    // Forum, Trace, Supersede, Handoff, Inbox
    ...forumToolDefs,
    ...traceToolDefs,
    supersedeToolDef,
    handoffToolDef,
    inboxToolDef,
    // Standalone tools
    reflectToolDef,
    verifyToolDef,
  ];

  const tools = filterAdvertisedTools(allTools, this.disabledTools, this.readOnly);
  return { tools };
});

// Tool call dispatch handler
this.server.setRequestHandler(CallToolRequestSchema, async (request): Promise<any> => {
  const toolName = resolveToolName(request.params.name);

  if (this.disabledTools.has(toolName)) {
    return {
      content: [{
        type: 'text',
        text: `Error: Tool "${toolName}" is disabled by tool group config.`
      }],
      isError: true
    };
  }

  if (this.readOnly && WRITE_TOOLS.includes(toolName)) {
    return {
      content: [{
        type: 'text',
        text: `Error: Tool "${toolName}" is disabled in read-only mode.`
      }],
      isError: true
    };
  }

  const args = (request.params.arguments && typeof request.params.arguments === 'object')
    ? request.params.arguments as Record<string, unknown>
    : {};

  // Try HTTP proxy first (if configured)
  const proxied = await this.proxyToolCall(toolName, args);
  if (proxied) return proxied;

  // Fall back to embedded handlers
  switch (toolName) {
    case 'oracle_search': {
      const ctx = await this.getToolCtx();
      return await handleSearch(ctx, request.params.arguments as unknown as OracleSearchInput);
    }
    // ... more cases ...
  }
});
```

---

## Core Architecture

### Lazy Initialization Pattern

The Oracle MCP server uses lazy initialization to avoid blocking the MCP handshake:

```typescript
private embeddedReady: Promise<void> | null = null;

private async getToolCtx(): Promise<ToolContext> {
  if (!this.embeddedReady) {
    this.embeddedReady = this.initEmbedded();
  }
  await this.embeddedReady;
  if (!this.sqlite || !this.db || !this.vectorStore) {
    throw new Error('Embedded Oracle resources failed to initialize');
  }
  return {
    db: this.db,
    sqlite: this.sqlite,
    repoRoot: this.repoRoot,
    vectorStore: this.vectorStore,
    vectorStatus: this.vectorStatus,
    version: this.version,
  };
}

private async initEmbedded(): Promise<void> {
  if (this.sqlite && this.db && this.vectorStore) return;

  const [{ createVectorStore }, { createDatabase }] = await Promise.all([
    import('./vector/factory.ts'),
    import('./db/index.ts'),
  ]);

  this.vectorStore = createVectorStore({
    type: 'lancedb',
    collectionName: 'oracle_knowledge_bge_m3',
    embeddingProvider: 'ollama',
    embeddingModel: 'bge-m3',
  });

  const { sqlite, db } = createDatabase(DB_PATH);
  this.sqlite = sqlite;
  this.db = db;
  await this.verifyVectorHealth();
}
```

### Vector Health Verification

```typescript
private async verifyVectorHealth(): Promise<void> {
  if (!this.vectorStore) {
    this.vectorStatus = 'unavailable';
    return;
  }
  try {
    const stats = await this.vectorStore.getStats();
    if (stats.count > 0) {
      this.vectorStatus = 'connected';
      console.error(`[VectorDB:${this.vectorStore.name}] ✓ oracle_knowledge: ${stats.count} documents`);
    } else {
      this.vectorStatus = 'connected';
      console.error(`[VectorDB:${this.vectorStore.name}] ✓ Connected but collection empty`);
    }
  } catch (e) {
    this.vectorStatus = 'unavailable';
    console.error(`[VectorDB:${this.vectorStore.name}] ✗ Cannot connect:`, e instanceof Error ? e.message : String(e));
  }
}
```

---

## Key Patterns & Idioms

### 1. Tool Context Pattern

All tool handlers receive a unified `ToolContext` object instead of `this`:

```typescript
export interface ToolContext {
  db: BunSQLiteDatabase<typeof schema>;
  sqlite: Database;
  repoRoot: string;
  vectorStore: VectorStoreAdapter;
  vectorStatus: 'unknown' | 'connected' | 'unavailable';
  version: string;
}

export interface ToolResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

// All handlers follow this signature:
export async function handleSearch(ctx: ToolContext, input: OracleSearchInput): Promise<ToolResponse>
```

### 2. Pure Helper Function Export

Tool handlers export pure helper functions for testability:

```typescript
// search.ts — exported for unit tests
export function sanitizeFtsQuery(query: string): string {
  const tokens = query
    .replace(/<[^>]*>/g, ' ')
    .normalize('NFKC')
    .match(/[\p{L}\p{N}_]+/gu)
    ?.map((token) => token.trim())
    .filter((token) => token.length > 0)
    .slice(0, 8) ?? [];

  const uniqueTokens = Array.from(new Set(tokens));
  return uniqueTokens.map((token) => `"${token.replace(/"/g, '""')}"`).join(' OR ');
}

export function normalizeFtsScore(rank: number): number {
  const absRank = Math.abs(rank);
  return Math.exp(-0.3 * absRank);
}

export function parseConceptsFromMetadata(concepts: unknown): string[] {
  if (!concepts) return [];
  if (Array.isArray(concepts)) return concepts;
  if (typeof concepts === 'string') {
    try {
      const parsed = JSON.parse(concepts);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}
```

### 3. Hybrid Search Combination

```typescript
export function combineResults(
  ftsResults: Array<{
    id: string;
    type: string;
    content: string;
    source_file: string;
    concepts: string[];
    score: number;
    source: 'fts';
  }>,
  vectorResults: Array<{
    id: string;
    type: string;
    content: string;
    source_file: string;
    concepts: string[];
    score: number;
    distance: number;
    model: string;
    source: 'vector';
  }>,
  ftsWeight: number = 0.5,
  vectorWeight: number = 0.5
): Array<{
  id: string;
  type: string;
  content: string;
  source_file: string;
  concepts: string[];
  score: number;
  source: 'fts' | 'vector' | 'hybrid';
  ftsScore?: number;
  vectorScore?: number;
  distance?: number;
  model?: string;
}> {
  const resultMap = new Map<string, { /* ... */ }>();

  // Add FTS results
  for (const result of ftsResults) {
    resultMap.set(result.id, {
      id: result.id,
      type: result.type,
      content: result.content,
      source_file: result.source_file,
      concepts: result.concepts,
      ftsScore: result.score,
      source: 'fts',
    });
  }

  // Add/merge vector results
  for (const result of vectorResults) {
    const existing = resultMap.get(result.id);
    if (existing) {
      existing.vectorScore = result.score;
      existing.source = 'hybrid';
      existing.distance = result.distance;
      existing.model = result.model;
    } else {
      resultMap.set(result.id, {
        id: result.id,
        type: result.type,
        content: result.content,
        source_file: result.source_file,
        concepts: result.concepts,
        vectorScore: result.score,
        distance: result.distance,
        model: result.model,
        source: 'vector',
      });
    }
  }

  // Calculate hybrid scores with 10% boost for matches in both modes
  const combined = Array.from(resultMap.values()).map((result) => {
    let score: number;

    if (result.source === 'hybrid') {
      const fts = result.ftsScore ?? 0;
      const vec = result.vectorScore ?? 0;
      score = ((ftsWeight * fts) + (vectorWeight * vec)) * 1.1; // 10% boost
    } else if (result.source === 'fts') {
      score = (result.ftsScore ?? 0) * ftsWeight;
    } else {
      score = (result.vectorScore ?? 0) * vectorWeight;
    }

    return { /* ... */ score, /* ... */ };
  });

  combined.sort((a, b) => b.score - a.score);
  return combined;
}
```

### 4. Lazy Module Loading (Avoiding TDZ)

When modules need to be imported dynamically (e.g., to avoid circular dependencies or top-level await issues):

```typescript
// From learn.ts
let enqueueIndexJob: ((sqlite: any, opts: any) => void) | null = null;
let enqueueLoaded = false;
async function loadEnqueue(): Promise<typeof enqueueIndexJob> {
  if (enqueueLoaded) return enqueueIndexJob;
  enqueueLoaded = true;
  try {
    enqueueIndexJob = (await import('../indexer/jobs.ts')).enqueueIndexJob;
  } catch {
    // Indexer not available — learn still works, just no async job queuing
  }
  return enqueueIndexJob;
}

let getVaultPsiRootFn: typeof import('../vault/handler.ts').getVaultPsiRoot | null = null;
async function loadGetVaultPsiRoot(): Promise<typeof import('../vault/handler.ts').getVaultPsiRoot> {
  if (!getVaultPsiRootFn) {
    getVaultPsiRootFn = (await import('../vault/handler.ts')).getVaultPsiRoot;
  }
  return getVaultPsiRootFn;
}
```

### 5. Query Value Sanitization

```typescript
function cleanQueryValue(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return undefined;
}

function queryFrom(input: Record<string, unknown>, fields: Record<string, string>): Record<string, string> {
  const query: Record<string, string> = {};
  for (const [sourceKey, targetKey] of Object.entries(fields)) {
    const value = cleanQueryValue(input[sourceKey]);
    if (value !== undefined) query[targetKey] = value;
  }
  return query;
}

function appendQuery(pathname: string, query?: Record<string, unknown>): string {
  if (!query || Object.keys(query).length === 0) return pathname;
  const params = new URLSearchParams();
  for (const [key, raw] of Object.entries(query)) {
    const value = cleanQueryValue(raw);
    if (value !== undefined) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
```

### 6. HTTP Proxy Request Mapping

The MCP server can proxy tool calls to HTTP endpoints:

```typescript
type ProxyRequest = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, unknown>;
  body?: unknown;
};

function proxyRequestForTool(toolName: string, args: Record<string, unknown>): ProxyRequest | null {
  switch (toolName) {
    case 'oracle_search':
      return {
        method: 'GET',
        path: '/api/search',
        query: {
          q: args.query,
          ...queryFrom(args, {
            type: 'type',
            limit: 'limit',
            offset: 'offset',
            mode: 'mode',
            project: 'project',
            cwd: 'cwd',
            model: 'model',
          }),
        },
      };
    case 'oracle_learn':
      return { method: 'POST', path: '/api/learn', body: args };
    case 'oracle_supersede':
      return { method: 'POST', path: '/api/supersede/document', body: args };
    case 'oracle_trace':
      return { method: 'POST', path: '/api/traces', body: args };
    case 'oracle_thread': {
      return {
        method: 'POST',
        path: '/api/thread',
        body: {
          message: args.message,
          thread_id: args.threadId,
          title: args.title,
          role: args.role ?? 'claude',
          model: args.model,
        },
      };
    }
    // ... more mappings ...
    default:
      return null;
  }
}

async function readHttpPayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function httpPayloadToToolResponse(payload: unknown, isError = false): ToolResponse {
  return {
    content: [{
      type: 'text',
      text: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2),
    }],
    ...(isError ? { isError: true } : {}),
  };
}
```

---

## Database Schema

### Document Management

```typescript
// Main document index table
export const oracleDocuments = sqliteTable('oracle_documents', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  sourceFile: text('source_file').notNull(),
  concepts: text('concepts').notNull(), // JSON array
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  indexedAt: integer('indexed_at').notNull(),
  
  // Supersede pattern (Issue #19) - "Nothing is Deleted" 
  supersededBy: text('superseded_by'),      // ID of newer document
  supersededAt: integer('superseded_at'),   // When it was superseded
  supersededReason: text('superseded_reason'), // Why (optional)
  
  // Provenance tracking (Issue #22)
  origin: text('origin'),                   // 'mother' | 'arthur' | 'volt' | 'human' | null
  project: text('project'),                 // ghq-style: 'github.com/laris-co/arra-oracle'
  createdBy: text('created_by'),            // 'indexer' | 'oracle_learn' | 'manual'
}, (table) => [
  index('idx_source').on(table.sourceFile),
  index('idx_type').on(table.type),
  index('idx_superseded').on(table.supersededBy),
  index('idx_origin').on(table.origin),
  index('idx_project').on(table.project),
]);
```

### Indexing Job Queue (Per-Document Per-Model)

```typescript
// Foundation for indexer-CLI / FTS-first / vector-later split
// A doc gets FTS5-inserted synchronously, then one row per registered
// model lands here for the daemon to embed asynchronously.
export const indexingJobs = sqliteTable('indexing_jobs', {
  id: text('id').primaryKey(),                                  // "idx-<ts>-<modelKey>-<rand>"
  docId: text('doc_id').notNull(),                              // FK to oracle_documents.id
  modelKey: text('model_key').notNull(),                        // "bge-m3", "qwen3", ...
  collection: text('collection').notNull(),                     // "oracle_knowledge_bge_m3"
  status: text('status').default('pending').notNull(),          // pending | claimed | done | error
  attempts: integer('attempts').default(0).notNull(),
  createdAt: integer('created_at')
    .default(sql`(strftime('%s','now')*1000)`)
    .notNull(),
  claimedAt: integer('claimed_at'),
  finishedAt: integer('finished_at'),
  error: text('error'),
});
```

### Trace Logging (Discovery Sessions)

```typescript
// Captures /trace sessions with actionable dig points
export const traceLog = sqliteTable('trace_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  traceId: text('trace_id').unique().notNull(),
  query: text('query').notNull(),
  queryType: text('query_type').default('general'),  // general, project, pattern, evolution

  // Dig Points (JSON arrays)
  foundFiles: text('found_files'),            // [{path, type, matchReason, confidence}]
  foundCommits: text('found_commits'),        // [{hash, shortHash, date, message}]
  foundIssues: text('found_issues'),          // [{number, title, state, url}]
  foundRetrospectives: text('found_retrospectives'),  // [paths]
  foundLearnings: text('found_learnings'),    // [paths]
  foundResonance: text('found_resonance'),    // [paths]

  // Counts (for quick stats)
  fileCount: integer('file_count').default(0),
  commitCount: integer('commit_count').default(0),
  issueCount: integer('issue_count').default(0),

  // Recursion (hierarchical)
  depth: integer('depth').default(0),         // 0 = initial, 1+ = dig from parent
  parentTraceId: text('parent_trace_id'),     // Links to parent trace
  childTraceIds: text('child_trace_ids').default('[]'),  // Links to child traces

  // Linked list (horizontal chain)
  // ... linkedListFields ...
});
```

---

## Vector Store Implementation

### Pluggable Interface

```typescript
export interface VectorDocument {
  id: string;
  document: string;
  metadata: Record<string, string | number>;
  /**
   * Optional precomputed embedding. When present, adapters MUST use this
   * vector and skip the embedder. Lets a caller (e.g. the indexer worker
   * loop) embed once and route the vector to storage without a second Ollama call.
   */
  vector?: number[];
}

export interface VectorQueryResult {
  ids: string[];
  documents: string[];
  distances: number[];
  metadatas: any[];
}

/**
 * Pluggable vector store interface.
 * Any vector DB (ChromaDB, sqlite-vec, Qdrant, LanceDB) implements this.
 */
export interface VectorStoreAdapter {
  readonly name: string;
  connect(): Promise<void>;
  close(): Promise<void>;
  ensureCollection(): Promise<void>;
  deleteCollection(): Promise<void>;
  addDocuments(docs: VectorDocument[]): Promise<void>;
  
  /**
   * Replace collection contents without dropping/recreating the table.
   * Optional: not every backend has an efficient whole-table replace primitive.
   * Callers that hold long-lived handles rely on this for reindex paths:
   * drop/recreate invalidates LanceDB table handles and can produce silent corruption.
   */
  replaceDocuments?(docs: VectorDocument[]): Promise<void>;
  
  query(text: string, limit?: number, where?: Record<string, any>): Promise<VectorQueryResult>;
  queryById(id: string, nResults?: number): Promise<VectorQueryResult>;
  getStats(): Promise<{ count: number }>;
  getCollectionInfo(): Promise<{ count: number; name: string }>;
  getAllEmbeddings?(limit?: number): Promise<{ ids: string[]; embeddings: number[][]; metadatas: any[] }>;
}

export interface EmbeddingProvider {
  readonly name: string;
  readonly dimensions: number;
  embed(texts: string[], type?: EmbedType): Promise<number[][]>;
}

export type VectorDBType = 'chroma' | 'sqlite-vec' | 'lancedb' | 'qdrant' | 'cloudflare-vectorize';
export type EmbeddingProviderType = 'chromadb-internal' | 'ollama' | 'openai' | 'cloudflare-ai';
```

### Factory Pattern

```typescript
export interface VectorStoreConfig {
  type?: VectorDBType;
  collectionName?: string;
  dataPath?: string;
  pythonVersion?: string;
  embeddingProvider?: EmbeddingProviderType;
  embeddingModel?: string;
  qdrantUrl?: string;
  qdrantApiKey?: string;
  cfAccountId?: string;
  cfApiToken?: string;
}

/**
 * Create a VectorStoreAdapter from config or env vars.
 *
 * Env vars:
 *   ORACLE_VECTOR_DB          = 'chroma' | 'sqlite-vec' | 'lancedb' | 'qdrant' | 'cloudflare-vectorize'
 *   ORACLE_EMBEDDING_PROVIDER = 'chromadb-internal' | 'ollama' | 'openai' | 'cloudflare-ai'
 *   ORACLE_EMBEDDING_MODEL    = model name override
 *   ORACLE_VECTOR_DB_PATH     = sqlite-vec / lancedb path
 *   CLOUDFLARE_ACCOUNT_ID     = CF account (for cloudflare-vectorize)
 *   CLOUDFLARE_API_TOKEN      = CF API token (for cloudflare-vectorize)
 */
export function createVectorStore(config: VectorStoreConfig = {}): VectorStoreAdapter {
  const type = config.type
    || (process.env.ORACLE_VECTOR_DB as VectorDBType)
    || 'lancedb';

  const collectionName = config.collectionName || COLLECTION_NAME;
  const disabledReason = localNativeVectorDisabledReason(type);
  if (disabledReason) {
    logLocalVectorDisabled(disabledReason);
    throw new Error(disabledReason);
  }

  switch (type) {
    case 'sqlite-vec': {
      const dbPath = config.dataPath || process.env.ORACLE_VECTOR_DB_PATH || VECTORS_DB_PATH;
      const embeddingType = config.embeddingProvider || (process.env.ORACLE_EMBEDDING_PROVIDER as EmbeddingProviderType) || 'ollama';
      const embeddingModel = config.embeddingModel || process.env.ORACLE_EMBEDDING_MODEL;
      const embedder = createEmbeddingProvider(embeddingType, embeddingModel);
      return new SqliteVecAdapter(collectionName, dbPath, embedder);
    }

    case 'lancedb': {
      const dbPath = config.dataPath || process.env.ORACLE_VECTOR_DB_PATH || LANCEDB_DIR;
      const embeddingType = config.embeddingProvider || (process.env.ORACLE_EMBEDDING_PROVIDER as EmbeddingProviderType) || 'ollama';
      const embeddingModel = config.embeddingModel || process.env.ORACLE_EMBEDDING_MODEL;
      const embedder = createEmbeddingProvider(embeddingType, embeddingModel);
      return new LanceDBAdapter(collectionName, dbPath, embedder);
    }

    case 'qdrant': {
      const embeddingType = config.embeddingProvider || (process.env.ORACLE_EMBEDDING_PROVIDER as EmbeddingProviderType) || 'ollama';
      const embeddingModel = config.embeddingModel || process.env.ORACLE_EMBEDDING_MODEL;
      const embedder = createEmbeddingProvider(embeddingType, embeddingModel);
      return new QdrantAdapter(collectionName, embedder, {
        url: config.qdrantUrl || process.env.QDRANT_URL,
        apiKey: config.qdrantApiKey || process.env.QDRANT_API_KEY,
      });
    }

    case 'cloudflare-vectorize': {
      const cfConfig = {
        accountId: config.cfAccountId || process.env.CLOUDFLARE_ACCOUNT_ID,
        apiToken: config.cfApiToken || process.env.CLOUDFLARE_API_TOKEN,
      };
      const embeddingModel = config.embeddingModel || process.env.ORACLE_EMBEDDING_MODEL;
      // Default to Cloudflare AI embeddings (same platform, zero egress)
      const embedder = new CloudflareAIEmbeddings({ ...cfConfig, model: embeddingModel });
      return new CloudflareVectorizeAdapter(collectionName, embedder, cfConfig);
    }

    case 'chroma':
    default: {
      const dataPath = config.dataPath || CHROMADB_DIR;
      const pythonVersion = config.pythonVersion || '3.12';
      return new ChromaMcpAdapter(collectionName, dataPath, pythonVersion);
    }
  }
}
```

---

## Tool Handlers

### Search Tool Definition

```typescript
export const searchToolDef = {
  name: 'oracle_search',
  description: 'Search Oracle knowledge base using hybrid search (FTS5 keywords + ChromaDB vectors). Finds relevant principles, patterns, learnings, or retrospectives. Falls back to FTS5-only if ChromaDB unavailable.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query (e.g., "nothing deleted", "force push safety")'
      },
      type: {
        type: 'string',
        enum: ['principle', 'pattern', 'learning', 'retro', 'all'],
        description: 'Filter by document type',
        default: 'all'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results',
        default: 5
      },
      offset: {
        type: 'number',
        description: 'Number of results to skip (for pagination)',
        default: 0
      },
      mode: {
        type: 'string',
        enum: ['hybrid', 'fts', 'vector'],
        description: 'Search mode: hybrid (default), fts (keywords only), vector (semantic only)',
        default: 'hybrid'
      },
      project: {
        type: 'string',
        description: 'Filter by project (e.g., "github.com/owner/repo"). Returns project + universal results.'
      },
      cwd: {
        type: 'string',
        description: 'Auto-detect project from working directory path (follows symlinks to ghq paths)'
      },
      model: {
        type: 'string',
        enum: ['nomic', 'qwen3', 'bge-m3'],
        description: 'Embedding model: bge-m3 (default, multilingual Thai↔EN, 1024-dim), nomic (fast, 768-dim), or qwen3 (cross-language, 4096-dim)',
      }
    },
    required: ['query']
  }
};
```

### Learn Tool with Project Normalization

```typescript
export const learnToolDef = {
  name: 'oracle_learn',
  description: 'Add a new pattern or learning to the Oracle knowledge base. Creates a markdown file in ψ/memory/learnings/ and indexes it.',
  inputSchema: {
    type: 'object',
    properties: {
      pattern: {
        type: 'string',
        description: 'The pattern or learning to add (can be multi-line)'
      },
      source: {
        type: 'string',
        description: 'Optional source attribution (defaults to "Oracle Learn")'
      },
      concepts: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional concept tags (e.g., ["git", "safety", "trust"])'
      },
      project: {
        type: 'string',
        description: 'Source project. Accepts: "github.com/owner/repo", "owner/repo", local path with ghq/Code prefix, or GitHub URL. Auto-normalized to "github.com/owner/repo" format.'
      }
    },
    required: ['pattern']
  }
};

// Project normalization helpers
export function normalizeProject(input?: string): string | null {
  if (!input) return null;

  // Already normalized
  if (input.match(/^github\.com\/[^\/]+\/[^\/]+$/)) {
    return input.toLowerCase();
  }

  // GitHub URL
  const urlMatch = input.match(/https?:\/\/github\.com\/([^\/]+\/[^\/]+)/);
  if (urlMatch) return `github.com/${urlMatch[1].replace(/\.git$/, '')}`.toLowerCase();

  // Local path with github.com
  const pathMatch = input.match(/github\.com\/([^\/]+\/[^\/]+)/);
  if (pathMatch) return `github.com/${pathMatch[1]}`.toLowerCase();

  // Short format: owner/repo
  const shortMatch = input.match(/^([^\/\s]+\/[^\/\s]+)$/);
  if (shortMatch) return `github.com/${shortMatch[1]}`.toLowerCase();

  return null;
}

// Extract project from source field (fallback)
export function extractProjectFromSource(source?: string): string | null {
  if (!source) return null;

  const oracleLearnMatch = source.match(/from\s+(github\.com\/[^\/\s]+\/[^\/\s]+)/);
  if (oracleLearnMatch) return oracleLearnMatch[1].toLowerCase();

  const rrrMatch = source.match(/^rrr:\s*([^\/\s]+\/[^\/\s]+)/);
  if (rrrMatch) return `github.com/${rrrMatch[1]}`.toLowerCase();

  const directMatch = source.match(/(github\.com\/[^\/\s]+\/[^\/\s]+)/);
  if (directMatch) return directMatch[1].toLowerCase();

  return null;
}
```

### Trace Tool with Dig Points

```typescript
export const traceToolDef = {
  name: 'oracle_trace',
  description: 'Log a trace session with dig points (files, commits, issues found). Use to capture /trace command results for future exploration.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'What was traced (required)' },
      queryType: { type: 'string', enum: ['general', 'project', 'pattern', 'evolution'], description: 'Type of trace query', default: 'general' },
      foundFiles: { type: 'array', items: { type: 'object', properties: { path: { type: 'string' }, type: { type: 'string', enum: ['learning', 'retro', 'resonance', 'other'] }, matchReason: { type: 'string' }, confidence: { type: 'string', enum: ['high', 'medium', 'low'] } } }, description: 'Files discovered' },
      foundCommits: { type: 'array', items: { type: 'object', properties: { hash: { type: 'string' }, shortHash: { type: 'string' }, date: { type: 'string' }, message: { type: 'string' } } }, description: 'Commits discovered' },
      foundIssues: { type: 'array', items: { type: 'object', properties: { number: { type: 'number' }, title: { type: 'string' }, state: { type: 'string', enum: ['open', 'closed'] }, url: { type: 'string' } } }, description: 'GitHub issues discovered' },
      foundRetrospectives: { type: 'array', items: { type: 'string' }, description: 'Retrospective file paths' },
      foundLearnings: { type: 'array', items: { type: 'string' }, description: 'Learning file paths' },
      scope: { type: 'string', enum: ['project', 'cross-project', 'human'], description: 'Trace scope. project=single repo, cross-project=spans repos, human=about the person' },
      parentTraceId: { type: 'string', description: 'Parent trace ID if this is a dig from another trace' },
      project: { type: 'string', description: 'Project context (ghq format)' },
      agentCount: { type: 'number', description: 'Number of agents used in trace' },
      durationMs: { type: 'number', description: 'How long trace took in milliseconds' },
    },
    required: ['query']
  }
};

export const traceChainToolDef = {
  name: 'oracle_trace_chain',
  description: 'Get the full linked chain for a trace. Returns all traces in the chain and the position of the requested trace.',
  inputSchema: {
    type: 'object',
    properties: {
      traceId: { type: 'string', description: 'UUID of any trace in the chain' },
    },
    required: ['traceId']
  }
};
```

---

## Configuration System

### Path Resolution (`src/config.ts`)

```typescript
/**
 * Arra Oracle Configuration
 *
 * Resolves paths from const.ts + environment variables.
 * No DB connections, no table creation.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as C from './const.ts';

// ES Module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root (parent of src/)
const PROJECT_ROOT = path.resolve(__dirname, '..');

// HOME — fail fast if not set
const home = process.env.HOME || process.env.USERPROFILE;
if (!home) throw new Error('HOME environment variable not set — cannot resolve paths');
export const HOME_DIR = home;

// Core paths
export const PORT = parseInt(String(process.env.ORACLE_PORT || C.ORACLE_DEFAULT_PORT), 10);
export const ORACLE_DATA_DIR = process.env.ORACLE_DATA_DIR || path.join(HOME_DIR, C.ORACLE_DATA_DIR_NAME);
export const DB_PATH = process.env.ORACLE_DB_PATH || path.join(ORACLE_DATA_DIR, C.ORACLE_DB_FILE);

// REPO_ROOT: where ψ/ lives.
// Priority:
//   1. ORACLE_REPO_ROOT env var — explicit override
//   2. ORACLE_DATA_DIR if it has ψ/ — canonical data location (outside code repo)
//   3. PROJECT_ROOT if it has ψ/ — dev mode for indexing the oracle's own psi
//   4. ORACLE_DATA_DIR — default (will be empty initially)
export const REPO_ROOT = process.env.ORACLE_REPO_ROOT ||
  (fs.existsSync(path.join(ORACLE_DATA_DIR, 'ψ')) ? ORACLE_DATA_DIR :
   fs.existsSync(path.join(PROJECT_ROOT, 'ψ')) ? PROJECT_ROOT : ORACLE_DATA_DIR);

// Derived paths — import these, don't compute inline
export const FEED_LOG = path.join(ORACLE_DATA_DIR, C.FEED_LOG_FILE);
export const PLUGINS_DIR = path.join(ORACLE_DATA_DIR, C.PLUGINS_DIR_NAME);
export const SCHEDULE_PATH = path.join(ORACLE_DATA_DIR, C.SCHEDULE_FILE);
export const VECTORS_DB_PATH = path.join(ORACLE_DATA_DIR, C.VECTORS_DB_FILE);
export const LANCEDB_DIR = path.join(ORACLE_DATA_DIR, C.LANCEDB_DIR_NAME);
export const CHROMADB_DIR = path.join(HOME_DIR, C.CHROMADB_DIR_NAME);

// Ensure data directory exists (for fresh installs via bunx)
if (!fs.existsSync(ORACLE_DATA_DIR)) {
  fs.mkdirSync(ORACLE_DATA_DIR, { recursive: true });
}

// Vector layer routing (#1071 phase 1.2)
export function isVectorServerEntrypoint(argv1: string | undefined): boolean {
  return /(^|[/\\])vector-server\.(ts|js|mjs)$/.test(argv1 || '');
}

export function resolveVectorUrl(
  env: Record<string, string | undefined> = process.env,
  argv: string[] = process.argv,
): string {
  if (env.ORACLE_VECTOR_SERVER === '1' || isVectorServerEntrypoint(argv[1])) {
    return '';
  }
  if (env.VECTOR_URL?.trim()) return env.VECTOR_URL.trim();

  // Durable cloud/sidecar routing: if vector-server.json declares a remote
  // proxy URL, the core server uses it for vector legs while FTS remains local.
  try {
    const dataDir = env.ORACLE_DATA_DIR || process.env.ORACLE_DATA_DIR || ORACLE_DATA_DIR;
    const raw = fs.readFileSync(path.join(dataDir, 'vector-server.json'), 'utf-8');
    const config = JSON.parse(raw) as { vectorProxyUrl?: unknown; vectorUrl?: unknown };
    const fromConfig = typeof config.vectorProxyUrl === 'string'
      ? config.vectorProxyUrl
      : typeof config.vectorUrl === 'string'
        ? config.vectorUrl
        : '';
    return fromConfig.trim();
  } catch {
    return '';
  }
}

export const VECTOR_URL = resolveVectorUrl();
export const VECTOR_FALLBACK = process.env.VECTOR_FALLBACK || 'fts5';
```

### Constants (`src/const.ts`)

```typescript
/**
 * Pure constants — no imports, no side effects, no path resolution.
 * Change a name here → propagates everywhere via config.ts.
 */

export const ORACLE_DEFAULT_PORT = 47778;
export const ORACLE_DATA_DIR_NAME = '.arra-oracle-v2';
export const ORACLE_DB_FILE = 'oracle.db';
export const FEED_LOG_FILE = 'feed.log';
export const PLUGINS_DIR_NAME = 'plugins';
export const SCHEDULE_FILE = 'ψ/inbox/schedule.md';
export const VECTORS_DB_FILE = 'vectors.db';
export const LANCEDB_DIR_NAME = 'lancedb';
export const CHROMADB_DIR_NAME = '.chromadb';
export const MCP_SERVER_NAME = 'arra-oracle-v3';
export const COLLECTION_NAME = 'oracle_knowledge';
export const PID_FILE_NAME = 'oracle-http.pid';
export const ORACLENET_DEFAULT_URL = 'https://urchin-app-csg5x.ondigitalocean.app';
```

---

## Notable Patterns

### 1. "Nothing is Deleted" Philosophy

Documents are never deleted, only superseded:

```typescript
// From search.ts
// Enrich with supersede flags (P-001 "Nothing is Deleted" — superseded docs
// remain searchable; callers need to see the flag to decide whether to
// follow the replacement pointer).
if (results.length > 0) {
  const ids = results.map(r => r.id as string);
  const placeholders = ids.map(() => '?').join(',');
  const supersedeRows = ctx.sqlite.prepare(`
    SELECT id, superseded_by, superseded_at, superseded_reason
    FROM oracle_documents
    WHERE id IN (${placeholders}) AND superseded_by IS NOT NULL
  `).all(...ids) as Array<{
    id: string;
    superseded_by: string;
    superseded_at: number;
    superseded_reason: string | null;
  }>;
  const supersedeMap = new Map(supersedeRows.map(r => [r.id, r]));
  for (const r of results) {
    const s = supersedeMap.get(r.id as string);
    if (s) {
      r.superseded_by = s.superseded_by;
      r.superseded_at = new Date(s.superseded_at).toISOString();
      r.superseded_reason = s.superseded_reason;
    }
  }
}
```

### 2. Project-Scoped + Universal Documents

Documents can be project-specific or universal (NULL project):

```typescript
// From search.ts handler
// Project filter: if project specified, include project + universal (NULL)
// If no project, return ALL documents (no filter)
const projectFilter = resolvedProject
  ? 'AND (d.project = ? OR d.project IS NULL)'
  : '';
const projectParams = resolvedProject ? [resolvedProject] : [];

if (type === 'all') {
  const stmt = ctx.sqlite.prepare(`
    SELECT f.id, f.content, d.type, d.source_file, d.concepts, rank
    FROM oracle_fts f
    JOIN oracle_documents d ON f.id = d.id
    WHERE oracle_fts MATCH ? ${projectFilter}
    ORDER BY rank
    LIMIT ?
  `);
  ftsRawResults = stmt.all(safeQuery, ...projectParams, limit * 3);
}
```

### 3. Hot Reload Configuration

Tool groups can be hot-reloaded without restarting the server:

```typescript
// From src/index.ts
if (!options.toolGroups && process.env.ORACLE_TOOL_GROUPS_HOT_RELOAD !== '0') {
  this.stopToolGroupsWatch = watchToolGroupConfig((next) => {
    const nextDisabled = getDisabledTools(next);
    this.disabledTools.clear();
    for (const t of nextDisabled) this.disabledTools.add(t);
    const disabledGroups = Object.entries(next)
      .filter(([, v]) => typeof v === 'boolean' && !v)
      .map(([k]) => k);
    const parts: string[] = [];
    if (disabledGroups.length) parts.push(`groups: ${disabledGroups.join(', ')}`);
    if (next.disabled_tools?.length) parts.push(`disabled_tools: ${next.disabled_tools.join(', ')}`);
    if (next.enabled_tools?.length) parts.push(`enabled_tools: ${next.enabled_tools.join(', ')}`);
    console.error(
      parts.length
        ? `[ToolGroups] Reloaded — ${parts.join(' | ')}`
        : '[ToolGroups] Reloaded — all tools enabled',
    );
  }, this.repoRoot);
}
```

### 4. Indexer Configuration

Centralized configuration for consistent indexing across CLI, HTTP API, and batch jobs:

```typescript
export function createIndexerConfig(repoRoot: string): IndexerConfig {
  return {
    repoRoot,
    dbPath: DB_PATH,
    chromaPath: CHROMADB_DIR,
    sourcePaths: {
      resonance: 'ψ/memory/resonance',
      learnings: 'ψ/memory/learnings',
      retrospectives: 'ψ/memory/retrospectives',
      distillations: 'ψ/memory/distillations',
      // Opt-in: set ORACLE_INDEX_SECURITY_CORPUS=1 to include ~36k files
      // (one-time index ~10-30 min).
      security_corpus: process.env.ORACLE_INDEX_SECURITY_CORPUS === '1'
        ? 'ψ/learn/security-corpus'
        : undefined,
    },
  };
}
```

### 5. Hybrid Search with Reranking

Combines FTS5 + vector search, then optionally reranks with a cross-encoder:

```typescript
// From search.ts handler
const combinedResults = combineResults(ftsResults, normalizedVectorResults);

// Reranker pass — cross-encoder over the top of the hybrid list.
// No-op when ORACLE_RERANKER_URL is unset (the helper pass-throughs).
// Empirical lift: +14.3 pts R@1 on cross-language Thai/EN smoke test.
const RERANK_POOL_SIZE = 50;
const rerankHead = combinedResults.slice(0, RERANK_POOL_SIZE);
const rerankTail = combinedResults.slice(RERANK_POOL_SIZE);
const reranked = await rerankCandidates({
  query,
  candidates: rerankHead,
  getText: (r) => r.content,
});
const finalResults = reranked.reranked
  ? [...reranked.results, ...rerankTail]
  : combinedResults;
```

### 6. Tool Coercion Helpers

Type coercion for MCP inputs (which may arrive as strings, arrays, etc.):

```typescript
export function coerceConcepts(concepts: unknown): string[] {
  if (Array.isArray(concepts)) return concepts.map(String);
  if (typeof concepts === 'string') return concepts.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}
```

---

## Summary

**Key Architectural Takeaways:**

1. **MCP Server Pattern**: Slim entry point with lazy embedded initialization to avoid blocking MCP handshake
2. **Tool Context**: All handlers receive a unified context object instead of class methods
3. **Pluggable Vector Stores**: Factory pattern supports multiple backends (LanceDB, ChromaDB, etc.)
4. **Hybrid Search**: FTS5 + vector with optional cross-encoder reranking
5. **"Nothing is Deleted"**: Supersede pattern preserves all history
6. **Project Scoping**: Documents tagged with ghq-style project paths for filtering
7. **Hot Reload**: Tool groups and configuration reloadable without restart
8. **Pure Helpers**: Testable utility functions exported alongside handlers
9. **HTTP Proxy Mode**: MCP server can proxy to HTTP endpoints for distributed deployment
10. **Per-Model Job Queue**: Async indexing per embedding model for multi-index support


# mcp-for-babylon — Project Context

> Use this document to restore full context in any new conversation.
> The README in the repo is **partially outdated** — this document is the ground truth for architecture.

---

## What it is

An MCP server that runs **inside a Babylon.js browser page** and exposes scene objects (cameras, lights, meshes, …) as MCP resources and tools. LLM clients (Claude Code, MCP Inspector, …) can inspect and manipulate a live BJS scene in real time through a standard JSON-RPC interface.

Key inversion: the **browser is the server**, not Node.js. A thin Node.js tunnel bridges HTTP/SSE MCP clients to the browser via WebSocket.

---

## Repository layout (monorepo, npm workspaces)

```
packages/
  dev/
    core/       @dev/core    — transport-agnostic MCP server SDK (TypeScript → UMD)
    babylon/    @dev/babylon — BJS-specific behaviors & adapters (TypeScript → UMD)
    tunnel/     @dev/tunnel  — Node.js WebSocket/HTTP relay
    tools/      @dev/tools   — shared build utilities
  host/
    www/                     — browser dev harness (plain HTML + UMD bundles)
      samples/               — ready-to-use sample scenes
      templates/             — reusable HTML templates
```

---

## Runtime topology

```
MCP Inspector / Claude Code
        │
        │  POST /mcp   (Streamable HTTP, MCP 2025-03-26)
        │  GET  /sse   (SSE stream,      MCP 2024-11-05)
        ▼
┌──────────────────────────┐
│   WsTunnel  (Node.js)    │   packages/dev/tunnel
│   HTTP + WebSocket relay │
└────────────┬─────────────┘
             │  ws://localhost:3000/provider
             ▼
┌──────────────────────────┐
│  McpServer  (browser)    │   @dev/core + @dev/babylon UMD bundles
│  Babylon.js scene page   │
└──────────────────────────┘
```

---

## Core architecture — Behaviour / Adapter pattern

This is the part **not documented in the README**.

### Layer overview

| Layer | Class / Interface | Responsibility |
|---|---|---|
| **JSON-RPC** | `IMcpServerHandlers` | Routes raw JSON-RPC to domain handlers |
| **Server** | `McpServer` / `IMcpServerBuilder` | Aggregates behaviors, manages WS lifecycle |
| **Behavior** | `McpBehavior` (abstract) / `IMcpBehavior` | MCP identity + schema for a *category* of objects |
| **Adapter** | `McpAdapterBase` / `IMcpBehaviorAdapter` | **Only** layer touching BJS directly |
| **State** | Plain TypeScript interfaces | Framework-free serializable snapshots of BJS objects |
| **Events** | `IEventSource<T>` / `IEventEmitter<T>` | Reactive notifications: content changed, list changed |

---

### IMcpBehavior — MCP identity + schema (framework-free)

`IMcpBehavior` is **not generic**. It owns:

- `namespace` — unique prefix for all tool names (`"camera"`, `"light"`)
- `uriTemplate` — RFC 6570 URI pattern for `resources/templates/list`
- `getResources()` — static resource identity for the behavior category
- `getResourceTemplates()` — URI templates for client discovery
- `getTools()` — static JSON Schema tool definitions
- `readResourceAsync(uri)` — runtime delegation to adapter
- `executeToolAsync(uri, toolName, args)` — runtime delegation to adapter

**Important:** `IMcpBehaviorInstance` no longer exists.
The behavior *is* the registered unit, backed by an adapter injected at construction.

Concrete behaviors (`McpCameraBehavior`, `McpLightBehavior`) extend the abstract `McpBehavior`
base class and implement three protected template methods:

```typescript
protected abstract _buildTools(): McpTool[];
protected abstract _buildResources(): McpResource[];
protected abstract _buildTemplate(): McpResourceTemplate[];
```

The behavior itself has **zero knowledge of BabylonJS**. It only holds schemas and delegates
all data access and mutations to its adapter.

---

### IMcpBehaviorAdapter — the only BJS-touching layer

```typescript
interface IMcpBehaviorAdapter extends IMcpRuntimeOperations {
    onResourceContentChanged: IEventSource<string>; // uri of changed resource
    onResourcesChanged: IEventSource<void>;         // structural list change
    domain: string;                                 // e.g. "babylon"
}
```

The adapter:
- Reads live BJS object state and serializes it as `McpResourceContent`
- Executes tool mutations on BJS objects
- Maintains an internal URI→Object index, kept in sync with BJS observables
  (`onNewCameraAddedObservable`, `onCameraRemovedObservable`, etc.)
- Emits events when scene state changes → server translates to MCP notifications

`McpCameraAdapter` and `McpLightAdapter` extend `McpAdapterBase` and are the **only files
that import from `@babylonjs/core`**.

---

### IMcpRuntimeOperations — shared contract

Both `IMcpBehavior` and `IMcpBehaviorAdapter` extend this:

```typescript
interface IMcpRuntimeOperations {
    readResourceAsync(uri: string): Promise<McpResourceContent | undefined>;
    executeToolAsync(uri: string, toolName: string, args: Record<string, unknown>): Promise<McpToolResult>;
}
```

This symmetry lets the server treat behaviors uniformly when routing `resources/read` and `tools/call`.

---

### IMcpDesignOperations — design-time schema only

Only `IMcpBehavior` extends this (not the adapter). Schema is static; execution is runtime.

```typescript
interface IMcpDesignOperations {
    getResources(): McpResource[];
    getResourceTemplates(): McpResourceTemplate[];
    getTools(): McpTool[];
}
```

---

### State types — framework-free snapshots

The `states/` folder contains plain TypeScript interfaces with **zero BJS dependency**:
`ICameraState`, `ILightState`, `IFrustum`, `IPerspectiveFrustum`, `IOrthoFrustum`, etc.

These are serialized to JSON by the adapter and returned as `McpResourceContent.text`.
This keeps the MCP contract layer fully decoupled from the BJS type system.

---

## URI scheme and routing

Constants are defined in `mcp.commons.ts`:

```typescript
export const McpBabylonDomain          = "babylon";
export const McpCameraResourceUriPrefix = "babylon://camera";
export const McpLightResourceUriPrefix  = "babylon://light";
```

The server maintains two lookup structures:

- `_behaviors: Map<namespace, IMcpBehavior>` — keyed by namespace string
- `_resourceIndex: Map<uri, IMcpRuntimeOperations>` — keyed by static resource URI (O(1) fast path)

For template URIs (e.g. `babylon://camera/MyCam`), the server does a regex match:
`{variable}` placeholders are converted to `[^/]+` segments and tested against the full URI.
The first matching behavior handles the call.

---

## McpServer implementation details

`McpServer` implements both `IMcpServer` and `IMcpServerHandlers` — it is its own default handler.
A custom `IMcpServerHandlers` can be injected via the builder to intercept or extend routing.

**Capabilities are auto-derived:** if any behavior is registered:
```typescript
{ resources: { listChanged: true }, tools: { listChanged: true } }
```
No manual capability declaration needed.

**Session lifecycle:**
- `_sessionReady` becomes `true` only after `notifications/initialized` from the client
- `_notifyResourcesListChanged()` is gated on `_sessionReady` — no notifications leak before handshake
- `register()` / `unregister()` trigger `notifications/resources/list_changed` automatically when session is live

**Reconnection:** exponential back-off with jitter `[0.5, 1.0]`:
```
delay = min(baseDelayMs * 2^attempt, maxDelayMs) * jitter
```

---

## Constructing behaviors — constructor injection

Behaviors receive the adapter in their constructor, not via a fluent builder:

```typescript
const cameraAdapter  = new McpCameraAdapter(scene);
const cameraBehavior = new McpCameraBehavior(cameraAdapter);

const lightAdapter  = new McpLightAdapter(scene);
const lightBehavior = new McpLightBehavior(lightAdapter);
```

`McpBehaviorOptions` allows overriding `namespace` and `domain`, defaulting to the
adapter's `domain` and the hardcoded namespace constant (`McpCameraNamespace = "camera"`).

---

## Starting the server

```typescript
const server = McpServerBuilder.create()
    .withName("Babylon Dev Scene")
    .withWsUrl("ws://localhost:3000/provider")
    .withInitializer(new SceneInitializer())
    .register(cameraBehavior, lightBehavior)
    .withOptions({ idleTimeoutMs: 30_000, reconnect: { baseDelayMs: 1000, maxDelayMs: 30_000 } })
    .build();

await server.start();

// Behaviors can be added/removed at runtime, even while running:
server.register(meshBehavior);
server.unregister(lightBehavior);
```

---

## IMcpInitializer — handshake separation

Capabilities are auto-derived. The initializer only provides identity:

```typescript
// returns: { protocolVersion, serverInfo, instructions? }
// does NOT return capabilities — those are auto-derived from registered behaviors
initialize(clientInfo: McpClientInfo, clientCapabilities: McpClientCapabilities): McpServerIdentity
```

---

## Event system

Lightweight pub/sub, no external dependency:

```typescript
interface IEventSource<T> {
    subscribe(handler: (value: T) => void): Unsubscribe; // returns cleanup fn
}
interface IEventEmitter<T> extends IEventSource<T> {
    emit(value: T): void;
    clear(): void;
}
```

Adapters emit on:
- `onResourceContentChanged` (carries the URI) — when a scene object's state changes
- `onResourcesChanged` — when the list of objects changes (camera/light added or removed)

The server subscribes to these and sends MCP notifications to the connected client.

---

## Key design decisions (article material)

1. **Browser as MCP server** — inverts the usual pattern; the 3D page is the server, not a client
2. **Behavior = schema, Adapter = data** — clean separation; behavior has zero BJS imports
3. **State types are framework-free** — `ICameraState` etc. are plain TS interfaces, serializable anywhere
4. **Cardinality lives in the adapter** — one behavior can represent 1 object or 1000, transparently
5. **Capabilities auto-derived** — server introspects registered behaviors at handshake, no manual declaration
6. **URI routing** — every tool call carries a `uri` arg; O(1) static lookup first, regex template match as fallback
7. **Reactive events** — adapters push changes via `IEventSource`, decoupling BJS scene lifecycle from MCP notifications
8. **Session-gated notifications** — `list_changed` notifications suppressed until `notifications/initialized` received
9. **Easing string DSL** — animation tools accept `"sine.out"`, `"elastic.in"` etc., parsed to BJS `EasingFunction` at runtime
10. **Coordinate system bridging** — adapter transparently converts BJS left-handed to right-handed y-up; LH→RH: negate Z (vectors), negate X+Y (quaternions)

---

## What the README gets wrong / doesn't cover

- `IMcpBehaviorInstance` **no longer exists**
- `IMcpBehavior` is **not generic**
- Behavior construction uses **constructor injection**, not a separate fluent `McpBehaviorBuilder`
- The Behavior/Adapter split and `IMcpRuntimeOperations` shared base are undocumented
- `IMcpDesignOperations` / framework-free state types layer is undocumented
- `IEventSource` reactive notification system is undocumented
- Session-gating of notifications (`_sessionReady`) is undocumented
- LH↔RH coordinate system bridging in the adapter is undocumented
- `_buildTools()` / `_buildResources()` / `_buildTemplate()` template method pattern is undocumented

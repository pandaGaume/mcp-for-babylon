# MCP for Babylon

A **Model Context Protocol (MCP) server** that runs inside a Babylon.js scene and
exposes scene objects (meshes, lights, cameras, …) as MCP resources and tools.

This lets LLM clients — **MCP Inspector**, **Claude Code**, and others — inspect and
manipulate your Babylon.js scene in real time through a standard JSON-RPC interface.

---

## Architecture

```
MCP Inspector / Claude Code
        │
        │  POST /mcp   (Streamable HTTP, MCP 2025-03-26)
        │  GET  /sse   (SSE stream,      MCP 2024-11-05)
        │  POST /messages?sessionId=…
        ▼
┌─────────────────────────────┐
│      WsTunnel (Node.js)     │  packages/dev/tunnel
│  HTTP + WebSocket relay     │
└────────────┬────────────────┘
             │  ws://localhost:3000/provider
             ▼
┌─────────────────────────────┐
│  McpServer (browser page)   │  packages/host/www
│  Babylon.js dev harness     │
└─────────────────────────────┘
```

The **browser page** runs an `McpServer` instance (UMD bundle) that registers
Babylon.js scene objects as MCP resources with callable tools.  The **tunnel**
bridges HTTP/SSE MCP clients to the browser's WebSocket connection.

---

## Prerequisites

| Tool    | Version    |
|---------|------------|
| Node.js | ≥ 20.11.0  |
| npm     | ≥ 8.0.0    |
| Browser | Any modern (Chrome, Edge, Firefox) |

> **MCP Inspector** (optional, for interactive testing):
> ```
> npx @modelcontextprotocol/inspector
> ```

---

## Installation

Clone and install all workspace dependencies from the repo root:

```bash
git clone https://github.com/pandaGaume/mcp-for-babylon.git
cd mcp-for-babylon
npm install
```

---

## Build

Two artefacts must be built before you can run the project:

### 1 — UMD browser bundle (`mcp-server.js`)

The Babylon.js page loads this bundle.  It is produced by webpack:

```bash
# Production build (minified)
npm run bundle

# Development build (readable, with source maps)
npm run bundle:dev

# Watch mode — auto-rebuilds on source changes
npm run bundle:watch
```

Output: `packages/dev/core/bundle/mcp-server.js`

### 2 — Tunnel server (Node.js)

```bash
npm run server:build
```

Output: `packages/dev/tunnel/dist/`

### Build everything at once

```bash
npm run bundle:dev && npm run server:build
```

> **Tip — after changing TypeScript source in `packages/dev/core/src/`**,
> always re-run `npm run bundle:dev` so the browser picks up your changes.

---

## Running the dev server

```bash
npm run server:start
```

This builds the tunnel and starts it.  You will see:

```
⚙️  MCP for Babylon — tunnel started
────────────────────────────────────────────────────────
📡  Provider     ws://localhost:3000/provider
🔌  MCP HTTP     http://localhost:3000/mcp   ← MCP Inspector
📺  MCP SSE      http://localhost:3000/sse   ← Claude Code
🖥️   Dev harness  http://localhost:3000/
────────────────────────────────────────────────────────
   Press Ctrl+C to stop.

🚀  Opening dev harness: http://localhost:3000/
```

The dev harness (`index.html`) opens automatically in your default browser.

> Set `MCP_TUNNEL_NO_OPEN=1` to suppress the automatic browser launch.

---

## Connecting the browser provider

1. The browser opens the **dev harness** at `http://localhost:3000/`.
2. Leave the default values in the **Connection** panel:
   - **Tunnel provider URL**: `ws://localhost:3000/provider`
   - **Server name**: `Babylon Dev Scene`
3. Click **▶ Start**.
4. The status badge changes to **Connected**.

The harness registers three mock behaviors (BoxMesh, SphereMesh, Main Camera).
The left panel lists all registered resources and tools.

---

## Testing with MCP Inspector

[MCP Inspector](https://github.com/modelcontextprotocol/inspector) is the reference
interactive client for testing MCP servers.

### Start MCP Inspector

```bash
npx @modelcontextprotocol/inspector
```

MCP Inspector prints its own URL, e.g.:

```
🚀 MCP Inspector is up and running at: http://localhost:6274/
```

### Connect to the tunnel

1. Open MCP Inspector in your browser.
2. In the **Transport** dropdown, select **Streamable HTTP**.
3. Set the URL to:
   ```
   http://localhost:3000/mcp
   ```
4. Click **Connect**.

> Make sure the browser dev harness is already connected (status = **Connected**)
> before clicking Connect in MCP Inspector, otherwise you will receive
> `-32000 No provider connected`.

### Explore resources and tools

| Tab | MCP method | What you see |
|-----|-----------|--------------|
| **Resources** → List | `resources/list` | `mesh://scene/BoxMesh`, `mesh://scene/SphereMesh`, `camera://scene/main` |
| **Resources** → Templates | `resources/templates/list` | `mesh://scene/{meshName}`, `camera://scene/{cameraName}` |
| **Resources** → Read | `resources/read` | JSON state for a specific mesh or camera |
| **Tools** → List | `tools/list` | `set_position`, `set_visibility`, `set_target` |
| **Tools** → Call | `tools/call` | Execute a tool on a specific instance via its URI |

### Example tool call — move BoxMesh

In the **Tools** tab, select `set_position` and pass:

```json
{
  "uri": "mesh://scene/BoxMesh",
  "x": 2,
  "y": 1,
  "z": 0
}
```

The browser log panel will show:

```
✔  BoxMesh.position ← (2, 1, 0)
```

---

## Testing with Claude Code

Add the tunnel as an MCP server in your Claude Code settings.

### Option A — SSE transport (2024-11-05, recommended for Claude Code)

Edit `~/.claude/settings.json` (or open **Settings → MCP Servers**):

```json
{
  "mcpServers": {
    "babylon": {
      "url": "http://localhost:3000/sse"
    }
  }
}
```

### Option B — Streamable HTTP transport (2025-03-26)

```json
{
  "mcpServers": {
    "babylon": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

Restart Claude Code, then verify the server appears under `/mcp` or in the
status bar.  You can now ask Claude to inspect or move scene objects:

> "List all the resources available in the Babylon scene."
> "Move BoxMesh to position (3, 0, -2)."

---

## Environment variables

All variables are optional; the defaults work out-of-the-box for a local dev setup.

| Variable | Default | Description |
|----------|---------|-------------|
| `MCP_TUNNEL_PORT` | `3000` | TCP port for the tunnel HTTP server |
| `MCP_TUNNEL_HOST` | `0.0.0.0` | Bind address |
| `MCP_TUNNEL_PROVIDER_PATH` | `/provider` | WebSocket path for the browser provider |
| `MCP_TUNNEL_CLIENT_PATH` | `/` | WebSocket path for raw WS MCP clients |
| `MCP_TUNNEL_MCP_PATH` | `/mcp` | Streamable HTTP endpoint (MCP 2025-03-26) |
| `MCP_TUNNEL_WWW_DIR` | `packages/host/www` | Directory served as the dev harness |
| `MCP_TUNNEL_BUNDLE_DIR` | `packages/dev/core/bundle` | Directory served under `/bundle/` |
| `MCP_TUNNEL_NO_OPEN` | _(unset)_ | Set to any value to skip auto-opening browser |

---

## Project structure

```
mcp-for-babylon/
├── packages/
│   ├── dev/
│   │   ├── core/           @dev/core — MCP server SDK (TypeScript → UMD)
│   │   │   ├── src/
│   │   │   │   ├── interfaces/       Public TypeScript interfaces
│   │   │   │   └── server/           McpServer, McpServerBuilder, JSON-RPC helpers
│   │   │   └── bundle/               webpack output (mcp-server.js)
│   │   ├── tunnel/         @dev/tunnel — WebSocket/HTTP relay (Node.js)
│   │   │   └── src/
│   │   │       ├── ws.tunnel.ts      WsTunnel class
│   │   │       ├── ws.tunnel.builder.ts
│   │   │       └── bin.ts            CLI entry point
│   │   └── tools/          @dev/tools — shared build utilities
│   └── host/
│       └── www/            Dev harness (plain HTML + UMD bundle)
│           └── index.html  Browser MCP provider + mock Babylon.js behaviors
└── package.json            Monorepo root (npm workspaces)
```

### Key concepts

| Term | Description |
|------|-------------|
| **Behavior** (`IMcpBehavior<T>`) | Capability template for a type of object (mesh, light, camera). Registered once per type. |
| **Instance** (`IMcpBehaviorInstance`) | Live wrapper around one specific object. Exposes it as a resource + tool executor. |
| **Namespace** | Short identifier (e.g. `"mesh"`) that groups tools and URI templates per behavior type. |
| **URI template** | RFC 6570 pattern (e.g. `mesh://scene/{meshName}`) advertised via `resources/templates/list`. |
| **`uri` argument** | Required tool argument that routes a call to the correct instance (fast path). |

---

## MCP transports supported

| Transport | Endpoint | Spec |
|-----------|----------|------|
| Streamable HTTP | `POST /mcp` | MCP 2025-03-26 |
| SSE stream | `GET /sse` | MCP 2024-11-05 |
| SSE messages | `POST /messages?sessionId=…` | MCP 2024-11-05 |
| Raw WebSocket | `ws://localhost:3000/` | Internal / testing |

---

## npm scripts reference

| Script | Description |
|--------|-------------|
| `npm run bundle` | Production webpack bundle |
| `npm run bundle:dev` | Development webpack bundle (readable) |
| `npm run bundle:watch` | Watch + auto-rebuild bundle |
| `npm run server:build` | Compile tunnel TypeScript |
| `npm run server:start` | Build + start the tunnel server |

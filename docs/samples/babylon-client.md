# babylon-client

**File:** `packages/host/www/samples/babylon-client.html`
**Engine:** Babylon.js
**Transport:** LoopbackTransport (in-process)

---

## Goal

Demonstrate the **McpClient** SDK by having rovers connect to each other
directly inside the browser — no network, no tunnel server. This validates the
full MCP request/response cycle (initialize, list resources, list tools, call
tool) end-to-end using `LoopbackTransport`.

It also introduces a reusable **tool panel** UI that dynamically discovers
resources and tools from any connected server and lets the user execute them
interactively.

---

## Scene layout

Same scene as [babylon-multiplex](babylon-multiplex.md): 4 color-tinted Mars
rovers on a 20x20 ground plane with a 2x2 viewport grid. Each rover has its
own `ArcRotateCamera`.

The key difference is the **transport**: no WebSocket tunnel is involved.

---

## Architecture

```
  rover_1 (client)                      rover_2 (server)
  ┌────────────────┐                    ┌────────────────┐
  │  McpClient     │◄── loopback ──►   │  McpServer     │
  │                │    transport       │  + Behavior    │
  │  ToolPanel UI  │                    │  + Adapter     │
  └────────────────┘                    └────────────────┘
```

When rover_1 connects to rover_2:

1. `LoopbackTransport.createPair()` produces two linked transport ends
2. A new `McpServer` is built on rover_2 with its camera behavior and the
   server-side transport
3. An `McpClient` is created on rover_1 with the client-side transport
4. Both `server.start()` and `client.connect()` are called
5. The client performs the MCP initialize handshake
6. A floating tool panel appears showing rover_2's resources and tools

---

## Connection UI

### 3D overlay icons

A link icon (`🔗`) floats above each rover, projected from 3D world space onto
screen coordinates using the per-camera view-projection matrix. Clicking the
icon opens a dropdown listing the other rovers. Selecting one triggers the
connection flow.

The icon turns green when the rover is connected as a client.

### Left panel cards

Each rover has a card in the left panel with:

- Color dot and name
- Connection status: "Ready" or "Connected to rover_X"
- Connect / Disconnect button

Both UIs (icon and card) trigger the same connect/disconnect logic.

---

## Tool panel

When a connection is established, a **floating resizable panel** appears
anchored near the source rover's icon. The panel title shows the ownership
relationship (e.g. `rover_1 → rover_2`).

The panel is built dynamically from the connected server's MCP schema:

### Resources section

Lists resources returned by `client.listResources()`. Each resource URI has a
**Read** button that calls `client.readResource(uri)` and displays the JSON
response.

Instance URIs are discovered by reading the root resource (e.g.
`babylon://camera`) and parsing the JSON array it returns, which contains
entries like `{ uri: "babylon://camera/rover_2_cam", name: "rover_2_cam" }`.

### Tools section

Lists tools returned by `client.listTools()`. Clicking a tool name expands a
**parameter form** generated from the tool's `inputSchema`:

| JSON Schema type | Form control |
|------------------|--------------|
| `string` | text input |
| `number` | number input |
| `boolean` | checkbox |
| `string` (enum) | dropdown select |
| `object` / other | textarea (JSON) |

Required fields are marked with `*`. An **Execute** button calls
`client.callTool(name, args)` and displays the result in a `<pre>` block.

### Panel features

- **Draggable** via the header bar
- **Resizable** via the browser's native resize handle (`resize: both`)
- **Close button** triggers disconnect

---

## What you can try

1. Click the connection icon on rover_1 and select rover_2
2. The tool panel appears with rover_2's camera resources and tools
3. Read `babylon://camera/rover_2_cam` to see the camera state
4. Call `camera_set_target` with a new position — rover_2's camera moves in the
   right viewport
5. Disconnect and try the reverse direction (rover_2 → rover_1)

---

## Key takeaway

`LoopbackTransport` enables **zero-network MCP communication** between objects
in the same page. Combined with `McpClient`, it turns any MCP-enabled object
into both a server (exposing its capabilities) and a client (consuming others').
This is the foundation for **digital-twin-to-digital-twin** interaction where
scene objects autonomously query and control each other.

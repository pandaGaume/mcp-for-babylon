# babylon-multiplex

**File:** `packages/host/www/samples/babylon-multiplex.html`
**Engine:** Babylon.js
**Transport:** WebSocket (Multiplex)

---

## Goal

Scale to **multiple independent MCP servers** sharing a single WebSocket
connection. Four Mars rovers each expose their own camera behavior through a
`MultiplexTransport`, demonstrating the envelope protocol that routes messages
to the correct provider.

---

## Scene layout

- **Ground:** 20x20 dark plane with 5 decorative obstacles
- **4 rovers:** GLB models (`mars_rover_low_poly.glb`) loaded and color-tinted
  - `robot_1` (red) at (-4, 0, -4)
  - `robot_2` (blue) at (4, 0, -4)
  - `robot_3` (green) at (-4, 0, 4)
  - `robot_4` (yellow) at (4, 0, 4)
- **4 viewports:** 2x2 grid, each rover has its own `ArcRotateCamera` and
  viewport quarter

Pointer input is **viewport-aware**: mouse events route to the camera whose
viewport contains the cursor.

---

## MCP wiring

```
                    ┌──── MultiplexTransport("robot_1", baseUrl) ──┐
                    │                                              │
robot_1 ─ Adapter ─ Behavior ─ McpServerBuilder ──┐               │
robot_2 ─ Adapter ─ Behavior ─ McpServerBuilder ──┤  One shared   │
robot_3 ─ Adapter ─ Behavior ─ McpServerBuilder ──┤  WebSocket    │
robot_4 ─ Adapter ─ Behavior ─ McpServerBuilder ──┘  connection   │
                                                       │          │
                    Tunnel server endpoint:             │          │
                    ws://host/providers  ◄──────────────┘          │
                    (multiplex path)                               │
                                                                   │
External MCP client connects to:                                   │
  ws://host/providers   { provider: "robot_1", payload: ... } ─────┘
```

Each rover gets its own `McpServerBuilder` and its own `MultiplexTransport`
instance. All transports share the same underlying WebSocket to
`/providers`. The tunnel server demultiplexes incoming messages by the
`provider` field in the envelope.

---

## What you can try

Connect an MCP client to `ws://host/providers` and send enveloped messages
targeting a specific rover:

```json
{ "provider": "robot_2", "payload": { "jsonrpc": "2.0", "method": "..." } }
```

Each rover exposes the full camera tool-set. The `instructions` string
clarifies which rover the server controls, so the AI client can address them
individually.

The left panel shows the endpoint URL and provider name for each rover with
copy-to-clipboard buttons.

---

## GLB model loading

The `buildRobot()` function handles the 3D model pipeline:

1. Load `mars_rover_low_poly.glb` via `SceneLoader.ImportMeshAsync`
2. Re-parent all loaded meshes under a single root `TransformNode`
3. Auto-scale the model to fit within ~2 units
4. Tint materials via `Color3.Lerp(original, tintColor, 0.4)`
5. Position at the designated grid slot

---

## Key takeaway

`MultiplexTransport` lets you run **N independent MCP servers** over a single
WebSocket, avoiding the overhead of N connections. Each server is fully
isolated — it has its own behavior, adapter, and provider name. The tunnel
server routes messages transparently using the envelope protocol.

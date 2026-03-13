# babylon-camera

**File:** `packages/host/www/samples/babylon-camera.html`
**Engine:** Babylon.js
**Transport:** WebSocket (Direct)

---

## Goal

Demonstrate full camera control through MCP. A single `McpCameraBehavior`
exposes every camera tool (position, target, projection, animation, scene
queries) and connects to an external MCP client via a WebSocket tunnel.

This is the simplest sample and the recommended starting point.

---

## Scene layout

A 3D scene with 12 color-coded spheres arranged in a **clock face** on a dark
ground plane:

- **Radius:** 5 units from the center
- **12 o'clock (noon):** sphere at (0, 1, -5) — the -Z direction
- **Colors:** each sphere has a distinct hue (red, orange, yellow, ...)
- **Ground:** 20x20 dark plane at y = 0
- **Camera:** `ArcRotateCamera` initially looking at the noon sphere

Coordinate system: **right-handed, Y-up**.

---

## MCP wiring

```
Scene
  └─ ArcRotateCamera
        │
        ▼
  McpCameraAdapter(scene, camera)
        │
        ▼
  McpCameraBehavior
        │
        ▼
  McpServerBuilder
    .withName("babylon-camera")
    .withWsUrl(ws://host/provider/babylon-camera)
    .register(cameraBehavior)
    .build()  →  WebSocket connection
```

| Component | Role |
|-----------|------|
| `McpCameraAdapter` | Bridges Babylon.js camera API to the generic adapter interface |
| `McpCameraBehavior` | Declares MCP resources and tools (see [camera behavior](../behaviors/camera.md)) |
| `McpServerBuilder` | Creates the JSON-RPC server and connects via WebSocket |

---

## What you can try

Once connected to an MCP client (e.g. Claude Desktop), you can:

- **Read resources** -- `babylon://camera` lists cameras,
  `babylon://camera/{id}` returns full camera state
- **Position tools** -- `camera_set_position`, `camera_set_target`,
  `camera_look_at`
- **Navigation tools** -- `camera_orbit`, `camera_dolly`, `camera_pan`,
  `camera_zoom`
- **Projection tools** -- `camera_set_fov`, `camera_set_projection`
  (perspective / ortho)
- **Animation tools** -- `camera_animate_to`, `camera_animate_orbit`,
  `camera_follow_path`, `camera_shake`, `camera_stop_animation`
- **Control tools** -- `camera_lock`, `camera_unlock`, `camera_snapshot`
- **Scene query tools** -- `scene_visible_objects`, `scene_pick_from_center`

The instructions string sent during the MCP handshake describes the clock
layout so the AI client understands the scene geometry.

---

## Key takeaway

One adapter + one behavior + the server builder is all you need to expose a
Babylon.js camera to any MCP client. The same behavior works identically with
the Cesium adapter (see [cesium-camera](cesium-camera.md)).

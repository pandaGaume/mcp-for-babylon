# cesium-camera

**File:** `packages/host/www/samples/cesium-camera.html`
**Engine:** CesiumJS
**Transport:** WebSocket (Direct)

---

## Goal

Prove that the **adapter abstraction** works across engines. This sample uses
the exact same `McpCameraBehavior` as [babylon-camera](babylon-camera.md) but
swaps in a `McpCameraAdapter` backed by CesiumJS. The MCP tools are identical —
only the coordinate system changes (local Cartesian → ECEF).

---

## Scene layout

12 color-coded boxes arranged in a **clock face** around the Champs de Mars in
Paris, overlaid on Google Photorealistic 3D Tiles:

- **Center:** 48.856 N, 2.298 E (near the Eiffel Tower)
- **Clock radius:** 200 m
- **Box size:** 20x20x20 m
- **Coordinates:** geographic (lat/lon) converted to ECEF via
  `Cesium.Cartesian3.fromDegrees()`
- **Initial camera:** northwest of the clock face at ~800 m altitude, 45 pitch,
  looking southeast

### Cesium Ion token

The sample requires a **Cesium Ion access token** for the 3D Tiles tileset.
A dialog prompts for the token on first load; the token is stored in
`localStorage` for subsequent visits.

---

## MCP wiring

```
Cesium Viewer
  └─ Camera (Cesium.Camera)
        │
        ▼
  McpCameraAdapter(viewer)       ← Cesium-specific adapter
        │
        ▼
  McpCameraBehavior              ← same behavior as Babylon sample
        │
        ▼
  McpServerBuilder  →  WebSocket
```

| Component | Role |
|-----------|------|
| `McpCameraAdapter` (`@dev/cesium`) | Bridges CesiumJS camera API; works in ECEF coordinates |
| `McpCameraBehavior` (`@dev/behaviors`) | Unchanged — same tools, same schema |

---

## Coordinate differences

Unlike the Babylon samples where positions are in local Cartesian `{x, y, z}`,
all coordinates here are in **ECEF** (Earth-Centered, Earth-Fixed):

```json
{
    "position": { "x": 4201234.5, "y": 171456.7, "z": 4779876.3 },
    "target":   { "x": 4201100.0, "y": 171500.0, "z": 4779800.0 }
}
```

The MCP client must pass ECEF coordinates to position/target tools. The
`instructions` string sent during the handshake explains this and provides the
ECEF positions of the 12 clock spheres.

---

## What you can try

Same camera tools as the Babylon sample, but with ECEF values:

- `camera_set_position` / `camera_set_target` with ECEF `{x, y, z}`
- `camera_animate_to` for smooth fly-to animations
- `camera_orbit`, `camera_dolly`, `camera_pan`
- `scene_visible_objects`, `scene_pick_from_center`

---

## Key takeaway

The **behavior layer is engine-agnostic**. `McpCameraBehavior` defines the MCP
schema (resources, tools, input schemas) once. The adapter translates those
generic operations into engine-specific API calls. Swapping from Babylon.js to
CesiumJS requires only a different adapter — the MCP client sees the same
interface.

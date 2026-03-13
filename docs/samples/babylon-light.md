# babylon-light

**File:** `packages/host/www/samples/babylon-light.html`
**Engine:** Babylon.js
**Transport:** WebSocket (Direct)

---

## Goal

Demonstrate lighting management through MCP. An MCP client can query, create,
modify, and remove lights in a Babylon.js scene while respecting the concept of
**protected lights** that cannot be deleted.

---

## Scene layout

- **Ground:** 22x22 dark plane
- **Central obelisk:** tall box (1x6x1) at center, y = 3
- **6 colored spheres:** arranged in a hexagon at radius 5, y = 1
  (red, orange, yellow, green, cyan, blue)
- **3 platforms:** flat cylinders at various positions for placing lights

All materials use high specular values so lighting changes are clearly visible.

### Pre-existing lights

| Name | Type | Protected |
|------|------|-----------|
| `sky` | HemisphericLight | Yes |
| `sun` | DirectionalLight | Yes |

Protected lights can be read and modified but **not removed** via MCP.

Coordinate system: **right-handed, Y-up**.

---

## MCP wiring

```
Scene
  └─ Lights (sky, sun, user-created)
        │
        ▼
  McpLightAdapter(scene)
        │
        ▼
  McpLightBehavior
        │
        ▼
  McpServerBuilder  →  WebSocket
```

| Component | Role |
|-----------|------|
| `McpLightAdapter` | Indexes scene lights, executes create/remove/update operations |
| `McpLightBehavior` | Declares light resources and tools (see [light behavior](../behaviors/light.md)) |

---

## What you can try

- **Read resources** -- `babylon://light` lists all lights,
  `babylon://light/{name}` returns state (type, color, intensity, position,
  direction)
- **Create lights** -- `light_create` with type (point, directional, spot,
  hemisphere), position, color
- **Remove lights** -- `light_remove` (user-created only; protected lights
  refuse removal)
- **Property tools** -- `light_set_color`, `light_set_intensity`,
  `light_set_property`, `light_update`
- **Type-specific tools** -- `light_set_direction` (directional),
  `light_set_target` / `light_set_range` / `light_set_angle` (spot),
  `light_set_ground` / `light_set_diffuse` / `light_set_specular` (hemisphere)
- **Ambient tools** -- `scene_get_ambient`, `scene_set_ambient_color`,
  `scene_set_ambient_enabled`

---

## Key takeaway

The light sample introduces the **protected resource** pattern: some scene
objects are visible and modifiable through MCP but cannot be deleted. This is
useful for preserving baseline lights that the scene depends on while still
allowing an AI client to add and experiment with additional lighting.

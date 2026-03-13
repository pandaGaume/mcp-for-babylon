# babylon-mesh

**File:** `packages/host/www/samples/babylon-mesh.html`
**Engine:** Babylon.js
**Transport:** WebSocket (Direct)

---

## Goal

Demonstrate mesh manipulation and **scene understanding** through MCP. This
sample registers **two behaviors** (mesh + camera) on a single server, showing
how an AI client can both understand and act on a complex scene.

The scenario is a top-down tactical battlefield where an AI can query unit
positions, move pieces, and reason about the game state.

---

## Scene layout

A 24x24 dark ground plane with the following objects:

| Category | Objects | Tags |
|----------|---------|------|
| **Player** | 1 blue box at (0, 0.5, 7) | `player unit` |
| **Enemies** | 4 red spheres at z = -4 | `enemy unit` |
| **Allies** | 3 green spheres at z = +4 | `ally unit` |
| **Landmarks** | Castle wall, 2 watchtowers | `static landmark` |
| **Cover** | Crates, barrels | `static cover` |

Coordinate system: **right-handed, Y-up**. North = -Z, South = +Z.

---

## MCP wiring

```
Scene
  ├─ Meshes (player, enemies, allies, props)
  │     │
  │     ▼
  │  McpMeshAdapter(scene)  →  McpMeshBehavior
  │
  └─ ArcRotateCamera (overhead view)
        │
        ▼
     McpCameraAdapter(scene, camera)  →  McpCameraBehavior

Both behaviors registered on ONE McpServerBuilder  →  WebSocket
```

This is the first sample that combines **multiple behaviors** on a single
server. The AI client sees mesh tools **and** camera tools in one connection.

---

## What you can try

### Mesh tools
- **Transform** -- `mesh_set_position`, `mesh_set_rotation`,
  `mesh_set_scaling`, `mesh_animate_to`
- **Visibility** -- `mesh_set_enabled`, `mesh_set_visible`,
  `mesh_set_visibility` (alpha)
- **Material** -- `mesh_set_color`, `mesh_set_material_alpha`
- **Tags** -- `mesh_tag_add`, `mesh_tag_remove`, `mesh_tag_set`

### Tag queries
- **`mesh_find_by_tag`** -- boolean expressions:
  - `"enemy"` -- find all enemies
  - `"enemy && !disabled"` -- active enemies only
  - `"static && cover"` -- cover objects

### Scene understanding (camera behavior)
- **`scene_visible_objects`** -- lists what the camera can see, sorted by
  screen coverage, distance, or name
- **`scene_pick_from_center`** -- ray-cast from camera center

### Suggested workflows
1. **Reconnaissance** -- read camera resource, call `scene_visible_objects`
2. **Unit query** -- `mesh_find_by_tag("ally unit")` to locate friendlies
3. **Tactical maneuver** -- `mesh_set_position` to move the player
4. **Status change** -- `mesh_tag_add(enemy, "disabled")` to mark a downed unit
5. **Reinforce** -- `mesh_set_visible` to reveal hidden reserves

---

## Key takeaway

Registering **multiple behaviors** on one server lets an AI client correlate
scene understanding (camera) with scene manipulation (mesh). The **tag system**
gives the client a high-level vocabulary for querying objects without needing to
enumerate every mesh by name.

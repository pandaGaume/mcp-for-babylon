# RetinexSnapshotFilter

Single-Scale Retinex (SSR) filter that enhances local contrast and recovers
detail in shadows and highlights.

**Package:** `@dev/filters`
**Class:** `RetinexSnapshotFilter`
**Worker-compatible:** Yes

---

## What It Does

Retinex models human vision by separating an image into **reflectance**
(intrinsic surface detail) and **illumination** (lighting). The filter:

1. Estimates the illumination by applying a **Gaussian blur** to each RGB
   channel independently.
2. Subtracts the log-illumination from the log-original:
   `R(x,y) = log(I(x,y) + 1) - log(L(x,y) + 1)`
3. Normalises the result back to `[0, 255]`.

The effect: shadows are lifted, highlights are tamed, and fine texture detail
becomes visible — useful for inspecting 3D scenes with uneven lighting.

---

## Usage

```typescript
import { RetinexSnapshotFilter } from "@dev/filters";

// Default sigma (80) — preserves more global contrast
adapter.imageFiltering.registerFilter(new RetinexSnapshotFilter());

// Smaller sigma (20) — emphasises fine local detail
adapter.imageFiltering.registerFilter(new RetinexSnapshotFilter(20));
```

Then call the `camera_snapshot` tool with `filters: ["retinex"]`.

---

## Parameters

| Parameter | Type     | Default | Description |
| --------- | -------- | ------- | ----------- |
| `sigma`   | `number` | `80`    | Standard deviation of the Gaussian kernel. Larger values preserve global contrast; smaller values bring out fine detail. |

The Gaussian kernel is truncated at **3&sigma;** and edges are mirror-clamped.

---

## Implementation Details

### Gaussian Blur

A separable two-pass blur (horizontal then vertical) using a 1-D kernel of
size `2 * ceil(3&sigma;) + 1`. Each pass iterates over every pixel, making the
total complexity **O(W &times; H &times; 6&sigma;)** per channel.

For the default sigma of 80, the kernel spans 481 taps — this is why the
filter benefits from running in a Web Worker.

### Normalisation

After the log-domain subtraction, values span an arbitrary range. The filter
maps the global `[min, max]` linearly to `[0, 255]`. This per-channel stretch
can shift colour balance slightly — a known characteristic of single-scale
Retinex.

---

## Performance

| Image size | Sigma | Main thread | Web Worker |
| ---------- | ----- | ----------- | ---------- |
| 1920 &times; 1080 | 80 | ~3 s | ~3 s (non-blocking) |
| 1920 &times; 1080 | 20 | ~1 s | ~1 s (non-blocking) |

Total computation time is similar, but the Worker keeps the UI responsive
(spinner animates, user can interact with the scene).

---

## Worker Function

The `workerFn` string inlines the entire algorithm: channel separation,
kernel construction, separable Gaussian blur, and per-channel retinex with
normalisation. It uses `var` and `function` declarations to stay compatible
with the `new Function()` compilation inside the Worker.

The only parameter forwarded via `workerParams` is `{ sigma }`.

# GrayscaleSnapshotFilter

Converts an image to grayscale using the ITU-R BT.601 luminance formula.

**Package:** `@dev/filters`
**Class:** `GrayscaleSnapshotFilter`
**Worker-compatible:** Yes

---

## What It Does

Replaces each pixel's RGB channels with a single luminance value computed as:

```
gray = 0.299 * R + 0.587 * G + 0.114 * B
```

This is the ITU-R BT.601 standard, which weights green most heavily to match
human brightness perception. The alpha channel is preserved unchanged.

---

## Usage

```typescript
import { GrayscaleSnapshotFilter } from "@dev/filters";

adapter.imageFiltering.registerFilter(new GrayscaleSnapshotFilter());
```

Then call the `camera_snapshot` tool with `filters: ["grayscale"]`.

---

## Parameters

None. The filter has no configurable options.

---

## Combining with Other Filters

Grayscale can be chained after other filters. Registration order determines
execution order:

```typescript
adapter.imageFiltering.registerFilter(new RetinexSnapshotFilter(20));
adapter.imageFiltering.registerFilter(new GrayscaleSnapshotFilter());

// filters: ["retinex", "grayscale"] → contrast-enhanced grayscale
```

Both filters implement `IWorkerSnapshotFilter`, so the pipeline batches them
into a single Worker round-trip.

---

## Implementation Details

The filter iterates over every pixel (stride of 4 bytes for RGBA) and sets
R, G, and B to the weighted sum. The loop runs in **O(W &times; H)** and is
nearly instantaneous for typical snapshot sizes.

### Worker Function

```javascript
for (var i = 0; i < data.length; i += 4) {
    var gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = gray;
}
return data;
```

No parameters are forwarded (`workerParams = {}`).

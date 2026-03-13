import { ISnapshotFilter } from "./snapshot.interfaces";

/**
 * Marker interface for filters whose {@link ISnapshotFilter.apply} logic is
 * pure CPU math and can be serialized into a Web Worker.
 *
 * Implementors provide:
 * - {@link workerFn}: a self-contained function body (no closures, no imports)
 *   that receives `data` (`Uint8ClampedArray`), `width`, `height`, and
 *   `params` (`Record<string, unknown>`) and returns a `Uint8ClampedArray`
 *   (may be the same reference).
 * - {@link workerParams}: serializable constructor parameters forwarded to
 *   the function body at runtime.
 *
 * The existing {@link ISnapshotFilter.apply} method is retained as a
 * **main-thread fallback** (used when Workers are unavailable or blocked by
 * CSP).
 *
 * @example
 * ```typescript
 * export class InvertFilter implements IWorkerSnapshotFilter {
 *     readonly name = "invert";
 *     readonly workerParams = {};
 *     readonly workerFn = `
 *         for (let i = 0; i < data.length; i += 4) {
 *             data[i]     = 255 - data[i];
 *             data[i + 1] = 255 - data[i + 1];
 *             data[i + 2] = 255 - data[i + 2];
 *         }
 *         return data;
 *     `;
 *     apply(imageData: ImageData): ImageData {
 *         const d = imageData.data;
 *         for (let i = 0; i < d.length; i += 4) {
 *             d[i] = 255 - d[i]; d[i+1] = 255 - d[i+1]; d[i+2] = 255 - d[i+2];
 *         }
 *         return imageData;
 *     }
 * }
 * ```
 */
export interface IWorkerSnapshotFilter extends ISnapshotFilter {
    /**
     * Self-contained function body as a string.  No closures, no imports.
     *
     * Available variables inside the body:
     * - `data`   — `Uint8ClampedArray` (RGBA pixels, length = width × height × 4)
     * - `width`  — image width in pixels
     * - `height` — image height in pixels
     * - `params` — the object returned by {@link workerParams}
     *
     * Must return a `Uint8ClampedArray` (can be the same `data` reference).
     */
    readonly workerFn: string;

    /** Serializable constructor parameters passed to the Worker function. */
    readonly workerParams: Record<string, unknown>;
}

/** Type guard for {@link IWorkerSnapshotFilter}. */
export function isWorkerSnapshotFilter(filter: ISnapshotFilter): filter is IWorkerSnapshotFilter {
    return typeof (filter as IWorkerSnapshotFilter).workerFn === "string" && typeof (filter as IWorkerSnapshotFilter).workerParams === "object";
}

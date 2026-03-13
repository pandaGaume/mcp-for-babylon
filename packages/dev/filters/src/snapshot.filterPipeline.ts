import { ISnapshotFilter } from "./interfaces";

/**
 * Chains one or more {@link ISnapshotFilter} instances into a single named
 * composite filter.  The output of each filter feeds into the next, in the
 * order they were supplied to the constructor.
 *
 * A pipeline with a single filter behaves identically to registering that
 * filter directly.
 *
 * ```ts
 * const enhance = new SnapshotFilterPipeline("enhance",
 *     new ContrastFilter(),
 *     new SharpenFilter(),
 * );
 * adapter.imageFiltering.registerFilter(enhance);
 * ```
 */
export class SnapshotFilterPipeline implements ISnapshotFilter {
    public readonly name: string;
    private readonly _filters: ISnapshotFilter[];

    constructor(name: string, ...filters: ISnapshotFilter[]) {
        if (filters.length === 0) {
            throw new Error("SnapshotFilterPipeline requires at least one filter.");
        }
        this.name = name;
        this._filters = filters;
    }

    public async apply(imageData: ImageData, context?: Record<string, unknown>): Promise<ImageData> {
        let result = imageData;
        for (const filter of this._filters) {
            result = await filter.apply(result, context);
        }
        return result;
    }
}

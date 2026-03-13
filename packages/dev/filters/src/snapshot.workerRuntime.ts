/**
 * Returns the inline Web Worker script as a string.
 *
 * The Worker accepts messages with one or more filter function bodies,
 * executes them sequentially on the transferred pixel buffer, and posts
 * the result back — all in a single round-trip.
 *
 * @see {@link SnapshotFilterWorkerPool} for the main-thread counterpart.
 */
export function getWorkerScript(): string {
    return `
"use strict";
self.onmessage = function (e) {
    var msg = e.data;
    var id = msg.id;
    try {
        var data = new Uint8ClampedArray(msg.data);
        var width = msg.width;
        var height = msg.height;
        var filters = msg.filters;
        for (var i = 0; i < filters.length; i++) {
            var fn = new Function("data", "width", "height", "params", filters[i].fnBody);
            data = fn(data, width, height, filters[i].params);
        }
        self.postMessage({ id: id, data: data, width: width, height: height }, [data.buffer]);
    } catch (err) {
        self.postMessage({ id: id, error: String(err) });
    }
};
`;
}

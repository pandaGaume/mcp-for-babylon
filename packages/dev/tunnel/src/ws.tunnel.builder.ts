import { WsTunnel, type WsTunnelOptions, type StaticMount } from "./ws.tunnel.js";

/**
 * Fluent builder that constructs a configured {@link WsTunnel}.
 *
 * @example
 * ```typescript
 * const tunnel = new WsTunnelBuilder()
 *     .withPort(3000)
 *     .withHost("localhost")
 *     .withStaticMount("/",       "/abs/path/to/www")
 *     .withStaticMount("/bundle", "/abs/path/to/bundle")
 *     .build();
 *
 * await tunnel.start();
 * console.log("Tunnel listening on ws://localhost:3000");
 * console.log("  Provider connects to: ws://localhost:3000/provider");
 * console.log("  Clients  connect to:  ws://localhost:3000/");
 * console.log("  Static files at:      http://localhost:3000/");
 * ```
 */
export class WsTunnelBuilder {

    private _port = 3000;
    private _host: string | undefined;
    private _providerPath = "/provider";
    private _clientPath = "/";
    private _ssePath = "/sse";
    private _messagesPath = "/messages";
    private _mcpPath = "/mcp";
    private _samplesIndexPath = "/__samples_index__";
    private _staticMounts: StaticMount[] = [];

    /** Sets the TCP port the tunnel listens on. */
    withPort(port: number): this {
        this._port = port;
        return this;
    }

    /**
     * Sets the host/interface to bind to.
     * @default "0.0.0.0" (all interfaces)
     */
    withHost(host: string): this {
        this._host = host;
        return this;
    }

    /**
     * Sets the URL path the Babylon.js `McpServer` (provider) connects to.
     * @default "/provider"
     */
    withProviderPath(path: string): this {
        this._providerPath = path;
        return this;
    }

    /**
     * Sets the URL path MCP clients connect to.
     * @default "/"
     */
    withClientPath(path: string): this {
        this._clientPath = path;
        return this;
    }

    /**
     * Sets the URL path for the SSE stream (Claude connects here via GET).
     * @default "/sse"
     */
    withSsePath(path: string): this {
        this._ssePath = path;
        return this;
    }

    /**
     * Sets the URL path for JSON-RPC POST requests from Claude.
     * @default "/messages"
     */
    withMessagesPath(path: string): this {
        this._messagesPath = path;
        return this;
    }

    /**
     * Sets the URL path for the Streamable HTTP transport (MCP 2025-03-26).
     * MCP Inspector and other 2025+ clients POST JSON-RPC here.
     * @default "/mcp"
     */
    withMcpPath(path: string): this {
        this._mcpPath = path;
        return this;
    }

    /**
     * Sets the URL path that returns a `{ files: string[] }` listing of the
     * `samples/` subdirectory under the root static mount.
     * Used by `index.html` to populate the samples gallery.
     * @default "/__samples_index__"
     */
    withSamplesIndexPath(path: string): this {
        this._samplesIndexPath = path;
        return this;
    }

    /**
     * Adds a static-file mount served over plain HTTP.
     * Can be called multiple times; longest-prefix match wins at runtime.
     *
     * @param urlPrefix  URL prefix that triggers this mount (e.g. `"/"` or `"/bundle"`).
     * @param dir        Absolute path to the directory to serve.
     */
    withStaticMount(urlPrefix: string, dir: string): this {
        this._staticMounts.push({ urlPrefix, dir });
        return this;
    }

    /** Constructs and returns a configured {@link WsTunnel}. */
    build(): WsTunnel {
        const options: WsTunnelOptions = {
            port: this._port,
            host: this._host,
            providerPath: this._providerPath,
            clientPath: this._clientPath,
            ssePath: this._ssePath,
            messagesPath: this._messagesPath,
            mcpPath: this._mcpPath,
            samplesIndexPath: this._samplesIndexPath,
            staticMounts: this._staticMounts.length > 0 ? [...this._staticMounts] : undefined,
        };
        return new WsTunnel(options);
    }
}

import { createEventEmitter, IEventEmitter, IEventSource, IMcpBehaviorAdapter, McpResourceContent, McpToolResult, ToolSupport } from "./interfaces";

export abstract class McpAdapterBase implements IMcpBehaviorAdapter {
    private _domain: string;
    private _onResourceContentChanged?: IEventEmitter<string>;
    private _onResourcesChanged?: IEventEmitter<void>;

    constructor(domain: string) {
        this._domain = domain;
    }

    public get domain(): string {
        return this._domain;
    }

    public get onResourceContentChanged(): IEventSource<string> {
        if (!this._onResourceContentChanged) {
            this._onResourceContentChanged = createEventEmitter<string>();
        }
        return this._onResourceContentChanged;
    }

    public get onResourcesChanged(): IEventSource<void> {
        if (!this._onResourcesChanged) {
            this._onResourcesChanged = createEventEmitter<void>();
        }
        return this._onResourcesChanged;
    }

    public dispose(): void {
        this._onResourceContentChanged?.clear();
        this._onResourceContentChanged = undefined;
        this._onResourcesChanged?.clear();
        this._onResourcesChanged = undefined;
    }

    protected _forwardResourceChanged() {
        this._onResourcesChanged?.emit();
    }

    protected _forwardResourceContentChanged(uri: string) {
        this._onResourceContentChanged?.emit(uri);
    }

    /**
     * Returns the support level for a tool, optionally scoped to a resource type.
     *
     * Override in subclasses to declare per-tool or per-resource-type support.
     * The default implementation returns `undefined` for every tool, which the
     * behavior interprets as {@link ToolSupport.Full} (all tools assumed fully supported).
     */
    public getToolSupport(_toolName: string, _resourceType?: string): ToolSupport | undefined {
        return undefined;
    }

    /**
     * Returns an adapter-specific description for a tool.
     *
     * Override in subclasses to inject engine-specific language into
     * tool-level descriptions. The default returns `undefined` for every
     * tool, which the behavior interprets as "use the default description".
     */
    getToolDescription?(_toolName: string, _resourceType?: string): string | undefined {
        return undefined;
    }

    /**
     * Returns an adapter-specific description for a tool property.
     *
     * Override in subclasses to inject engine-specific coordinate grammar
     * into individual tool property descriptions. The default returns
     * `undefined` for every property, which the behavior interprets as
     * "use the default description".
     */
    getToolPropertyDescription?(_toolName: string, _propertyName: string, _resourceType?: string): string | undefined {
        return undefined;
    }

    public abstract readResourceAsync(uri: string): Promise<McpResourceContent | undefined>;
    public abstract executeToolAsync(uri: string, toolName: string, args: Record<string, unknown>): Promise<McpToolResult>;
}

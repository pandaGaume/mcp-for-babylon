import { McpAdapterBase, McpResourceContent, McpToolResult, McpToolResults } from "@dev/core";
import { McpCesiumDomain } from "../mcp.commons";

/**
 * MCP adapter for Cesium cameras.
 *
 * TODO: Implement Cesium-specific camera management.
 */
export class McpCameraAdapter extends McpAdapterBase {
    public constructor() {
        super(McpCesiumDomain);
    }

    public async readResourceAsync(_uri: string): Promise<McpResourceContent | undefined> {
        // TODO: implement Cesium camera resource reading
        return undefined;
    }

    public async executeToolAsync(_uri: string, toolName: string, _args: Record<string, unknown>): Promise<McpToolResult> {
        // TODO: implement Cesium camera tool execution
        return McpToolResults.error(`Tool "${toolName}" is not yet implemented for Cesium.`);
    }
}

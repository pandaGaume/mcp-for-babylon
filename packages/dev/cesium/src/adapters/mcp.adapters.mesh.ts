import { McpAdapterBase, McpResourceContent, McpToolResult, McpToolResults } from "@dev/core";
import { McpCesiumDomain } from "../mcp.commons";

/**
 * MCP adapter for Cesium meshes / 3D Tiles.
 *
 * TODO: Implement Cesium-specific mesh / tileset management.
 */
export class McpMeshAdapter extends McpAdapterBase {
    public constructor() {
        super(McpCesiumDomain);
    }

    public async readResourceAsync(_uri: string): Promise<McpResourceContent | undefined> {
        // TODO: implement Cesium mesh resource reading
        return undefined;
    }

    public async executeToolAsync(_uri: string, toolName: string, _args: Record<string, unknown>): Promise<McpToolResult> {
        // TODO: implement Cesium mesh tool execution
        return McpToolResults.error(`Tool "${toolName}" is not yet implemented for Cesium.`);
    }
}

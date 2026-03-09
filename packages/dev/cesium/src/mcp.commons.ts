import { McpCameraNamespace, McpLightNamespace, McpMeshNamespace } from "@dev/behaviors";

export const McpCesiumDomain: string = "cesium";
export const McpCameraResourceUriPrefix: string = `${McpCesiumDomain}://${McpCameraNamespace}`;
export const McpLightResourceUriPrefix: string = `${McpCesiumDomain}://${McpLightNamespace}`;
export const McpMeshResourceUriPrefix: string = `${McpCesiumDomain}://${McpMeshNamespace}`;

// Re-export namespace constants for convenience
export { McpCameraNamespace, McpLightNamespace, McpMeshNamespace };

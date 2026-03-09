import { McpCameraNamespace, McpLightNamespace, McpMeshNamespace } from "@dev/behaviors";

export const McpBabylonDomain: string = "babylon";
export const McpCameraResourceUriPrefix: string = `${McpBabylonDomain}://${McpCameraNamespace}`;
export const McpLightResourceUriPrefix: string = `${McpBabylonDomain}://${McpLightNamespace}`;
export const McpMeshResourceUriPrefix: string = `${McpBabylonDomain}://${McpMeshNamespace}`;

// Re-export namespace constants for convenience
export { McpCameraNamespace, McpLightNamespace, McpMeshNamespace };

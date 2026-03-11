import { IMcpBehaviorAdapter, JsonRpcMimeType, McpBehavior, McpBehaviorOptions, McpResource, McpResourceTemplate, McpTool } from "@dev/core";
import { McpMeshNamespace } from "../mcp.commons";

export class McpMeshBehavior extends McpBehavior {
    // -------------------------------------------------------------------------
    // Tool name constants — visibility
    // -------------------------------------------------------------------------

    /** Enables or disables a mesh (affects rendering, picking and children). */
    public static readonly MeshSetEnabledFn = "mesh_set_enabled";

    /** Sets the isVisible flag on a mesh (fast show/hide without disabling children). */
    public static readonly MeshSetVisibleFn = "mesh_set_visible";

    /** Sets the per-mesh alpha (0 = fully transparent, 1 = fully opaque). */
    public static readonly MeshSetVisibilityFn = "mesh_set_visibility";

    // -------------------------------------------------------------------------
    // Tool name constants — transform
    // -------------------------------------------------------------------------

    /** Teleports the mesh to a world-space position. */
    public static readonly MeshSetPositionFn = "mesh_set_position";

    /** Sets the local Euler rotation of a mesh in degrees (x = pitch, y = yaw, z = roll). */
    public static readonly MeshSetRotationFn = "mesh_set_rotation";

    /** Sets the local scale of a mesh. */
    public static readonly MeshSetScalingFn = "mesh_set_scaling";

    /** Smoothly animates position, rotation and/or scaling to target values over a duration. */
    public static readonly MeshAnimateToFn = "mesh_animate_to";

    // -------------------------------------------------------------------------
    // Tool name constants — material
    // -------------------------------------------------------------------------

    /** Sets the base color (diffuse for Standard, albedo for PBR) of a mesh's material.
     *  Creates a StandardMaterial if the mesh has none. */
    public static readonly MeshSetColorFn = "mesh_set_color";

    /** Sets the alpha of the mesh's material (0 = fully transparent, 1 = fully opaque). */
    public static readonly MeshSetMaterialAlphaFn = "mesh_set_material_alpha";

    // -------------------------------------------------------------------------
    // Tool name constants — tags
    // -------------------------------------------------------------------------

    /** Adds one or more space-separated tags to a mesh. */
    public static readonly MeshTagAddFn = "mesh_tag_add";

    /** Removes one or more space-separated tags from a mesh. */
    public static readonly MeshTagRemoveFn = "mesh_tag_remove";

    /** Replaces all existing tags on a mesh with a new set. */
    public static readonly MeshTagSetFn = "mesh_tag_set";

    // -------------------------------------------------------------------------
    // Tool name constants — namespace-level queries (uri = babylon://mesh)
    // -------------------------------------------------------------------------

    /** Finds all meshes matching a Babylon.js tag query expression and returns their ids, names and tags. */
    public static readonly MeshFindByTagFn = "mesh_find_by_tag";

    // -------------------------------------------------------------------------

    public constructor(adapter: IMcpBehaviorAdapter, options: McpBehaviorOptions = {}) {
        super(adapter, {
            ...options,
            domain: options.domain ?? adapter.domain,
            namespace: options.namespace ?? McpMeshNamespace,
        });
    }

    protected override _buildTools(): McpTool[] {
        const vec3 = {
            type: "object",
            properties: {
                x: { type: "number" },
                y: { type: "number" },
                z: { type: "number" },
            },
            required: ["x", "y", "z"],
            additionalProperties: false,
        };

        const color3 = {
            type: "object",
            properties: {
                r: { type: "number", description: "Red channel (0..1)." },
                g: { type: "number", description: "Green channel (0..1)." },
                b: { type: "number", description: "Blue channel (0..1)." },
            },
            required: ["r", "g", "b"],
            additionalProperties: false,
        };

        const easingParam = {
            type: "string",
            description:
                "Easing curve. Format '<type>' or '<type>.<mode>'. " +
                "Types: linear | sine | quad | cubic | circle | expo | back | bounce | elastic. " +
                "Modes: in | out | inout (default). Example: 'sine.inout'.",
        };

        return [
            // -----------------------------------------------------------------
            // mesh.setEnabled
            // -----------------------------------------------------------------
            {
                name: McpMeshBehavior.MeshSetEnabledFn,
                description: this._buildToolDescription(
                    McpMeshBehavior.MeshSetEnabledFn,
                    undefined,
                    "Enables or disables a mesh. A disabled mesh is not rendered, not pickable and " +
                        "propagates the disabled state to its children."
                ),
                inputSchema: {
                    type: "object",
                    properties: {
                        uri: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetEnabledFn, "uri", undefined, "Mesh URI, e.g. babylon://mesh/meshId") },
                        enabled: { type: "boolean", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetEnabledFn, "enabled", undefined, "True to enable, false to disable.") },
                    },
                    required: ["uri", "enabled"],
                    additionalProperties: false,
                },
            },

            // -----------------------------------------------------------------
            // mesh.setVisible
            // -----------------------------------------------------------------
            {
                name: McpMeshBehavior.MeshSetVisibleFn,
                description: this._buildToolDescription(
                    McpMeshBehavior.MeshSetVisibleFn,
                    undefined,
                    "Shows or hides a mesh without affecting its children or pickability. " +
                        "Prefer this over mesh_set_enabled for simple show/hide operations."
                ),
                inputSchema: {
                    type: "object",
                    properties: {
                        uri: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetVisibleFn, "uri", undefined, "Mesh URI") },
                        visible: { type: "boolean", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetVisibleFn, "visible", undefined, "True to show, false to hide.") },
                    },
                    required: ["uri", "visible"],
                    additionalProperties: false,
                },
            },

            // -----------------------------------------------------------------
            // mesh.setVisibility
            // -----------------------------------------------------------------
            {
                name: McpMeshBehavior.MeshSetVisibilityFn,
                description: this._buildToolDescription(
                    McpMeshBehavior.MeshSetVisibilityFn,
                    undefined,
                    "Sets the per-mesh alpha. 0 = fully transparent, 1 = fully opaque. " + "Independent of the material alpha."
                ),
                inputSchema: {
                    type: "object",
                    properties: {
                        uri: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetVisibilityFn, "uri", undefined, "Mesh URI") },
                        visibility: { type: "number", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetVisibilityFn, "visibility", undefined, "Alpha value in [0..1].") },
                    },
                    required: ["uri", "visibility"],
                    additionalProperties: false,
                },
            },

            // -----------------------------------------------------------------
            // mesh.setPosition
            // -----------------------------------------------------------------
            {
                name: McpMeshBehavior.MeshSetPositionFn,
                description: this._buildToolDescription(McpMeshBehavior.MeshSetPositionFn, undefined, "Teleports the mesh to an absolute world-space position (right-handed y-up)."),
                inputSchema: {
                    type: "object",
                    properties: {
                        uri: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetPositionFn, "uri", undefined, "Mesh URI") },
                        position: { ...vec3, description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetPositionFn, "position", undefined, "Target world-space position (right-handed y-up).") },
                    },
                    required: ["uri", "position"],
                    additionalProperties: false,
                },
            },

            // -----------------------------------------------------------------
            // mesh.setRotation
            // -----------------------------------------------------------------
            {
                name: McpMeshBehavior.MeshSetRotationFn,
                description: this._buildToolDescription(
                    McpMeshBehavior.MeshSetRotationFn,
                    undefined,
                    "Sets the local Euler rotation of a mesh in degrees (right-handed y-up). " +
                        "x = pitch (tilt forward/back), y = yaw (turn left/right), z = roll (lean sideways). " +
                        "Clears any existing rotationQuaternion."
                ),
                inputSchema: {
                    type: "object",
                    properties: {
                        uri: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetRotationFn, "uri", undefined, "Mesh URI") },
                        rotation: {
                            ...vec3,
                            description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetRotationFn, "rotation", undefined, "Euler angles in degrees (right-handed y-up). x=pitch, y=yaw, z=roll."),
                        },
                    },
                    required: ["uri", "rotation"],
                    additionalProperties: false,
                },
            },

            // -----------------------------------------------------------------
            // mesh.setScaling
            // -----------------------------------------------------------------
            {
                name: McpMeshBehavior.MeshSetScalingFn,
                description: this._buildToolDescription(
                    McpMeshBehavior.MeshSetScalingFn,
                    undefined,
                    "Sets the local scale of a mesh. Use (1,1,1) to reset to original size. " +
                        "Negative values mirror the mesh along that axis."
                ),
                inputSchema: {
                    type: "object",
                    properties: {
                        uri: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetScalingFn, "uri", undefined, "Mesh URI") },
                        scaling: { ...vec3, description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetScalingFn, "scaling", undefined, "Scale factors along each local axis.") },
                    },
                    required: ["uri", "scaling"],
                    additionalProperties: false,
                },
            },

            // -----------------------------------------------------------------
            // mesh.animateTo
            // -----------------------------------------------------------------
            {
                name: McpMeshBehavior.MeshAnimateToFn,
                description: this._buildToolDescription(
                    McpMeshBehavior.MeshAnimateToFn,
                    undefined,
                    "Smoothly animates a mesh toward target position, rotation and/or scaling values. " +
                        "Only the provided fields are animated; omitted fields remain unchanged. " +
                        "Rotation is specified in degrees (Euler, right-handed y-up)."
                ),
                inputSchema: {
                    type: "object",
                    properties: {
                        uri: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshAnimateToFn, "uri", undefined, "Mesh URI") },
                        position: { ...vec3, description: this._buildToolPropertyDescription(McpMeshBehavior.MeshAnimateToFn, "position", undefined, "Target world-space position (right-handed y-up).") },
                        rotation: { ...vec3, description: this._buildToolPropertyDescription(McpMeshBehavior.MeshAnimateToFn, "rotation", undefined, "Target Euler rotation in degrees (right-handed y-up).") },
                        scaling: { ...vec3, description: this._buildToolPropertyDescription(McpMeshBehavior.MeshAnimateToFn, "scaling", undefined, "Target local scale factors.") },
                        duration: { type: "number", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshAnimateToFn, "duration", undefined, "Animation duration in seconds. Defaults to 1.") },
                        easing: { ...easingParam, description: this._buildToolPropertyDescription(McpMeshBehavior.MeshAnimateToFn, "easing", undefined, easingParam.description as string) },
                    },
                    required: ["uri"],
                    additionalProperties: false,
                },
            },

            // -----------------------------------------------------------------
            // mesh.setColor
            // -----------------------------------------------------------------
            {
                name: McpMeshBehavior.MeshSetColorFn,
                description: this._buildToolDescription(
                    McpMeshBehavior.MeshSetColorFn,
                    undefined,
                    "Sets the base color of the mesh's material (diffuse for StandardMaterial, albedo for PBRMaterial). " +
                        "If the mesh has no material a new StandardMaterial is created. " +
                        "Color channels are in [0..1]."
                ),
                inputSchema: {
                    type: "object",
                    properties: {
                        uri: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetColorFn, "uri", undefined, "Mesh URI") },
                        color: { ...color3, description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetColorFn, "color", undefined, "Target base color (r, g, b in 0..1).") },
                    },
                    required: ["uri", "color"],
                    additionalProperties: false,
                },
            },

            // -----------------------------------------------------------------
            // mesh.setMaterialAlpha
            // -----------------------------------------------------------------
            {
                name: McpMeshBehavior.MeshSetMaterialAlphaFn,
                description: this._buildToolDescription(
                    McpMeshBehavior.MeshSetMaterialAlphaFn,
                    undefined,
                    "Sets the alpha of the mesh's material (0 = fully transparent, 1 = fully opaque). " +
                        "This is distinct from the per-mesh visibility alpha. " +
                        "If the mesh has no material a new StandardMaterial is created."
                ),
                inputSchema: {
                    type: "object",
                    properties: {
                        uri: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetMaterialAlphaFn, "uri", undefined, "Mesh URI") },
                        alpha: { type: "number", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshSetMaterialAlphaFn, "alpha", undefined, "Alpha value in [0..1].") },
                    },
                    required: ["uri", "alpha"],
                    additionalProperties: false,
                },
            },

            // -----------------------------------------------------------------
            // mesh.tagAdd
            // -----------------------------------------------------------------
            {
                name: McpMeshBehavior.MeshTagAddFn,
                description: this._buildToolDescription(
                    McpMeshBehavior.MeshTagAddFn,
                    undefined,
                    "Adds one or more Babylon.js tags to a mesh. Tags are space-separated identifiers " +
                        "that can later be queried with mesh_find_by_tag using boolean expressions (&&, ||, !)."
                ),
                inputSchema: {
                    type: "object",
                    properties: {
                        uri: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshTagAddFn, "uri", undefined, "Mesh URI") },
                        tags: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshTagAddFn, "tags", undefined, "Space-separated list of tags to add, e.g. 'enemy destructible'.") },
                    },
                    required: ["uri", "tags"],
                    additionalProperties: false,
                },
            },

            // -----------------------------------------------------------------
            // mesh.tagRemove
            // -----------------------------------------------------------------
            {
                name: McpMeshBehavior.MeshTagRemoveFn,
                description: this._buildToolDescription(McpMeshBehavior.MeshTagRemoveFn, undefined, "Removes one or more Babylon.js tags from a mesh."),
                inputSchema: {
                    type: "object",
                    properties: {
                        uri: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshTagRemoveFn, "uri", undefined, "Mesh URI") },
                        tags: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshTagRemoveFn, "tags", undefined, "Space-separated list of tags to remove.") },
                    },
                    required: ["uri", "tags"],
                    additionalProperties: false,
                },
            },

            // -----------------------------------------------------------------
            // mesh.tagSet
            // -----------------------------------------------------------------
            {
                name: McpMeshBehavior.MeshTagSetFn,
                description: this._buildToolDescription(McpMeshBehavior.MeshTagSetFn, undefined, "Replaces ALL existing tags on a mesh with the provided set. Pass an empty string to clear all tags."),
                inputSchema: {
                    type: "object",
                    properties: {
                        uri: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshTagSetFn, "uri", undefined, "Mesh URI") },
                        tags: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshTagSetFn, "tags", undefined, "Space-separated list of new tags (replaces existing). Empty string clears all.") },
                    },
                    required: ["uri", "tags"],
                    additionalProperties: false,
                },
            },

            // -----------------------------------------------------------------
            // mesh.findByTag  — namespace-level (uri = babylon://mesh)
            // -----------------------------------------------------------------
            {
                name: McpMeshBehavior.MeshFindByTagFn,
                description: this._buildToolDescription(
                    McpMeshBehavior.MeshFindByTagFn,
                    undefined,
                    "Finds all meshes in the scene matching a Babylon.js tag query expression. " +
                        "Supports boolean operators: '&&' (AND), '||' (OR), '!' (NOT). " +
                        "Examples: 'enemy', 'enemy && destructible', 'enemy || ally', '!static'. " +
                        "Pass uri as 'babylon://mesh' (the mesh list resource)."
                ),
                inputSchema: {
                    type: "object",
                    properties: {
                        uri: { type: "string", description: this._buildToolPropertyDescription(McpMeshBehavior.MeshFindByTagFn, "uri", undefined, "Must be 'babylon://mesh' (namespace-level tool).") },
                        query: {
                            type: "string",
                            description: this._buildToolPropertyDescription(McpMeshBehavior.MeshFindByTagFn, "query", undefined, "Babylon.js tag query expression, e.g. 'enemy && destructible'."),
                        },
                    },
                    required: ["uri", "query"],
                    additionalProperties: false,
                },
            },
        ];
    }

    protected override _buildResources(): McpResource[] {
        return [
            {
                uri: `${this.baseUri}`,
                name: "Mesh list",
                description: "All meshes currently present in the scene.",
                mimeType: JsonRpcMimeType,
            },
        ];
    }

    protected override _buildTemplate(): McpResourceTemplate[] {
        return [
            {
                uriTemplate: `${this.baseUri}/{meshId}`,
                name: "Scene mesh",
                description: "A single mesh in the scene, identified by its Babylon.js id.",
                mimeType: JsonRpcMimeType,
            },
        ];
    }
}

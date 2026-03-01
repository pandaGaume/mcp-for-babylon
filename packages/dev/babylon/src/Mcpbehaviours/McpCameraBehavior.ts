import { TargetCamera, Vector3 } from "@babylonjs/core";

import { CachedMcpBehaviorInstanceBase, McpResource, McpResourceContent, McpToolMethod } from "@dev/core";

export class McpCameraBehaviorInstance extends CachedMcpBehaviorInstanceBase<TargetCamera> {
    public constructor(target: TargetCamera, uri: string) {
        super(target, uri);
    }

    // Local API (typed, convenient for in-app calls)
    public lookAt(target: Vector3): void {
        this.target.setTarget(target);
    }

    @McpToolMethod({
        name: "setTarget",
        description: "Sets the camera look-at point (world space) by calling TargetCamera.setTarget(Vector3).",
        inputSchema: {
            type: "object",
            properties: {
                uri: { type: "string", description: "camera URI, e.g. camera://scene/MyCamera" },
                target: {
                    type: "object",
                    description:
                        "The world-space point to look at. Cartesian coordinates interpreted as Babylon.js Vector3. Left-handed system, with the y-axis that points upwards",
                    properties: {
                        x: { type: "number" },
                        y: { type: "number" },
                        z: { type: "number" },
                    },
                    required: ["x", "y", "z"],
                    additionalProperties: false,
                },
            },
            required: ["uri", "target"],
            additionalProperties: false,
        },
    })
    public setTarget(args: unknown): void {
        const a = args as { target?: { x?: unknown; y?: unknown; z?: unknown } };
        const t = a?.target;
        if (!t || typeof t.x !== "number" || typeof t.y !== "number" || typeof t.z !== "number") {
            throw new Error("Invalid args for camera.setTarget: expected { target: { x:number, y:number, z:number } }");
        }

        this.lookAt(new Vector3(t.x, t.y, t.z));
    }

    protected override _buildResource(): McpResource | undefined {
        // Keep it stable and instance-independent if you want class-level caching.
        return {
            uri: this.uri,
            name: "Babylon TargetCamera",
            description: "Camera behavior exposing tools to control a Babylon.js TargetCamera.",
            mimeType: "application/json",
        } as unknown as McpResource;
    }

    protected override async _buildResourceContentAsync(): Promise<McpResourceContent | undefined> {
        // Also keep it stable and instance-independent for class-level caching.
        // Provide a self-describing payload that clients/LLMs can display.
        return {
            uri: this.uri,
            mimeType: "application/json",
            text: JSON.stringify(
                {
                    kind: "babylon.targetCamera",
                    tools: this.getTools().map((t) => t.name),
                    notes: {
                        worldSpace: true,
                        method: "TargetCamera.setTarget(Vector3)",
                    },
                },
                null,
                2
            ),
        } as unknown as McpResourceContent;
    }
}

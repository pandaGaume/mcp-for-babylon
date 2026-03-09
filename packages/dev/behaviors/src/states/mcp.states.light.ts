import { ICartesian3 } from "./mcp.states.math";

export type LightType = "point" | "directional" | "spot" | "hemispheric";

export interface IColor3 {
    r: number;
    g: number;
    b: number;
}

export interface ILightStateBase {
    id: string;
    name: string;
    type: LightType;
    enabled: boolean;
    intensity: number;
    diffuseColor: IColor3;
    specularColor: IColor3;
}

export interface IPointLightState extends ILightStateBase {
    type: "point";
    position: ICartesian3;
    range?: number;
}

export interface IDirectionalLightState extends ILightStateBase {
    type: "directional";
    direction: ICartesian3;
    /** World-space position used for shadow frustum placement (does not affect light direction). */
    position?: ICartesian3;
}

export interface ISpotLightState extends ILightStateBase {
    type: "spot";
    position: ICartesian3;
    direction: ICartesian3;
    /** Cone half-angle in degrees. */
    angle: number;
    exponent?: number;
    range?: number;
}

export interface IHemisphericLightState extends ILightStateBase {
    type: "hemispheric";
    /** Points toward the sky (bright hemisphere). */
    direction: ICartesian3;
    groundColor?: IColor3;
}

export type ILightState = IPointLightState | IDirectionalLightState | ISpotLightState | IHemisphericLightState;

export interface ISceneAmbientState {
    enabled: boolean;
    color: IColor3;
}

/** Partial patch for light_update. All fields are optional; inapplicable fields are silently ignored. */
export interface ILightPatch {
    enabled?: boolean;
    intensity?: number;
    diffuseColor?: IColor3;
    specularColor?: IColor3;
    /** point, spot, directional (shadow frustum) */
    position?: ICartesian3;
    /** directional, spot, hemispheric */
    direction?: ICartesian3;
    /** point, spot */
    range?: number;
    /** spot only — cone half-angle in degrees */
    angle?: number;
    /** spot only */
    exponent?: number;
    /** hemispheric only */
    groundColor?: IColor3;
}

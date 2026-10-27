export type Side = "top" | "bottom";
export type Align = "start" | "center" | "end";
export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
    r: number;
}
export interface Geo {
    layerW: number;
    layerH: number;
    left: number;
    top: number;
    trigger: Rect;
    panel: Rect;
}
export declare function buildGeo(tW: number, tH: number, cW: number, cH: number, side: Side, align: Align, gap: number, panelRadius: number): Geo;
export declare function rectAtProgress(geo: Geo, progress: number): Rect;
export declare function insetFor(rect: Rect, layerW: number, layerH: number): string;
export declare function roundedRectShape(rect: Rect): string;
export declare function clipForProgress(geo: Geo, progress: number, supportsShape: boolean): string;
export declare function roundedRectPath(rect: Rect): string;
export declare function triggerCutout(geo: Geo): string;

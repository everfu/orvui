type Point = {
    x: number;
    y: number;
};
type Box = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};
export declare function graceArea(exit: Point, target: Box): Point[];
export declare function inBox(point: Point, box: Box): boolean;
export declare function inPolygon(point: Point, polygon: Point[]): boolean;
export {};

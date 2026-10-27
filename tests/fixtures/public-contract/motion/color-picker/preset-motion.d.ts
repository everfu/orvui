type Point = {
    x: number;
    y: number;
};
export declare function createPresetArc(): (from: Point, to: Point) => (progress: number) => Point;
export {};

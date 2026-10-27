export interface DonutSegment {
    id: string;
    name: string;
    color: string;
    value: number;
}
export type PlacedSegment = DonutSegment & {
    share: number;
    path: string;
};
export declare const DONUT_SIZE = 200;
type RingOptions = {
    radius: number;
    thickness: number;
    gap: number;
};
export declare function buildDonut(segments: readonly DonutSegment[], options: RingOptions): {
    placed: PlacedSegment[];
    total: number;
};
export {};

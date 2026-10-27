export interface FunnelStage {
    id: string;
    label: string;
    value: number;
    color?: string;
}
export declare function buildFunnel(stages: readonly FunnelStage[]): {
    rows: {
        proportion: number;
        conversion: number | null;
        stepConversion: number | null;
        change: number | null;
        id: string;
        label: string;
        value: number;
        color?: string;
    }[];
    first: number;
    last: number;
    conversion: number | null;
};
export declare function funnelPath(proportions: readonly number[], index: number, direction: "vertical" | "horizontal"): string;

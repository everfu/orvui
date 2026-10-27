import { type FunnelStage } from "./model";
export interface FunnelChartProps {
    stages: readonly FunnelStage[];
    direction?: "vertical" | "horizontal";
    unit?: string;
    label?: string;
    formatValue?: (v: number) => string;
    className?: string;
}
export declare function createFunnelModel(p: FunnelChartProps): {
    model: {
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
    direction: "horizontal" | "vertical";
    unit: string;
    label: string;
    formatValue: (value: number) => string;
    reduce: boolean;
};
export declare const funnelContext: {
    key: import("vue").InjectionKey<{
        model: {
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
        direction: "horizontal" | "vertical";
        unit: string;
        label: string;
        formatValue: (value: number) => string;
        reduce: boolean;
    }>;
    use: () => {
        model: {
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
        direction: "horizontal" | "vertical";
        unit: string;
        label: string;
        formatValue: (value: number) => string;
        reduce: boolean;
    };
};
export declare const useFunnelChart: () => {
    model: {
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
    direction: "horizontal" | "vertical";
    unit: string;
    label: string;
    formatValue: (value: number) => string;
    reduce: boolean;
};
export declare const percentage: (v: number | null) => string;

import { type DonutSegment } from "./model";
export interface DonutChartProps {
    segments: readonly DonutSegment[];
    thickness?: number;
    gap?: number;
    activeId?: string | null;
    defaultActiveId?: string | null;
    selectedId?: string | null;
    formatValue?: (value: number) => string;
    label?: string;
    className?: string;
}
export declare function createDonutModel(props: DonutChartProps, emit: (event: any, ...args: any[]) => void): {
    placed: import("./model").PlacedSegment[];
    total: number;
    radius: number;
    thickness: number;
    active: string | null;
    setActive: (id: string | null) => void;
    select: (id: string) => void;
    selectedId: string | null;
    formatValue: (value: number) => string;
    label: string;
    reduce: boolean;
    canHover: boolean;
};
export declare const donutContext: {
    key: import("vue").InjectionKey<{
        placed: import("./model").PlacedSegment[];
        total: number;
        radius: number;
        thickness: number;
        active: string | null;
        setActive: (id: string | null) => void;
        select: (id: string) => void;
        selectedId: string | null;
        formatValue: (value: number) => string;
        label: string;
        reduce: boolean;
        canHover: boolean;
    }>;
    use: () => {
        placed: import("./model").PlacedSegment[];
        total: number;
        radius: number;
        thickness: number;
        active: string | null;
        setActive: (id: string | null) => void;
        select: (id: string) => void;
        selectedId: string | null;
        formatValue: (value: number) => string;
        label: string;
        reduce: boolean;
        canHover: boolean;
    };
};
export declare const useDonutChart: () => {
    placed: import("./model").PlacedSegment[];
    total: number;
    radius: number;
    thickness: number;
    active: string | null;
    setActive: (id: string | null) => void;
    select: (id: string) => void;
    selectedId: string | null;
    formatValue: (value: number) => string;
    label: string;
    reduce: boolean;
    canHover: boolean;
};

import { type TreemapNode } from "./model";
export interface TreemapProps {
    data: readonly TreemapNode[];
    label?: string;
    formatValue?: (value: number) => string;
    colors?: readonly string[];
    textColor?: string;
    activeId?: string | null;
    defaultActiveId?: string | null;
    className?: string;
}
export declare function createTreemapModel(p: TreemapProps, emit: (event: any, ...args: any[]) => void): {
    nodes: import("./model").ResolvedNode[];
    items: import("./model").TreemapItem[];
    total: number;
    tiles: import("./model").TreemapTile[];
    size: {
        width: number;
        height: number;
    };
    plotRef: HTMLElement | null;
    activeId: string | null;
    active: import("./model").TreemapTile | null;
    setActive: (id: string | null) => void;
    tooltipOpen: boolean;
    tooltipId: string;
    formatValue: (value: number) => string;
    label: string;
    reduce: boolean;
    canHover: boolean;
};
export declare const treemapContext: {
    key: import("vue").InjectionKey<{
        nodes: import("./model").ResolvedNode[];
        items: import("./model").TreemapItem[];
        total: number;
        tiles: import("./model").TreemapTile[];
        size: {
            width: number;
            height: number;
        };
        plotRef: HTMLElement | null;
        activeId: string | null;
        active: import("./model").TreemapTile | null;
        setActive: (id: string | null) => void;
        tooltipOpen: boolean;
        tooltipId: string;
        formatValue: (value: number) => string;
        label: string;
        reduce: boolean;
        canHover: boolean;
    }>;
    use: () => {
        nodes: import("./model").ResolvedNode[];
        items: import("./model").TreemapItem[];
        total: number;
        tiles: import("./model").TreemapTile[];
        size: {
            width: number;
            height: number;
        };
        plotRef: HTMLElement | null;
        activeId: string | null;
        active: import("./model").TreemapTile | null;
        setActive: (id: string | null) => void;
        tooltipOpen: boolean;
        tooltipId: string;
        formatValue: (value: number) => string;
        label: string;
        reduce: boolean;
        canHover: boolean;
    };
};
export declare const useTreemap: () => {
    nodes: import("./model").ResolvedNode[];
    items: import("./model").TreemapItem[];
    total: number;
    tiles: import("./model").TreemapTile[];
    size: {
        width: number;
        height: number;
    };
    plotRef: HTMLElement | null;
    activeId: string | null;
    active: import("./model").TreemapTile | null;
    setActive: (id: string | null) => void;
    tooltipOpen: boolean;
    tooltipId: string;
    formatValue: (value: number) => string;
    label: string;
    reduce: boolean;
    canHover: boolean;
};

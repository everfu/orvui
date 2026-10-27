import { type SankeyNode, type SankeyLink, type PlacedNode, type PlacedLink } from "./model";
export interface SankeyChartProps {
    nodes: readonly SankeyNode[];
    links: readonly SankeyLink[];
    label?: string;
    formatValue?: (v: number) => string;
    colors?: readonly string[];
    nodeWidth?: number;
    nodePadding?: number;
    activeId?: string | null;
    defaultActiveId?: string | null;
    className?: string;
}
export type SankeyActive = {
    type: "node";
    node: PlacedNode;
} | {
    type: "link";
    link: PlacedLink;
};
export declare function createSankeyModel(p: SankeyChartProps, emit: (event: any, ...args: any[]) => void): {
    nodes: PlacedNode[];
    links: PlacedLink[];
    columns: number;
    step: number;
    size: {
        width: number;
        height: number;
    };
    plotRef: HTMLElement | null;
    activeId: string | null;
    active: SankeyActive | null;
    setActive: (id: string | null) => void;
    tooltipOpen: boolean;
    tooltipId: string;
    gradientId: string;
    label: string;
    formatValue: (value: number) => string;
    empty: "No flows to show" | "No sankey data" | null;
    reduce: boolean;
    canHover: boolean;
};
export declare const sankeyContext: {
    key: import("vue").InjectionKey<{
        nodes: PlacedNode[];
        links: PlacedLink[];
        columns: number;
        step: number;
        size: {
            width: number;
            height: number;
        };
        plotRef: HTMLElement | null;
        activeId: string | null;
        active: SankeyActive | null;
        setActive: (id: string | null) => void;
        tooltipOpen: boolean;
        tooltipId: string;
        gradientId: string;
        label: string;
        formatValue: (value: number) => string;
        empty: "No flows to show" | "No sankey data" | null;
        reduce: boolean;
        canHover: boolean;
    }>;
    use: () => {
        nodes: PlacedNode[];
        links: PlacedLink[];
        columns: number;
        step: number;
        size: {
            width: number;
            height: number;
        };
        plotRef: HTMLElement | null;
        activeId: string | null;
        active: SankeyActive | null;
        setActive: (id: string | null) => void;
        tooltipOpen: boolean;
        tooltipId: string;
        gradientId: string;
        label: string;
        formatValue: (value: number) => string;
        empty: "No flows to show" | "No sankey data" | null;
        reduce: boolean;
        canHover: boolean;
    };
};
export declare const useSankeyChart: () => {
    nodes: PlacedNode[];
    links: PlacedLink[];
    columns: number;
    step: number;
    size: {
        width: number;
        height: number;
    };
    plotRef: HTMLElement | null;
    activeId: string | null;
    active: SankeyActive | null;
    setActive: (id: string | null) => void;
    tooltipOpen: boolean;
    tooltipId: string;
    gradientId: string;
    label: string;
    formatValue: (value: number) => string;
    empty: "No flows to show" | "No sankey data" | null;
    reduce: boolean;
    canHover: boolean;
};
export declare function emphasis(active: SankeyActive | null): {
    node: (n: PlacedNode) => boolean;
    link: (l: PlacedLink) => boolean;
};

export interface SankeyNode {
    id: string;
    label: string;
    color?: string;
    description?: string;
}
export interface SankeyLink {
    id?: string;
    source: string;
    target: string;
    value: number;
}
export type PlacedNode = Required<Pick<SankeyNode, "id" | "label" | "color">> & {
    description?: string;
    value: number;
    inValue: number;
    outValue: number;
    depth: number;
    x0: number;
    x1: number;
    y0: number;
    y1: number;
};
export type PlacedLink = {
    id: string;
    source: PlacedNode;
    target: PlacedNode;
    value: number;
    share: number;
    width: number;
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    path: string;
};
export type SankeyData = {
    nodes: SankeyNode[];
    links: SankeyLink[];
    dropped: {
        invalid: SankeyLink[];
        cycle: SankeyLink[];
    };
};
export declare const SANKEY_COLORS: readonly [
    "#1d4ed8",
    "#7c3aed",
    "#0f766e",
    "#b45309",
    "#be123c",
    "#475569"
];
export declare const linkId: (link: SankeyLink) => string;
export declare function cleanSankey(nodes: readonly SankeyNode[], links: readonly SankeyLink[]): SankeyData;
type LayoutOptions = {
    width: number;
    height: number;
    nodeWidth: number;
    nodePadding: number;
    colors: readonly string[];
};
export declare function layoutSankey(data: SankeyData, options: LayoutOptions): {
    nodes: PlacedNode[];
    links: PlacedLink[];
    columns: number;
    step: number;
};
export {};

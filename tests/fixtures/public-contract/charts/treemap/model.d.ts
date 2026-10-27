interface TreemapBase {
    id: string;
    label: string;
    color?: string;
    textColor?: string;
    description?: string;
}
export interface TreemapLeaf extends TreemapBase {
    value: number;
}
export interface TreemapGroup extends TreemapBase {
    children: readonly TreemapNode[];
}
export type TreemapNode = TreemapLeaf | TreemapGroup;
export interface TreemapItem extends TreemapLeaf {
    color: string;
    textColor: string;
    path: readonly string[];
    share: number;
}
export interface ResolvedNode {
    id: string;
    label: string;
    value: number;
    color: string;
    children: ResolvedNode[];
    item: TreemapItem | null;
}
export interface TreemapTile extends TreemapItem {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare const TREEMAP_COLORS: readonly [
    "#1d4ed8",
    "#7c3aed",
    "#0f766e",
    "#b45309",
    "#be123c",
    "#475569"
];
export declare function buildTreemap(data: readonly TreemapNode[], colors: readonly string[], textColor: string): {
    nodes: ResolvedNode[];
    items: TreemapItem[];
    total: number;
};
export declare function layoutTreemap(nodes: readonly ResolvedNode[], width: number, height: number): TreemapTile[];
export {};

export interface PriceTarget {
    key: string;
    price: number;
    analysts: number;
    color?: string;
}
export interface PriceHistoryPoint {
    date: string;
    price: number;
}
export type PriceTargetFanActive = {
    type: "history";
    date: string;
} | {
    type: "target";
    key: string;
};
export interface PriceTargetFanProps {
    label?: string;
    current: number;
    targets: [
        PriceTarget,
        PriceTarget,
        PriceTarget
    ];
    dates?: {
        start?: string;
        mid?: string;
        horizon?: string;
    };
    history?: PriceHistoryPoint[];
    active?: PriceTargetFanActive | null;
    defaultActive?: PriceTargetFanActive | null;
    onActiveChange?: (active: PriceTargetFanActive | null) => void;
    className?: string;
}

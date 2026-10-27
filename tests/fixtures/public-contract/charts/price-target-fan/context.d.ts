import type { PriceTargetFanProps, PriceTargetFanActive } from "./types";
export declare function createPriceTargetModel(p: PriceTargetFanProps, emit: (e: any, ...a: any[]) => void): {
    reduce: boolean;
    clipId: string;
    fadeId: string;
    svgRef: import("vue").Ref<SVGSVGElement | null, SVGSVGElement | null>;
    tooltipId: string;
    active: PriceTargetFanActive | null;
    setActive: (v: PriceTargetFanActive | null) => void;
    scrub: number | null;
    hotT: number | null;
    setHotT: (index: number | null) => void;
    setScrub: (index: number | null) => void;
    hist: number[];
    history: import("./types").PriceHistoryPoint[];
    current: number;
    targets: [
        import("./types").PriceTarget,
        import("./types").PriceTarget,
        import("./types").PriceTarget
    ];
    dates: {
        start?: string;
        mid?: string;
        horizon?: string;
    };
    label: string;
    y: (v: number) => number;
    pct: (price: number) => number;
    fmt: (price: number) => string;
    geo: {
        hx: (i: number) => number;
        nowX: number;
        nowY: number;
        endX: number;
        line: string;
        proj: {
            color: string;
            ty: number;
            d: string;
            cx: number;
            cy: number;
            key: string;
            price: number;
            analysts: number;
        }[];
    };
    overlay: {
        px: number;
        py: number;
        title: string;
        metrics: {
            label: string;
            value: string;
        }[];
        accent: {
            label: string;
            value: string;
            color: string;
        } | null;
    } | null;
    mean: import("./types").PriceTarget;
    head: {
        color: string;
        ty: number;
        d: string;
        cx: number;
        cy: number;
        key: string;
        price: number;
        analysts: number;
    } | {
        key: string;
        price: number;
        color: undefined;
    };
    headPct: number;
    gridVals: {
        step: number;
        out: number[];
    };
    onMove: (event: PointerEvent) => void;
};
export declare const priceTargetContext: {
    key: import("vue").InjectionKey<{
        reduce: boolean;
        clipId: string;
        fadeId: string;
        svgRef: import("vue").Ref<SVGSVGElement | null, SVGSVGElement | null>;
        tooltipId: string;
        active: PriceTargetFanActive | null;
        setActive: (v: PriceTargetFanActive | null) => void;
        scrub: number | null;
        hotT: number | null;
        setHotT: (index: number | null) => void;
        setScrub: (index: number | null) => void;
        hist: number[];
        history: import("./types").PriceHistoryPoint[];
        current: number;
        targets: [
            import("./types").PriceTarget,
            import("./types").PriceTarget,
            import("./types").PriceTarget
        ];
        dates: {
            start?: string;
            mid?: string;
            horizon?: string;
        };
        label: string;
        y: (v: number) => number;
        pct: (price: number) => number;
        fmt: (price: number) => string;
        geo: {
            hx: (i: number) => number;
            nowX: number;
            nowY: number;
            endX: number;
            line: string;
            proj: {
                color: string;
                ty: number;
                d: string;
                cx: number;
                cy: number;
                key: string;
                price: number;
                analysts: number;
            }[];
        };
        overlay: {
            px: number;
            py: number;
            title: string;
            metrics: {
                label: string;
                value: string;
            }[];
            accent: {
                label: string;
                value: string;
                color: string;
            } | null;
        } | null;
        mean: import("./types").PriceTarget;
        head: {
            color: string;
            ty: number;
            d: string;
            cx: number;
            cy: number;
            key: string;
            price: number;
            analysts: number;
        } | {
            key: string;
            price: number;
            color: undefined;
        };
        headPct: number;
        gridVals: {
            step: number;
            out: number[];
        };
        onMove: (event: PointerEvent) => void;
    }>;
    use: () => {
        reduce: boolean;
        clipId: string;
        fadeId: string;
        svgRef: import("vue").Ref<SVGSVGElement | null, SVGSVGElement | null>;
        tooltipId: string;
        active: PriceTargetFanActive | null;
        setActive: (v: PriceTargetFanActive | null) => void;
        scrub: number | null;
        hotT: number | null;
        setHotT: (index: number | null) => void;
        setScrub: (index: number | null) => void;
        hist: number[];
        history: import("./types").PriceHistoryPoint[];
        current: number;
        targets: [
            import("./types").PriceTarget,
            import("./types").PriceTarget,
            import("./types").PriceTarget
        ];
        dates: {
            start?: string;
            mid?: string;
            horizon?: string;
        };
        label: string;
        y: (v: number) => number;
        pct: (price: number) => number;
        fmt: (price: number) => string;
        geo: {
            hx: (i: number) => number;
            nowX: number;
            nowY: number;
            endX: number;
            line: string;
            proj: {
                color: string;
                ty: number;
                d: string;
                cx: number;
                cy: number;
                key: string;
                price: number;
                analysts: number;
            }[];
        };
        overlay: {
            px: number;
            py: number;
            title: string;
            metrics: {
                label: string;
                value: string;
            }[];
            accent: {
                label: string;
                value: string;
                color: string;
            } | null;
        } | null;
        mean: import("./types").PriceTarget;
        head: {
            color: string;
            ty: number;
            d: string;
            cx: number;
            cy: number;
            key: string;
            price: number;
            analysts: number;
        } | {
            key: string;
            price: number;
            color: undefined;
        };
        headPct: number;
        gridVals: {
            step: number;
            out: number[];
        };
        onMove: (event: PointerEvent) => void;
    };
};
export declare const usePriceTargetFan: () => {
    reduce: boolean;
    clipId: string;
    fadeId: string;
    svgRef: import("vue").Ref<SVGSVGElement | null, SVGSVGElement | null>;
    tooltipId: string;
    active: PriceTargetFanActive | null;
    setActive: (v: PriceTargetFanActive | null) => void;
    scrub: number | null;
    hotT: number | null;
    setHotT: (index: number | null) => void;
    setScrub: (index: number | null) => void;
    hist: number[];
    history: import("./types").PriceHistoryPoint[];
    current: number;
    targets: [
        import("./types").PriceTarget,
        import("./types").PriceTarget,
        import("./types").PriceTarget
    ];
    dates: {
        start?: string;
        mid?: string;
        horizon?: string;
    };
    label: string;
    y: (v: number) => number;
    pct: (price: number) => number;
    fmt: (price: number) => string;
    geo: {
        hx: (i: number) => number;
        nowX: number;
        nowY: number;
        endX: number;
        line: string;
        proj: {
            color: string;
            ty: number;
            d: string;
            cx: number;
            cy: number;
            key: string;
            price: number;
            analysts: number;
        }[];
    };
    overlay: {
        px: number;
        py: number;
        title: string;
        metrics: {
            label: string;
            value: string;
        }[];
        accent: {
            label: string;
            value: string;
            color: string;
        } | null;
    } | null;
    mean: import("./types").PriceTarget;
    head: {
        color: string;
        ty: number;
        d: string;
        cx: number;
        cy: number;
        key: string;
        price: number;
        analysts: number;
    } | {
        key: string;
        price: number;
        color: undefined;
    };
    headPct: number;
    gridVals: {
        step: number;
        out: number[];
    };
    onMove: (event: PointerEvent) => void;
};

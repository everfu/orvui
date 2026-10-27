import type { HeatCalendarProps, HeatCalendarCell, HeatCalendarSelection } from "./types";
export declare function createHeatModel(p: HeatCalendarProps, emit: (e: any, ...a: any[]) => void): {
    unit: string;
    weeks: number;
    reduce: boolean;
    canHover: boolean;
    hover: {
        w: number;
        d: number;
    } | null;
    pinned: HeatCalendarCell | null;
    spanEnd: HeatCalendarCell | null;
    step: number | null;
    setStep: (v: number | null) => void;
    start: Date | null;
    end: Date | null;
    level: (w: number, d: number) => number;
    bucket: (v: number) => number;
    fill: (b: number) => string;
    count: (v: number) => number;
    dateOf: (w: number, d: number) => Date | null;
    future: (w: number, d: number) => boolean;
    cols: {
        id: string;
        w: number;
        m: number;
        label: string | null;
    }[];
    clear: () => void;
    span: {
        lo: number;
        hi: number;
    } | null;
    spanTotal: number;
    select: (cell: HeatCalendarCell) => void;
    hot: HeatCalendarCell | null;
    tip: HeatCalendarCell | null;
    hotMonth: number | null;
    tipX: number;
    tipY: number;
    setHover: (v: HeatCalendarCell | null) => void;
    tooltipId: string;
    tooltip: {
        date: Date;
        count: number;
        total: number;
        startDate: Date;
        endDate: Date;
        days: number;
    } | null;
    selection: HeatCalendarSelection | null;
    setSelection: (v: HeatCalendarSelection | null) => void;
};
export declare const heatContext: {
    key: import("vue").InjectionKey<{
        unit: string;
        weeks: number;
        reduce: boolean;
        canHover: boolean;
        hover: {
            w: number;
            d: number;
        } | null;
        pinned: HeatCalendarCell | null;
        spanEnd: HeatCalendarCell | null;
        step: number | null;
        setStep: (v: number | null) => void;
        start: Date | null;
        end: Date | null;
        level: (w: number, d: number) => number;
        bucket: (v: number) => number;
        fill: (b: number) => string;
        count: (v: number) => number;
        dateOf: (w: number, d: number) => Date | null;
        future: (w: number, d: number) => boolean;
        cols: {
            id: string;
            w: number;
            m: number;
            label: string | null;
        }[];
        clear: () => void;
        span: {
            lo: number;
            hi: number;
        } | null;
        spanTotal: number;
        select: (cell: HeatCalendarCell) => void;
        hot: HeatCalendarCell | null;
        tip: HeatCalendarCell | null;
        hotMonth: number | null;
        tipX: number;
        tipY: number;
        setHover: (v: HeatCalendarCell | null) => void;
        tooltipId: string;
        tooltip: {
            date: Date;
            count: number;
            total: number;
            startDate: Date;
            endDate: Date;
            days: number;
        } | null;
        selection: HeatCalendarSelection | null;
        setSelection: (v: HeatCalendarSelection | null) => void;
    }>;
    use: () => {
        unit: string;
        weeks: number;
        reduce: boolean;
        canHover: boolean;
        hover: {
            w: number;
            d: number;
        } | null;
        pinned: HeatCalendarCell | null;
        spanEnd: HeatCalendarCell | null;
        step: number | null;
        setStep: (v: number | null) => void;
        start: Date | null;
        end: Date | null;
        level: (w: number, d: number) => number;
        bucket: (v: number) => number;
        fill: (b: number) => string;
        count: (v: number) => number;
        dateOf: (w: number, d: number) => Date | null;
        future: (w: number, d: number) => boolean;
        cols: {
            id: string;
            w: number;
            m: number;
            label: string | null;
        }[];
        clear: () => void;
        span: {
            lo: number;
            hi: number;
        } | null;
        spanTotal: number;
        select: (cell: HeatCalendarCell) => void;
        hot: HeatCalendarCell | null;
        tip: HeatCalendarCell | null;
        hotMonth: number | null;
        tipX: number;
        tipY: number;
        setHover: (v: HeatCalendarCell | null) => void;
        tooltipId: string;
        tooltip: {
            date: Date;
            count: number;
            total: number;
            startDate: Date;
            endDate: Date;
            days: number;
        } | null;
        selection: HeatCalendarSelection | null;
        setSelection: (v: HeatCalendarSelection | null) => void;
    };
};
export declare const useHeatCalendar: () => {
    unit: string;
    weeks: number;
    reduce: boolean;
    canHover: boolean;
    hover: {
        w: number;
        d: number;
    } | null;
    pinned: HeatCalendarCell | null;
    spanEnd: HeatCalendarCell | null;
    step: number | null;
    setStep: (v: number | null) => void;
    start: Date | null;
    end: Date | null;
    level: (w: number, d: number) => number;
    bucket: (v: number) => number;
    fill: (b: number) => string;
    count: (v: number) => number;
    dateOf: (w: number, d: number) => Date | null;
    future: (w: number, d: number) => boolean;
    cols: {
        id: string;
        w: number;
        m: number;
        label: string | null;
    }[];
    clear: () => void;
    span: {
        lo: number;
        hi: number;
    } | null;
    spanTotal: number;
    select: (cell: HeatCalendarCell) => void;
    hot: HeatCalendarCell | null;
    tip: HeatCalendarCell | null;
    hotMonth: number | null;
    tipX: number;
    tipY: number;
    setHover: (v: HeatCalendarCell | null) => void;
    tooltipId: string;
    tooltip: {
        date: Date;
        count: number;
        total: number;
        startDate: Date;
        endDate: Date;
        days: number;
    } | null;
    selection: HeatCalendarSelection | null;
    setSelection: (v: HeatCalendarSelection | null) => void;
};

import type { ReturnsCalendarProps, ReturnsCalendarCell, ReturnsCalendarSelection } from "./types";
export declare function createReturnsModel(p: ReturnsCalendarProps, emit: (e: any, ...a: any[]) => void): {
    years: number[];
    reduce: boolean;
    canHover: boolean;
    hover: {
        y: number;
        m: number;
    } | null;
    pinned: ReturnsCalendarCell | null;
    spanEnd: ReturnsCalendarCell | null;
    totals: number[];
    valueAt: (y: number, m: number) => number;
    range: number;
    clear: () => void;
    span: {
        lo: number;
        hi: number;
    } | null;
    yearSpan: {
        lo: number;
        hi: number;
    } | null;
    hot: ReturnsCalendarCell | null;
    tip: ReturnsCalendarCell | null;
    sweepRow: number | null;
    tipValue: number;
    tipLabel: string;
    tipNote: string | null;
    select: (cell: ReturnsCalendarCell) => void;
    setHover: (v: ReturnsCalendarCell | null) => void;
    tooltipId: string;
    selection: ReturnsCalendarSelection | null;
    setSelection: (v: ReturnsCalendarSelection | null) => void;
};
export declare const returnsContext: {
    key: import("vue").InjectionKey<{
        years: number[];
        reduce: boolean;
        canHover: boolean;
        hover: {
            y: number;
            m: number;
        } | null;
        pinned: ReturnsCalendarCell | null;
        spanEnd: ReturnsCalendarCell | null;
        totals: number[];
        valueAt: (y: number, m: number) => number;
        range: number;
        clear: () => void;
        span: {
            lo: number;
            hi: number;
        } | null;
        yearSpan: {
            lo: number;
            hi: number;
        } | null;
        hot: ReturnsCalendarCell | null;
        tip: ReturnsCalendarCell | null;
        sweepRow: number | null;
        tipValue: number;
        tipLabel: string;
        tipNote: string | null;
        select: (cell: ReturnsCalendarCell) => void;
        setHover: (v: ReturnsCalendarCell | null) => void;
        tooltipId: string;
        selection: ReturnsCalendarSelection | null;
        setSelection: (v: ReturnsCalendarSelection | null) => void;
    }>;
    use: () => {
        years: number[];
        reduce: boolean;
        canHover: boolean;
        hover: {
            y: number;
            m: number;
        } | null;
        pinned: ReturnsCalendarCell | null;
        spanEnd: ReturnsCalendarCell | null;
        totals: number[];
        valueAt: (y: number, m: number) => number;
        range: number;
        clear: () => void;
        span: {
            lo: number;
            hi: number;
        } | null;
        yearSpan: {
            lo: number;
            hi: number;
        } | null;
        hot: ReturnsCalendarCell | null;
        tip: ReturnsCalendarCell | null;
        sweepRow: number | null;
        tipValue: number;
        tipLabel: string;
        tipNote: string | null;
        select: (cell: ReturnsCalendarCell) => void;
        setHover: (v: ReturnsCalendarCell | null) => void;
        tooltipId: string;
        selection: ReturnsCalendarSelection | null;
        setSelection: (v: ReturnsCalendarSelection | null) => void;
    };
};
export declare const useReturnsCalendar: () => {
    years: number[];
    reduce: boolean;
    canHover: boolean;
    hover: {
        y: number;
        m: number;
    } | null;
    pinned: ReturnsCalendarCell | null;
    spanEnd: ReturnsCalendarCell | null;
    totals: number[];
    valueAt: (y: number, m: number) => number;
    range: number;
    clear: () => void;
    span: {
        lo: number;
        hi: number;
    } | null;
    yearSpan: {
        lo: number;
        hi: number;
    } | null;
    hot: ReturnsCalendarCell | null;
    tip: ReturnsCalendarCell | null;
    sweepRow: number | null;
    tipValue: number;
    tipLabel: string;
    tipNote: string | null;
    select: (cell: ReturnsCalendarCell) => void;
    setHover: (v: ReturnsCalendarCell | null) => void;
    tooltipId: string;
    selection: ReturnsCalendarSelection | null;
    setSelection: (v: ReturnsCalendarSelection | null) => void;
};

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type TimeRange = {
    id: string;
    start: string;
    end: string;
};
export type DayAvailability = {
    enabled: boolean;
    ranges: TimeRange[];
};
export type WeekAvailability = Record<DayKey, DayAvailability>;
export type TimeOption = {
    value: string;
    label: string;
};
export declare const WEEKDAYS: {
    key: DayKey;
    label: string;
}[];
export declare const panelKey: (day: DayKey, rangeId: string, edge: "start" | "end") => string;
export declare const toMinutes: (v: string) => number;
export declare const toValue: (mins: number) => string;
export declare const label12: (v: string) => string;
export declare function buildOptions(step: number): TimeOption[];
export declare function clampRange(start: string, end: string, options: TimeOption[], changed?: "start" | "end"): {
    start: string;
    end: string;
};
export declare function startOptions(options: TimeOption[], end: string, current?: string): TimeOption[];
export declare function endOptions(options: TimeOption[], start: string, current?: string): TimeOption[];
export declare function defaultWeek(): WeekAvailability;

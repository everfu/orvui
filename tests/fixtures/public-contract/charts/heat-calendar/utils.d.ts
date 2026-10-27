export declare const STEPS: readonly [
    0,
    24,
    46,
    70,
    94
];
export declare const EMPTY = "color-mix(in srgb, var(--foreground) 6%, transparent)";
export declare const CELL = 16;
export declare const GAP = 4;
export declare const PITCH: number;
export declare const MONTH_ROW = 12;
export declare const DAYS: {
    id: string;
    d: number;
}[];
export declare const LIFT: number[];
export declare const startOfDay: (d: Date) => Date;
export declare const addDays: (d: Date, n: number) => Date;
export declare const mondayOf: (d: Date) => Date;
export declare const fmtDay: Intl.DateTimeFormat;
export declare const fmtMonth: Intl.DateTimeFormat;
export declare const fmtRange: Intl.DateTimeFormat;

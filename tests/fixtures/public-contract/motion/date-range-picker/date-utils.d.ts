import type { DateRange } from "./types";
export declare const DAY = 86400000;
export declare function parse(date: string): number;
export declare function iso(time: number): string;
export declare function monthOf(date: string): string;
export declare function shiftMonth(date: string, offset: number): string;
export declare function ordered(a: string, b: string): Required<DateRange>;

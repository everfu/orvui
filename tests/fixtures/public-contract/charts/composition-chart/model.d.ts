export interface CompositionSeries {
    id: string;
    name: string;
    color: string;
    values: readonly (number | null)[];
}
export declare function buildComposition(series: readonly CompositionSeries[], periods: readonly string[]): {
    rows: CompositionSeries[];
    columns: {
        id: string;
        valid: boolean;
        segments: (CompositionSeries & {
            value: number | null;
            share: number;
            offset: number;
        })[];
    }[];
};
export declare function compositionArea(columns: ReturnType<typeof buildComposition>["columns"], row: number): string;

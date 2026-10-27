export type HeatCalendarCell = {
    w: number;
    d: number;
};
export interface HeatCalendarSelection {
    start: HeatCalendarCell;
    end?: HeatCalendarCell;
}
export interface HeatCalendarProps {
    unit?: string;
    weeks?: number;
    maxCount?: number;
    values?: number[][];
    endDate?: Date;
    color?: string;
    className?: string;
    selection?: HeatCalendarSelection | null;
    defaultSelection?: HeatCalendarSelection | null;
    onSelectionChange?: (selection: HeatCalendarSelection | null) => void;
}

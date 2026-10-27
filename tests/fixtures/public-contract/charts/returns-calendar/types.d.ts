export type ReturnsCalendarCell = {
    y: number;
    m: number;
};
export interface ReturnsCalendarSelection {
    start: ReturnsCalendarCell;
    end?: ReturnsCalendarCell;
}
export interface ReturnsCalendarProps {
    years?: number[];
    returns?: number[][];
    className?: string;
    selection?: ReturnsCalendarSelection | null;
    defaultSelection?: ReturnsCalendarSelection | null;
    onSelectionChange?: (selection: ReturnsCalendarSelection | null) => void;
}
export interface ReturnsCalendarTooltipData {
    label: string;
    value: number;
    note: string | null;
}

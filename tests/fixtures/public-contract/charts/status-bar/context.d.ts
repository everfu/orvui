export interface StatusBarDatum {
    id: string;
    label: string;
    status: string;
    description?: string;
}
export interface StatusBarStatus {
    id: string;
    label: string;
    color: string;
}
export declare const STATUS_BAR_STATUSES: readonly StatusBarStatus[];
export interface StatusBarProps {
    data: readonly StatusBarDatum[];
    statuses?: readonly StatusBarStatus[];
    label?: string;
    activeId?: string | null;
    defaultActiveId?: string | null;
    className?: string;
}
export declare function createStatusBarModel(props: StatusBarProps, emit: (event: any, ...args: any[]) => void): {
    rows: {
        datum: StatusBarDatum;
        status: StatusBarStatus;
    }[];
    statuses: readonly StatusBarStatus[];
    activeId: string | null;
    activeIndex: number;
    active: {
        datum: StatusBarDatum;
        status: StatusBarStatus;
    };
    label: string;
    setActive: (value: string | null) => void;
    plotRef: HTMLElement | null;
    tooltipOpen: boolean;
    tooltipId: string;
    reduce: boolean;
    canHover: boolean;
};
export declare const statusBarContext: {
    key: import("vue").InjectionKey<{
        rows: {
            datum: StatusBarDatum;
            status: StatusBarStatus;
        }[];
        statuses: readonly StatusBarStatus[];
        activeId: string | null;
        activeIndex: number;
        active: {
            datum: StatusBarDatum;
            status: StatusBarStatus;
        };
        label: string;
        setActive: (value: string | null) => void;
        plotRef: HTMLElement | null;
        tooltipOpen: boolean;
        tooltipId: string;
        reduce: boolean;
        canHover: boolean;
    }>;
    use: () => {
        rows: {
            datum: StatusBarDatum;
            status: StatusBarStatus;
        }[];
        statuses: readonly StatusBarStatus[];
        activeId: string | null;
        activeIndex: number;
        active: {
            datum: StatusBarDatum;
            status: StatusBarStatus;
        };
        label: string;
        setActive: (value: string | null) => void;
        plotRef: HTMLElement | null;
        tooltipOpen: boolean;
        tooltipId: string;
        reduce: boolean;
        canHover: boolean;
    };
};
export declare const useStatusBar: () => {
    rows: {
        datum: StatusBarDatum;
        status: StatusBarStatus;
    }[];
    statuses: readonly StatusBarStatus[];
    activeId: string | null;
    activeIndex: number;
    active: {
        datum: StatusBarDatum;
        status: StatusBarStatus;
    };
    label: string;
    setActive: (value: string | null) => void;
    plotRef: HTMLElement | null;
    tooltipOpen: boolean;
    tooltipId: string;
    reduce: boolean;
    canHover: boolean;
};

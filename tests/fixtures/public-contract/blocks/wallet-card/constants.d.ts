export declare const MORPH: {
    readonly type: "spring";
    readonly duration: 0.5;
    readonly bounce: 0.22;
};
export declare const LIST: {
    hidden: {};
    show: {
        transition: {
            staggerChildren: number;
            delayChildren: number;
        };
    };
};
export declare const ITEM: {
    hidden: {
        opacity: number;
        y: number;
        filter: string;
    };
    show: {
        opacity: number;
        y: number;
        filter: string;
    };
};
export declare const HEAD = "flex items-center gap-2 px-2 py-1.5 text-left";

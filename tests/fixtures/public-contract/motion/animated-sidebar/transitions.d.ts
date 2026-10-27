export declare const submenuVariants: {
    closed: {
        opacity: number;
        clipPath: string;
        transition: {
            duration: number;
            ease: readonly [
                0.16,
                1,
                0.3,
                1
            ];
            staggerChildren: number;
            staggerDirection: number;
        };
    };
    open: {
        opacity: number;
        clipPath: string;
        transition: {
            duration: number;
            delayChildren: number;
            ease: readonly [
                0.16,
                1,
                0.3,
                1
            ];
            staggerChildren: number;
        };
    };
};
export declare const submenuItemVariants: {
    closed: {
        opacity: number;
        y: number;
        filter: string;
    };
    open: {
        opacity: number;
        y: number;
        filter: string;
        transition: {
            duration: number;
            ease: readonly [
                0.16,
                1,
                0.3,
                1
            ];
        };
    };
};

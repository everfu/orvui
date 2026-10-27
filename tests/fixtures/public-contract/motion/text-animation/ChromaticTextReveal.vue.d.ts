type __VLS_Props = {
    prefix: string;
    words: string[];
    colors?: string[];
    foregroundColor?: string;
    duration?: number;
    delay?: number;
    pauseDuration?: number;
    loop?: boolean;
    startOnView?: boolean;
    once?: boolean;
    inViewMargin?: string;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    once: boolean;
    duration: number;
    delay: number;
    colors: string[];
    foregroundColor: string;
    pauseDuration: number;
    loop: boolean;
    startOnView: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

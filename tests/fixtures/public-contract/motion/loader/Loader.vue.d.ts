export type LoaderVariant = "spinner" | "dots" | "bars" | "dot-matrix" | "dither" | "ascii" | "ascii-line" | "ascii-braille" | "ascii-blocks" | "ascii-bounce" | "morph" | "comet" | "scramble" | "metaballs" | "newton" | "helix" | "percent";
type __VLS_Props = {
    variant?: LoaderVariant;
    size?: number;
    speed?: number;
    label?: string;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    label: string;
    size: number;
    speed: number;
    variant: LoaderVariant;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

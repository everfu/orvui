import { type VNode, type PropType } from "vue";
export interface SharedLayoutBgProps {
    as?: "div" | "ul";
    pillClassName?: string;
    inset?: number;
    pillContainerClassName?: string;
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    as: {
        type: PropType<"div" | "ul">;
        default: string;
    };
    pillClassName: StringConstructor;
    inset: {
        type: NumberConstructor;
        default: number;
    };
    pillContainerClassName: StringConstructor;
}>, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    as: {
        type: PropType<"div" | "ul">;
        default: string;
    };
    pillClassName: StringConstructor;
    inset: {
        type: NumberConstructor;
        default: number;
    };
    pillContainerClassName: StringConstructor;
}>> & Readonly<{}>, {
    as: "div" | "ul";
    inset: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;

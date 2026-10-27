import { type HTMLAttributes, type Ref } from "vue";
type __VLS_Props = {
    followOutput?: boolean;
    followThreshold?: number;
    smooth?: boolean;
    label?: string;
    busy?: boolean;
    navigation?: "rail";
    navigationLabel?: string;
    viewportClassName?: string;
    contentClassName?: string;
    railClassName?: string;
    viewportRef?: Ref<HTMLElement | null> | ((element: HTMLElement | null) => void);
    viewportProps?: HTMLAttributes;
    contentProps?: HTMLAttributes;
};
declare function scrollToEnd(behavior?: ScrollBehavior): void;
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {
    scrollToEnd: typeof scrollToEnd;
    viewport: Ref<HTMLElement | null, HTMLElement | null>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    followChange: (following: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onFollowChange?: ((following: boolean) => any) | undefined;
}>, {
    label: string;
    smooth: boolean;
    followOutput: boolean;
    followThreshold: number;
    navigationLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

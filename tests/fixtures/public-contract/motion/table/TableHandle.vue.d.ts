import { type TableMenuItem } from "./TableMenu.vue";
type __VLS_Props = {
    anchor: HTMLElement | null;
    orientation: "row" | "column";
    label: string;
    items: TableMenuItem[];
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    enter: (...args: any[]) => void;
    leave: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onEnter?: ((...args: any[]) => any) | undefined;
    onLeave?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

import { type Content } from "../shared";
export interface BloomMenuItem {
    label: string;
    icon: Content;
}
type __VLS_Props = {
    items?: BloomMenuItem[];
    className?: string;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    select: (label: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((label: string) => any) | undefined;
}>, {
    items: BloomMenuItem[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

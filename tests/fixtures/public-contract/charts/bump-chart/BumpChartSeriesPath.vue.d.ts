import { useBumpChart } from "./context";
import type { BumpPosition } from "./use-geometry";
type __VLS_Props = {
    row: ReturnType<typeof useBumpChart>["rows"][number];
    positions: (BumpPosition | null)[];
    index: number;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

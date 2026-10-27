export { default as ExpandableActionBar } from "./ExpandableActionBar.vue";
export type { ExpandableActionBarItem } from "./ExpandableActionBar.vue";
import { type MaybeRefOrGetter } from "vue";
import type { ExpandableActionBarItem } from "./ExpandableActionBar.vue";
export declare function useExpandableActionBar(items: MaybeRefOrGetter<ExpandableActionBarItem[]>): {
    expanded: import("vue").Ref<boolean, boolean>;
    setExpanded: (value: boolean) => boolean;
    activeId: import("vue").Ref<string, string>;
    setActiveId: (value: string) => string;
    activeItem: import("vue").ComputedRef<ExpandableActionBarItem | undefined>;
};
export type * from "./api-types";
export type * from "./source-types";

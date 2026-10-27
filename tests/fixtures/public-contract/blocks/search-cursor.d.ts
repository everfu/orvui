import { type Ref } from "vue";
export declare function useSearchCursor<T extends {
    id: string;
}>(rows: Ref<T[]>, query: Ref<string>): {
    active: import("vue").ComputedRef<number>;
    moveTo: (id: string | null) => void;
    moveActive: (direction: 1 | -1) => void;
};

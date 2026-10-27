import { type Ref } from "vue";
export declare function useBlockDismiss(open: Ref<boolean>, root: Ref<unknown>, close: () => void, consume?: boolean): {
    isTop: () => boolean;
    claimEscape(event: KeyboardEvent): boolean;
    containsHigher: (target: EventTarget | null) => boolean;
};

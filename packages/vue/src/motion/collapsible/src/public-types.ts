import type { Ref, ComputedRef } from "vue";
export interface CollapsibleState {
  open: Ref<boolean>;
  disabled: ComputedRef<boolean>;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

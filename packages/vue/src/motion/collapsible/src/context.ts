import type { ComputedRef, Ref, WritableComputedRef } from "vue";
export interface CollapsibleContext {
  open: WritableComputedRef<boolean>;
  id: string;
  triggerRef: Ref<HTMLButtonElement | null>;
  reduce: Ref<boolean>;
  disabled: ComputedRef<boolean | undefined>;
  setOpen(open: boolean): void;
  toggle(): void;
}

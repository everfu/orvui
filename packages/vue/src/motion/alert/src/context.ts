import type { ComputedRef, Ref, WritableComputedRef } from "vue";
import type { AlertVariant } from "./public-types";
export interface AlertContext {
  open: WritableComputedRef<boolean>;
  variant: ComputedRef<AlertVariant>;
  reduce: Ref<boolean>;
  setOpen(open: boolean): void;
  dismiss(): void;
}

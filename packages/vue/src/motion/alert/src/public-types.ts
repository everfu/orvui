import type { Ref, ComputedRef } from "vue";
import type { AlertProps } from "./api-types";
export type AlertVariant = NonNullable<AlertProps["variant"]>;
export interface AlertState {
  open: Ref<boolean>;
  variant: ComputedRef<AlertVariant>;
  setOpen: (open: boolean) => void;
  dismiss: () => void;
}

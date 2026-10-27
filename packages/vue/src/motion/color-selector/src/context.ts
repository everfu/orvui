import type { ComputedRef, Ref, WritableComputedRef } from "vue";
export interface ColorSelectorContext {
  value: WritableComputedRef<string>; name: ComputedRef<string>; form: ComputedRef<string | undefined>;
  disabled: ComputedRef<boolean | undefined>; required: ComputedRef<boolean | undefined>; placed: Ref<boolean>;
  register(value: string, item: { element: HTMLElement; color: string }): void;
  unregister(value: string): void;
  select(value: string): void;
}

import type { ComputedRef, Ref } from "vue";
export interface StepperContext {
  value: ComputedRef<number>; valueText: ComputedRef<string>; direction: Ref<number>;
  atMin: ComputedRef<boolean>; atMax: ComputedRef<boolean>; disabled: ComputedRef<boolean>;
  reduce: Ref<boolean>; decrementRef: Ref<HTMLButtonElement | null>; incrementRef: Ref<HTMLButtonElement | null>;
  decrement(restoreFocus: boolean): void; increment(restoreFocus: boolean): void;
}

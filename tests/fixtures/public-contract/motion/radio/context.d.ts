import type { ComputedRef, WritableComputedRef } from "vue";
export interface RadioContext {
    value: WritableComputedRef<string>;
    id: string;
    name: ComputedRef<string>;
    tabStop: ComputedRef<string | null>;
    register(value: string, disabled: boolean): void;
    unregister(value: string): void;
    setValue(value: string): void;
}

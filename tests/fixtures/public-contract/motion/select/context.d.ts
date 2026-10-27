import { type InjectionKey, type Ref } from "vue";
export interface SelectProps {
    modelValue?: string;
    value?: string;
    defaultValue?: string;
    open?: boolean;
    defaultOpen?: boolean;
    disabled?: boolean;
    className?: string;
}
export declare const UNFOLD_SPRING: {
    readonly type: "spring";
    readonly visualDuration: 0.2;
    readonly bounce: 0.12;
};
export declare const UNFOLD_EXIT: {
    readonly duration: 0.2;
    readonly ease: readonly [
        0.16,
        1,
        0.3,
        1
    ];
};
export declare const MORPH: {
    readonly type: "spring";
    readonly duration: 0.5;
    readonly bounce: 0.22;
};
export declare const ROW = "flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-sm";
export declare const ITEM_VARIANTS: {
    hidden: {
        opacity: number;
        y: number;
        transition: {
            duration: number;
            ease: readonly [
                0.16,
                1,
                0.3,
                1
            ];
        };
    };
    show: {
        opacity: number;
        y: number;
        transition: {
            duration: number;
            ease: readonly [
                0.16,
                1,
                0.3,
                1
            ];
        };
    };
};
export declare const MORPH_ITEM: {
    hidden: {
        opacity: number;
        y: number;
        filter: string;
    };
    show: {
        opacity: number;
        y: number;
        filter: string;
    };
};
export declare function createSelect(p: SelectProps, emit: (event: any, ...args: any[]) => void, morph?: boolean): {
    root: Ref<HTMLElement | null, HTMLElement | null>;
    trigger: import("vue").ShallowRef<unknown, unknown>;
    list: import("vue").ShallowRef<unknown, unknown>;
    value: import("vue").WritableComputedRef<string | undefined, string | undefined>;
    open: import("vue").WritableComputedRef<boolean, boolean>;
    progress: import("motion-v").MotionValue<number>;
    reduce: Ref<boolean, boolean>;
    rows: import("vue").ComputedRef<{
        label: string;
        disabled: boolean;
        id: string;
    }[]>;
    enabled: import("vue").ComputedRef<{
        label: string;
        disabled: boolean;
        id: string;
    }[]>;
    activeId: import("vue").ComputedRef<string | null>;
    active: Ref<string | null, string | null>;
    register: (v: string, label: string, disabled: boolean, token: symbol) => void;
    unregister: (v: string, token: symbol) => void;
    close: () => void;
    select: (v: string) => void;
    keydown: (event: KeyboardEvent) => void;
    focusActive: () => Promise<void>;
    placeholder: Ref<string, string>;
    placement: Ref<"top" | "bottom", "top" | "bottom">;
    morph: boolean;
    disabled: import("vue").ComputedRef<boolean>;
    labelFor: (v: string | undefined) => string | undefined;
    triggerId: string;
    listId: string;
    headerId: string;
    layoutId: string;
};
export declare const selectKey: InjectionKey<ReturnType<typeof createSelect>>;
export declare const registrarKey: InjectionKey<boolean>;
export declare function useSelect(): {
    root: Ref<HTMLElement | null, HTMLElement | null>;
    trigger: import("vue").ShallowRef<unknown, unknown>;
    list: import("vue").ShallowRef<unknown, unknown>;
    value: import("vue").WritableComputedRef<string | undefined, string | undefined>;
    open: import("vue").WritableComputedRef<boolean, boolean>;
    progress: import("motion-v").MotionValue<number>;
    reduce: Ref<boolean, boolean>;
    rows: import("vue").ComputedRef<{
        label: string;
        disabled: boolean;
        id: string;
    }[]>;
    enabled: import("vue").ComputedRef<{
        label: string;
        disabled: boolean;
        id: string;
    }[]>;
    activeId: import("vue").ComputedRef<string | null>;
    active: Ref<string | null, string | null>;
    register: (v: string, label: string, disabled: boolean, token: symbol) => void;
    unregister: (v: string, token: symbol) => void;
    close: () => void;
    select: (v: string) => void;
    keydown: (event: KeyboardEvent) => void;
    focusActive: () => Promise<void>;
    placeholder: Ref<string, string>;
    placement: Ref<"top" | "bottom", "top" | "bottom">;
    morph: boolean;
    disabled: import("vue").ComputedRef<boolean>;
    labelFor: (v: string | undefined) => string | undefined;
    triggerId: string;
    listId: string;
    headerId: string;
    layoutId: string;
};

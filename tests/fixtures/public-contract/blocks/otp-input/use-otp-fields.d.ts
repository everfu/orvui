type Options = {
    length: () => number;
    value: () => string | undefined;
    initial: string;
    masked: () => boolean;
    changed: (value: string) => void;
    completed: (value: string) => void;
};
export declare function useOtpFields(options: Options): {
    count: import("vue").ComputedRef<number>;
    fields: import("vue").Ref<string[], string[]>;
    cursor: import("vue").Ref<number, number>;
    announcement: import("vue").Ref<string, string>;
    insert: (value: string) => void;
    erase: (backwards: boolean) => void;
    navigate: (key: string) => boolean;
    replace: (value: string) => void;
};
export {};

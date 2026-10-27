export declare function useImageViewer(): {
    images: import("vue").Ref<import("./types").LightboxImage[], import("./types").LightboxImage[]>;
    value: import("vue").Ref<string | null, string | null>;
    image: import("vue").Ref<import("./types").LightboxImage | undefined, import("./types").LightboxImage | undefined>;
    index: import("vue").Ref<number, number>;
    select: (value: string | null) => void;
    close: () => void;
    previous: () => void;
    next: () => void;
    hasPrevious: import("vue").ComputedRef<boolean>;
    hasNext: import("vue").ComputedRef<boolean>;
};

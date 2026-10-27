import { type InjectionKey, type Ref, type VNodeChild } from "vue";
import type { LightboxImage } from "./types";
export interface ImageViewerContext {
    images: Ref<LightboxImage[]>;
    value: Ref<string | null>;
    index: Ref<number>;
    image: Ref<LightboxImage | undefined>;
    id: string;
    direction: Ref<number>;
    label: Ref<string>;
    reduce: Ref<boolean>;
    renderCaption?: (image: LightboxImage) => VNodeChild;
    select: (value: string | null) => void;
    move: (direction: number) => void;
}
export declare const viewerKey: InjectionKey<ImageViewerContext>;
export declare function useViewer(): ImageViewerContext;
export declare function useViewerModal(open: Ref<boolean>, root: Ref<HTMLElement | null>, panel: Ref<HTMLElement | null>, close: () => void): void;

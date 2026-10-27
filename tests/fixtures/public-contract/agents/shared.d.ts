export { RenderNode, useControllable, useOutside, useReduced, rove, type Content, } from "../blocks/shared";
export declare function useClipboard(read: () => string, callback?: () => void | Promise<void>): {
    copied: import("vue").Ref<boolean, boolean>;
    copy: () => Promise<void>;
};

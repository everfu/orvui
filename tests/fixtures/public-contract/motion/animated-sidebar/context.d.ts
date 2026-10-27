import { type Ref, type ComputedRef, type WritableComputedRef } from "vue";
export interface SidebarContext {
    open: WritableComputedRef<boolean>;
    mobileOpen: WritableComputedRef<boolean>;
    mobile: Ref<boolean>;
    reduce: Ref<boolean>;
    id: string;
    triggerRef: Ref<HTMLButtonElement | null>;
    toggle: () => void;
    setOpen: (value: boolean) => void;
    setOpenMobile: (value: boolean) => void;
    state: ComputedRef<"expanded" | "collapsed">;
}
export interface SidebarPanel {
    collapsed: ComputedRef<boolean>;
    side: ComputedRef<"left" | "right">;
    collapsible: ComputedRef<"offcanvas" | "icon" | "none">;
}
export declare function useSidebar(): SidebarContext;
export declare function useSidebarPanel(): SidebarPanel;

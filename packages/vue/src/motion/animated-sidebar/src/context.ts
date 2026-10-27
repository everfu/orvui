import {
  inject,
  type Ref,
  type ComputedRef,
  type WritableComputedRef,
} from "vue";
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
export function useSidebar() {
  const state = inject<SidebarContext>("orvui-sidebar");
  if (state) return state;
  throw new Error(
    "useAnimatedSidebar must be used inside AnimatedSidebarProvider.",
  );
}
export function useSidebarPanel() {
  const panel = inject<SidebarPanel>("orvui-sidebar-panel");
  if (panel) return panel;
  throw new Error(
    "Animated Sidebar parts must be used inside AnimatedSidebar.",
  );
}

import { computed, onBeforeUnmount, onMounted, provide, ref, useId } from "vue";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";
import type { SidebarContext } from "./context";
export interface SidebarOptions {
  open?: boolean;
  defaultOpen: boolean;
  openMobile?: boolean;
  mobileOpen?: boolean;
  defaultOpenMobile?: boolean;
  defaultMobileOpen: boolean;
  shortcut: boolean;
}
export function provideSidebar(
  props: SidebarOptions,
  emit: (name: string, value: boolean) => void,
) {
  const local = ref(props.defaultOpen),
    localMobile = ref(props.defaultOpenMobile ?? props.defaultMobileOpen);
  const open = computed({
    get: () => props.open ?? local.value,
    set(value: boolean) {
      if (props.open === undefined) local.value = value;
      emit("update:open", value);
      emit("openChange", value);
    },
  });
  const mobileOpen = computed({
    get: () => props.openMobile ?? props.mobileOpen ?? localMobile.value,
    set(value: boolean) {
      if (props.openMobile === undefined && props.mobileOpen === undefined)
        localMobile.value = value;
      for (const event of [
        "update:openMobile",
        "update:mobileOpen",
        "openMobileChange",
      ])
        emit(event, value);
    },
  });
  const mobile = useMediaQuery("(max-width: 767px)"),
    reduce = useReducedMotion(),
    id = useId(),
    triggerRef = ref<HTMLButtonElement | null>(null);
  function toggle() {
    if (mobile.value) mobileOpen.value = !mobileOpen.value;
    else open.value = !open.value;
  }
  const state = computed((): "expanded" | "collapsed" =>
    open.value ? "expanded" : "collapsed",
  );
  const context: SidebarContext = {
    open,
    mobileOpen,
    mobile,
    reduce,
    id,
    triggerRef,
    toggle,
    setOpen(value) {
      open.value = value;
    },
    setOpenMobile(value) {
      mobileOpen.value = value;
    },
    state,
  };
  provide("orvui-sidebar", context);
  function shortcut(event: KeyboardEvent) {
    if (
      !props.shortcut ||
      !(event.ctrlKey || event.metaKey) ||
      event.key.toLowerCase() !== "b"
    )
      return;
    event.preventDefault();
    toggle();
  }
  onMounted(() => window.addEventListener("keydown", shortcut));
  onBeforeUnmount(() => window.removeEventListener("keydown", shortcut));
  return context;
}

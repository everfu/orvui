import { inject, onBeforeUnmount, onMounted, provide, ref, useId, type InjectionKey } from "vue";
import { useFloatingLayer, useReducedMotion } from "../../../lib/composables";
import { useMotionState } from "../../state";
export type MenuPoint = { x: number; y: number };
export type MenuInput = "pointer" | "keyboard" | "touch";
export function provideMenu(props: { open?: boolean; defaultOpen?: boolean }, emit: (...args: any[]) => void) {
  const open = useMotionState(props, emit, "open", props.defaultOpen ?? false);
  const point = ref<MenuPoint>({ x: 0, y: 0 }), modality = ref<MenuInput>("pointer");
  const invocation = ref(0), activeId = ref<string | null>(null);
  const trigger = ref<HTMLElement | null>(null), contentRef = ref<HTMLElement | null>(null);
  const id = useId(), reduce = useReducedMotion();
  const layer = useFloatingLayer(open, contentRef);
  function setOpen(value: boolean) { open.value = value; if (!value) activeId.value = null; }
  const close = () => { setOpen(false); trigger.value?.focus(); };
  const state = { open, point, modality, invocation, activeId, trigger, contentRef, id, reduce, layer, setOpen, close,
    openAt(position: MenuPoint, input: MenuInput) { point.value = position; modality.value = input; ++invocation.value; activeId.value = null; setOpen(true); },
  };
  provide(menuKey, state);
  const escape = (event: KeyboardEvent) => { if (layer.claimEscape(event)) close(); };
  const dismiss = (event: PointerEvent) => {
    if (open.value && !layer.containsHigher(event.target) && !contentRef.value?.contains(event.target as Node)) setOpen(false);
  };
  const windowChanged = () => { if (open.value) setOpen(false); };
  const bindings = () => [
    [document, "keydown", escape], [window, "pointerdown", dismiss],
    [window, "resize", windowChanged], [window, "scroll", windowChanged],
  ] as const;
  onMounted(() => { for (const [node, type, listener] of bindings()) node.addEventListener(type, listener as EventListener); });
  onBeforeUnmount(() => { for (const [node, type, listener] of bindings()) node.removeEventListener(type, listener as EventListener); });
  return state;
}
export type MenuState = ReturnType<typeof provideMenu>;
const menuKey: InjectionKey<MenuState> = Symbol("orvui-menu");
export function useMenu() {
  const state = inject(menuKey);
  if (!state) throw new Error("A context menu part requires ContextMenu");
  return state;
}

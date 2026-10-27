import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useId,
  watch,
  type InjectionKey,
} from "vue";
import { animate, motionValue } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import {
  resolveElement,
  useFloatingLayer,
  useReducedMotion,
} from "../../../lib/composables";
export interface SelectProps {
  modelValue?: string;
  value?: string;
  defaultValue?: string;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
}
// These visual endpoints and timings are part of the frozen interaction contract.
export const UNFOLD_SPRING = {
  type: "spring",
  visualDuration: 0.2,
  bounce: 0.12,
} as const;
export const UNFOLD_EXIT = { duration: 0.2, ease: EASE_OUT } as const;
export const MORPH = { type: "spring", duration: 0.5, bounce: 0.22 } as const;
export const ROW =
  "flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-sm";
export const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: -4, transition: { duration: 0.08, ease: EASE_OUT } },
  show: { opacity: 1, y: 0, transition: { duration: 0.12, ease: EASE_OUT } },
};
export const MORPH_ITEM = {
  hidden: { opacity: 0, y: -6, filter: "blur(3px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};
type Registration = { label: string; disabled: boolean };
export function createSelect(
  props: SelectProps,
  emit: (event: any, ...args: any[]) => void,
  morph = false,
) {
  const instance = useId();
  const root = ref<HTMLElement | null>(null);
  const trigger = shallowRef<unknown>(null);
  const list = shallowRef<unknown>(null);
  const memory = ref(props.defaultValue);
  const expanded = ref(!!props.defaultOpen);
  const reduce = useReducedMotion();
  const placeholder = ref("Select");
  const placement = ref<"top" | "bottom">("bottom");
  const active = ref<string | null>(null);
  const registry = shallowRef(new Map<string, Map<symbol, Registration>>());
  const value = computed({
    get: () => props.modelValue ?? props.value ?? memory.value,
    set: (next: string | undefined) => {
      if (props.modelValue === undefined && props.value === undefined)
        memory.value = next;
      for (const event of ["update:modelValue", "valueChange", "change"])
        emit(event, next);
    },
  });
  const open = computed({
    get: () => props.open ?? expanded.value,
    set: (next: boolean) => {
      if (props.open === undefined) expanded.value = next;
      emit("update:open", next);
      emit("openChange", next);
    },
  });
  const disabled = computed(() => !!props.disabled);
  const progress = motionValue(open.value ? 1 : 0);
  const rows = computed(() =>
    [...registry.value].map(([id, tokens]) => ({
      id,
      ...[...tokens.values()].at(-1)!,
    })),
  );
  const enabled = computed(() => rows.value.filter((row) => !row.disabled));
  const activeId = computed(
    () =>
      enabled.value.find((row) => row.id === active.value)?.id ??
      enabled.value[0]?.id,
  );
  const layer = useFloatingLayer(open, list);
  let mounted = false;
  let disposed = false;
  let initialOpening = open.value;
  let focusRevision = 0;
  let animation: ReturnType<typeof animate> | undefined;
  let typed = { text: "", timestamp: 0 };
  function register(
    id: string,
    label: string,
    disabled: boolean,
    token: symbol,
  ) {
    const entry = registry.value.get(id)?.get(token);
    if (entry?.label === label && entry.disabled === disabled) return;
    const tokens = new Map(registry.value.get(id));
    tokens.set(token, { label, disabled });
    registry.value = new Map([...registry.value, [id, tokens]]);
  }
  function unregister(id: string, token: symbol) {
    const tokens = new Map(registry.value.get(id));
    if (!tokens.delete(token)) return;
    const next = new Map(registry.value);
    if (tokens.size) next.set(id, tokens);
    else next.delete(id);
    registry.value = next;
  }
  async function focusActive() {
    const revision = ++focusRevision;
    await nextTick();
    if (disposed || !open.value || revision !== focusRevision) return;
    const surface = resolveElement<HTMLElement>(list.value);
    const option = [
      ...(surface?.querySelectorAll<HTMLElement>("[data-listbox-id]") ?? []),
    ].find((element) => element.dataset.listboxId === activeId.value);
    option?.focus({ preventScroll: false });
  }
  function close() {
    const source = root.value?.ownerDocument.activeElement;
    const restore =
      source &&
      root.value?.contains(source) &&
      source !== resolveElement(trigger.value);
    ++focusRevision;
    open.value = false;
    if (!restore) return;
    if (!morph) resolveElement<HTMLElement>(trigger.value)?.focus();
    else
      void nextTick(() => {
        if (!disposed && !open.value)
          resolveElement<HTMLElement>(trigger.value)?.focus();
      });
  }
  function select(id: string) {
    if (disabled.value || !enabled.value.some((row) => row.id === id)) return;
    value.value = id;
    close();
  }
  function keydown(event: KeyboardEvent) {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      disabled.value ||
      !enabled.value.length
    )
      return;
    const choices = enabled.value;
    const current = Math.max(
      0,
      choices.findIndex((row) => row.id === activeId.value),
    );
    const delta =
      event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (delta || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? choices.length - 1
            : (current + delta + choices.length) % choices.length;
      active.value = choices[next]!.id;
      return;
    }
    if (
      event.key.length !== 1 ||
      event.key === " " ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey
    )
      return;
    const timestamp = Date.now();
    const text =
      timestamp - typed.timestamp < 500
        ? typed.text + event.key.toLocaleLowerCase()
        : event.key.toLocaleLowerCase();
    typed = { timestamp, text };
    const start = text.length === 1 ? current + 1 : current;
    const found = Array.from(
      { length: choices.length },
      (_, offset) => choices[(start + offset) % choices.length]!,
    ).find((row) => row.label.toLocaleLowerCase().startsWith(text));
    if (found) active.value = found.id;
  }
  function animateToState() {
    animation?.stop();
    if (mounted)
      animation = animate(
        progress,
        open.value ? 1 : 0,
        reduce.value
          ? { duration: 0.12 }
          : open.value
            ? UNFOLD_SPRING
            : UNFOLD_EXIT,
      );
  }
  watch(
    open,
    (next, previous) => {
      if (!next) {
        initialOpening = false;
        ++focusRevision;
        return;
      }
      if (!previous)
        active.value =
          enabled.value.find((row) => row.id === value.value)?.id ?? null;
      if (!initialOpening) void focusActive();
    },
    { flush: "post" },
  );
  watch(
    activeId,
    () => {
      const surface = resolveElement<HTMLElement>(list.value);
      if (
        open.value &&
        (!initialOpening ||
          surface?.contains(surface.ownerDocument.activeElement))
      )
        void focusActive();
    },
    { flush: "post" },
  );
  watch([open, reduce], animateToState, { flush: "post" });
  const outside = (event: PointerEvent) => {
    if (
      open.value &&
      !layer.containsHigher(event.target) &&
      event.target instanceof Node &&
      !root.value?.contains(event.target)
    )
      open.value = false;
  };
  const escape = (event: KeyboardEvent) => {
    if (layer.claimEscape(event)) close();
  };
  onMounted(() => {
    mounted = true;
    animateToState();
    window.addEventListener("pointerdown", outside);
    window.addEventListener("keydown", escape);
  });
  onBeforeUnmount(() => {
    disposed = true;
    mounted = false;
    ++focusRevision;
    animation?.stop();
    progress.destroy();
    window.removeEventListener("pointerdown", outside);
    window.removeEventListener("keydown", escape);
  });
  return {
    root,
    trigger,
    list,
    value,
    open,
    progress,
    reduce,
    rows,
    enabled,
    activeId,
    active,
    register,
    unregister,
    close,
    select,
    keydown,
    focusActive,
    placeholder,
    placement,
    morph,
    disabled,
    labelFor: (id: string | undefined) =>
      rows.value.find((row) => row.id === id)?.label,
    triggerId: `${instance}-trigger`,
    listId: `${instance}-list`,
    headerId: `${instance}-header`,
    layoutId: `${instance}-surface`,
  };
}
export const selectKey: InjectionKey<ReturnType<typeof createSelect>> =
  Symbol("orvui-select");
export const registrarKey: InjectionKey<boolean> = Symbol(
  "orvui-select-registrar",
);
export function useSelect() {
  const state = inject(selectKey);
  if (!state) throw Error("Select parts must be inside Select or MorphSelect.");
  return state;
}

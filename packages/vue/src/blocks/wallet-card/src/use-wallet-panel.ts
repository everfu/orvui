import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  watch,
  type Ref,
} from "vue";
import { useReducedMotion } from "../../../lib/composables";
import { useBlockDismiss } from "../../dismiss";
import { MORPH } from "./constants";
export function useWalletPanel(
  name: string,
  delay: number,
  focused?: () => void,
) {
  const open = ref(false),
    armed = ref(false),
    root = ref<HTMLElement>(),
    reduce = useReducedMotion(),
    layoutId = useId() + name;
  let timer: ReturnType<typeof setTimeout> | undefined,
    disposed = false;
  useBlockDismiss(open, root, () => {
    open.value = false;
  });
  watch([open, reduce], () => {
    clearTimeout(timer);
    armed.value = false;
    if (!open.value) return;
    void nextTick(() => {
      if (!disposed && open.value) focused?.();
    });
    timer = setTimeout(
      () => {
        armed.value = true;
      },
      reduce.value ? 0 : delay,
    );
  });
  onBeforeUnmount(() => {
    disposed = true;
    clearTimeout(timer);
  });
  return {
    open,
    armed,
    root,
    reduce,
    layoutId,
    morph: computed(() => (reduce.value ? { duration: 0 } : MORPH)),
  };
}

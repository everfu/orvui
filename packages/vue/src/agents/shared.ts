export {
  RenderNode,
  useControllable,
  useOutside,
  useReduced,
  rove,
  type Content,
} from "../blocks/shared";
import { onBeforeUnmount, ref } from "vue";

export function useClipboard(
  read: () => string,
  callback?: () => void | Promise<void>,
) {
  const copied = ref(false);
  let reset: ReturnType<typeof setTimeout> | undefined;
  let generation = 0;
  let alive = true;
  async function copy() {
    const request = ++generation;
    if (reset !== undefined) clearTimeout(reset);
    copied.value = false;
    try {
      if (callback) await callback();
      else await navigator.clipboard.writeText(read());
      if (!alive || request !== generation) return;
      copied.value = true;
      reset = setTimeout(() => {
        if (alive) copied.value = false;
      }, 1600);
    } catch {
      if (alive && request === generation) copied.value = false;
    }
  }
  onBeforeUnmount(() => {
    alive = false;
    generation++;
    if (reset !== undefined) clearTimeout(reset);
  });
  return { copied, copy };
}

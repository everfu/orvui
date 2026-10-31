import { onBeforeUnmount, ref } from "vue";

/** Clipboard acknowledgements belong to the view that initiated the write. */
export function useSiteCopy(duration: number) {
  const copied = ref(false),
    failed = ref(false);
  let generation = 0;
  let disposed = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  async function copyText(value: string) {
    const token = ++generation;
    clearTimeout(timer);
    failed.value = false;
    try {
      await navigator.clipboard.writeText(value);
      if (disposed || token !== generation) return;
      copied.value = true;
      timer = setTimeout(() => {
        copied.value = false;
      }, duration);
    } catch {
      if (!disposed && token === generation) failed.value = true;
    }
  }
  onBeforeUnmount(() => {
    disposed = true;
    ++generation;
    clearTimeout(timer);
  });
  function invalidate() {
    ++generation;
    clearTimeout(timer);
    copied.value = false;
    failed.value = false;
  }
  return { copied, failed, copyText, invalidate };
}

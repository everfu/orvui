import { computed } from "vue";
import { useViewer } from "./context";
export function useImageViewer() {
  const viewer = useViewer();
  function close() { viewer.select(null); }
  function previous() { viewer.move(-1); }
  function next() { viewer.move(1); }
  return { images: viewer.images, value: viewer.value, image: viewer.image, index: viewer.index, select: viewer.select, close, previous, next, hasPrevious: computed(() => viewer.index.value > 0), hasNext: computed(() => viewer.index.value >= 0 && viewer.index.value + 1 < viewer.images.value.length) };
}

import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";

/** Coordinate the scene through the same accessibility preferences as its actions. */
export function useNotFoundScene() {
  const reduced = useReducedMotion();
  const pointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  return { reduced, hover: computed(() => pointer.value && !reduced.value) };
}

export function useSpotlightPosition(available: Ref<boolean>) {
  const position = ref({ x: 50, y: 50 });
  const mask = computed(() => `radial-gradient(220px circle at ${position.value.x}% ${position.value.y}%, #000 25%, transparent 72%)`);
  function move(event: MouseEvent) {
    const surface = event.currentTarget;
    if (!available.value || !(surface instanceof HTMLElement)) return;
    const bounds = surface.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    position.value = { x: 100 * (event.clientX - bounds.left) / bounds.width, y: 100 * (event.clientY - bounds.top) / bounds.height };
  }
  return { mask, move };
}

/** Finite animation, with mount-only scheduling so server markup is deterministic. */
export function useCodeScramble(text: () => string) {
  const { reduced } = useNotFoundScene();
  const output = ref(text());
  const alphabet = Array.from("ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/\\");
  let mounted = false;
  let pending: number | undefined;
  const cancel = () => {
    if (pending !== undefined) cancelAnimationFrame(pending);
    pending = undefined;
  };
  function restart() {
    cancel();
    output.value = text();
    if (!mounted || reduced.value) return;
    const symbols = Array.from(text());
    const epoch = performance.now();
    let painted = epoch;
    const paint = (now: number) => {
      pending = undefined;
      const elapsed = Math.max(0, now - epoch);
      if (elapsed >= 700) { output.value = text(); return; }
      if (now - painted >= 45) {
        painted = now;
        const ready = Math.floor(symbols.length * elapsed / 700);
        output.value = symbols.map((char, i) => i < ready || char === " " ? char : alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
      }
      pending = requestAnimationFrame(paint);
    };
    pending = requestAnimationFrame(paint);
  }
  watch([text, reduced], restart);
  onMounted(() => { mounted = true; restart(); });
  onBeforeUnmount(() => { mounted = false; cancel(); });
  return output;
}

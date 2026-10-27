import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";
export const asciiFrames: Record<string, string[]> = {
  ascii: Array.from("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"), "ascii-line": ["|", "/", "-", "\\"],
  "ascii-braille": Array.from("⣾⣽⣻⢿⡿⣟⣯⣷"),
  "ascii-blocks": Array.from("▁▂▃▄▅▆▇█▇▆▅▄▃▂"), "ascii-bounce": Array.from("⠁⠂⠄⡀⢀⠠⠐⠈"),
};
export function useLoaderClock(props: { variant: string; speed: number }, reduced: Ref<boolean>) {
  const frame = ref(0), text = ref("LOADING"), percent = ref(0);
  const frames = computed(() => asciiFrames[props.variant]);
  let mounted = false, interval: ReturnType<typeof setInterval> | undefined;
  function restart() {
    clearInterval(interval);
    frame.value = 0; text.value = "LOADING"; percent.value = 0;
    if (!mounted) return;
    if (frames.value) {
      const count = frames.value.length;
      interval = setInterval(() => { frame.value = (frame.value + 1) % count; }, 1000 * props.speed * (reduced.value ? 2.5 : 1) / count);
    } else if (props.variant === "scramble" && !reduced.value) {
      const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/*#@";
      let iteration = 0;
      interval = setInterval(() => {
        const revealed = iteration++ % 11;
        text.value = Array.from("LOADING", (letter, index) => index < revealed ? letter : symbols[Math.floor(Math.random() * symbols.length)]).join("");
      }, 1000 * props.speed * 0.55 / 7);
    } else if (props.variant === "percent") {
      let elapsed = 0;
      const duration = 1000 * props.speed * (reduced.value ? 2 : 1);
      interval = setInterval(() => {
        elapsed += 40;
        percent.value = Math.min(100, Math.round(100 * elapsed / duration));
        if (percent.value >= 100) elapsed = 0;
      }, 40);
    }
  }
  watch([() => props.variant, () => props.speed, reduced], restart);
  onMounted(() => { mounted = true; restart(); });
  onBeforeUnmount(() => { mounted = false; clearInterval(interval); });
  return { frame, text, percent };
}

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate, useMotionValue } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import type { MenuState } from "./menu-state";
const bound = (value: number, maximum: number, minimum = 0) => Math.max(minimum, Math.min(value, maximum));
export function useMenuSurface(ctx: MenuState) {
  const mounted = ref(false), morphReady = ref(false);
  const position = ref({ x: 0, y: 0 });
  const geometry = ref({ x: 0, y: 0, width: 0, height: 0 });
  const collapsed = computed(() => {
    const { x, y, width, height } = geometry.value;
    const edges = [bound(y - 8, height), bound(width - x - 8, width), bound(height - y - 8, height), bound(x - 8, width)];
    return `inset(${edges.map(edge => `${edge}px`).join(" ")} round 10px)`;
  });
  const visualOpen = computed(() => ctx.open.value && morphReady.value);
  const opacity = useMotionValue(0);
  const clipPath = useMotionValue("inset(0px 0px 0px 0px round 10px)");
  let animations: ReturnType<typeof animate>[] = [];
  function stopAnimations() {
    animations.forEach((animation) => animation.stop());
    animations = [];
  }
  watch(
    () => [visualOpen.value, ctx.reduce.value, ctx.modality.value] as const,
    ([opened]) => {
      if (ctx.open.value && !opened) return;
      stopAnimations();
      const duration =
        ctx.modality.value === "keyboard" ? 0 : ctx.reduce.value ? 0.1 : 0.3;
      if (ctx.reduce.value || ctx.modality.value === "keyboard")
        clipPath.jump("inset(0px 0px 0px 0px round 12px)");
      animations = [
        animate(opacity, opened ? 1 : 0, { duration, ease: EASE_OUT }),
        animate(
          clipPath,
          ctx.reduce.value || ctx.modality.value === "keyboard" || opened
            ? "inset(0px 0px 0px 0px round 12px)"
            : collapsed.value,
          { duration, ease: EASE_OUT },
        ),
      ];
    },
    { flush: "post" },
  );
  const frames = new Set<number>();
  let version = 0, prefix = "";
  let prefixExpiry: ReturnType<typeof setTimeout> | undefined;
  function cancelFrames() { frames.forEach(cancelAnimationFrame); frames.clear(); }
  function frame(fn: () => void, token: number) {
    const id = requestAnimationFrame(() => { frames.delete(id); if (mounted.value && ctx.open.value && token === version) fn(); });
    frames.add(id);
  }
  function items() { return Array.from(ctx.contentRef.value?.querySelectorAll<HTMLElement>('[data-context-menu-item="true"]:not([data-disabled="true"])') ?? []); }
  async function prepare() {
    const token = ++version;
    cancelFrames();
    morphReady.value = false;
    if (!mounted.value || !ctx.open.value) return;
    // An interrupted exit must not carry its opacity or clip into the new reveal.
    stopAnimations();
    opacity.jump(0);
    await nextTick();
    if (!mounted.value || !ctx.open.value || token !== version) return;
    const element = ctx.contentRef.value;
    if (!element) return;
    const { width, height } = element.getBoundingClientRect();
    const { x, y } = ctx.point.value;
    const left = bound(x, Math.max(8, innerWidth - width - 8), 8);
    const top = bound(y, Math.max(8, innerHeight - height - 8), 8);
    position.value = { x: left, y: top };
    geometry.value = {
      width,
      height,
      x: bound(x - left, Math.max(12, width - 12), 12),
      y: bound(y - top, Math.max(12, height - 12), 12),
    };
    clipPath.jump(ctx.reduce.value || ctx.modality.value === "keyboard"
      ? "inset(0px 0px 0px 0px round 12px)" : collapsed.value);
    element.dataset.invocation = String(ctx.invocation.value);
    async function reveal() {
      morphReady.value = true;
      await nextTick();
      if (mounted.value && ctx.open.value && token === version)
        items()[0]?.focus({ preventScroll: true });
    }
    if (ctx.reduce.value || ctx.modality.value === "keyboard") void reveal();
    else frame(() => frame(() => { void reveal(); }, token), token);
  }
  function key(event: KeyboardEvent) {
    if (event.defaultPrevented) return;
    if (event.key === "Escape") { if (ctx.layer.claimEscape(event)) ctx.close(); return; }
    if (event.key === "Tab") { ctx.setOpen(false); return; }
    const choices = items();
    const commands = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (commands.includes(event.key)) {
      event.preventDefault();
      const index = choices.indexOf(document.activeElement as HTMLElement);
      const next = event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1
        : index < 0 ? 0 : (index + (event.key === "ArrowDown" ? 1 : -1) + choices.length) % choices.length;
      choices[next]?.focus(); return;
    }
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    prefix += event.key.toLocaleLowerCase();
    clearTimeout(prefixExpiry);
    prefixExpiry = setTimeout(() => { prefix = ""; }, 500);
    choices.find(choice => (choice.dataset.label ?? choice.textContent ?? "").trim().toLocaleLowerCase().startsWith(prefix))?.focus();
  }
  watch(() => [ctx.open.value, ctx.invocation.value, ctx.point.value], prepare, { flush: "post" });
  onMounted(() => { mounted.value = true; void prepare(); });
  onBeforeUnmount(() => { mounted.value = false; ++version; cancelFrames(); stopAnimations(); clearTimeout(prefixExpiry); });
  return { mounted, morphReady, position, opacity, clipPath, key };
}

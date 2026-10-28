import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, watch, type Ref } from "vue";
import { cancelFrame, frame } from "motion-v";
import type { TabsState } from "./context";
const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));
export function useTabsList(state: TabsState, reduced: Ref<boolean>, root: Ref<HTMLElement | null>, viewport: Ref<HTMLElement | null>, list: Ref<HTMLElement | null>) {
  const edges = ref({ overflow: false, left: false, right: false });
  const tracked = computed(() => state.icons.value === "selected" && state.variant.value !== "underline");
  let observer: ResizeObserver | undefined;
  let mounted = false;
  let ticks = 0;
  let still = 0;
  let previous: { left: number; right: number } | undefined;
  let bound: HTMLElement | null = null;
  function scrollPosition(view: HTMLElement) { const max = Math.max(0, view.scrollWidth - view.clientWidth); const offset = getComputedStyle(view).direction === "rtl" ? max + view.scrollLeft : view.scrollLeft; return { max, left: clamp(offset, max) }; }
  function measure() { if (!root.value || !viewport.value) return; const view = viewport.value; const { max, left } = scrollPosition(view); const next = { overflow: view.scrollWidth > root.value.clientWidth + 1, left: left > 1, right: left < max - 1 }; if (next.overflow !== edges.value.overflow || next.left !== edges.value.left || next.right !== edges.value.right) edges.value = next; }
  function reveal(tab: HTMLElement | null) { const view = viewport.value; if (!view || !tab) return; const bounds = view.getBoundingClientRect(); const item = tab.getBoundingClientRect(); const position = scrollPosition(view); const left = bounds.left + (position.left > 1 ? 36 : 0); const right = bounds.right - (position.left < position.max - 1 ? 36 : 0); const delta = item.left < left ? item.left - left : item.right > right ? item.right - right : 0; if (delta) view.scrollBy({ left: delta, behavior: reduced.value ? "instant" : "smooth" }); }
  function withSelectedIconLayout(measure: () => void) {
    const icons = state.icons.value === "selected" ? Array.from(list.value?.querySelectorAll<HTMLElement>("[role=tab] > [data-tabs-icon]") ?? []) : [];
    const restore = icons.map(icon => ({ icon, width: icon.style.width, margin: icon.style.marginRight }));
    for (const icon of icons) { const selected = icon.parentElement?.dataset.tabsValue === state.value.value; icon.style.width = selected ? "auto" : "0px"; icon.style.marginRight = selected ? "6px" : "0px"; }
    try { measure(); } finally { restore.forEach(({ icon, width, margin }) => { icon.style.width = width; icon.style.marginRight = margin; }); }
  }
  function place() { const element = list.value; if (!tracked.value || !element) return; const target = Array.from(element.querySelectorAll<HTMLElement>("[role=tab]")).find(tab => tab.dataset.tabsValue === state.value.value)?.parentElement; if (!target) return; withSelectedIconLayout(() => { const box = { x: target.offsetLeft, y: target.offsetTop, width: target.getBoundingClientRect().width, height: target.offsetHeight }; const instant = reduced.value || state.track.width.get() === 0; for (const key of ["x", "y", "width", "height"] as const) { if (instant) state.track[key].jump(box[key]); else state.track[key].set(box[key]); } if (box.width > 0) state.placed.value = true; }); }
  function synchronizeClips() {
    const element = list.value; if (!element || state.variant.value === "underline") { cancelFrame(synchronizeClips); return; }
    const labels = Array.from(element.querySelectorAll<HTMLElement>("[data-tabs-label]")); const indicator = element.querySelector<HTMLElement>("[data-tabs-indicator]"); const target = element.querySelector<HTMLElement>("[role=tab][aria-selected=true]");
    if (!indicator || !target || target.dataset.tabsValue !== state.value.value) { labels.forEach(label => label.style.clipPath = "inset(0 100% 0 0)"); cancelFrame(synchronizeClips); return; }
    const pill = (reduced.value ? target : indicator).getBoundingClientRect();
    for (const label of labels) { const bounds = label.getBoundingClientRect(); const left = clamp(pill.left - bounds.left, bounds.width); const right = clamp(bounds.right - pill.right, bounds.width); const clip = left + right >= bounds.width ? "inset(0 100% 0 0)" : `inset(0 ${right}px 0 ${left}px)`; if (label.style.clipPath !== clip) label.style.clipPath = clip; }
    const destination = target.getBoundingClientRect();
    const arrived = Math.abs(pill.left - destination.left) < .1 && Math.abs(pill.right - destination.right) < .1;
    ticks++; still = previous && Math.abs(pill.left - previous.left) < .01 && Math.abs(pill.right - previous.right) < .01 ? still + 1 : 0; previous = { left: pill.left, right: pill.right };
    // Shared-layout projection can start after several still frames. Keep the
    // contrast mask tracking until the indicator actually settles on its tab.
    if (reduced.value || ticks > 10 && still >= 3 && arrived || ticks > 180) cancelFrame(synchronizeClips);
  }
  function clips() { ticks = 0; still = 0; previous = undefined; cancelFrame(synchronizeClips); frame.postRender(synchronizeClips, true); }
  // Edge updates and resize observations must preserve the user's scroll position.
  function update() { if (!mounted) return; measure(); place(); clips(); }
  function revealSelected() { if (mounted) withSelectedIconLayout(() => reveal(list.value?.querySelector<HTMLElement>("[role=tab][aria-selected=true]") ?? null)); }
  function keyboard(event: KeyboardEvent) { if (event.defaultPrevented || !list.value || !(event.target instanceof HTMLElement)) return; const rows = Array.from(list.value.querySelectorAll<HTMLButtonElement>("[role=tab]")).filter(tab => !tab.disabled && tab.closest("[role=tablist]") === list.value); const at = rows.indexOf(event.target as HTMLButtonElement); if (at < 0 || !rows.length) return; const rtl = getComputedStyle(list.value).direction === "rtl"; let next: HTMLButtonElement | undefined; if (event.key === (rtl ? "ArrowLeft" : "ArrowRight")) next = rows[(at + 1) % rows.length]; else if (event.key === (rtl ? "ArrowRight" : "ArrowLeft")) next = rows[(at + rows.length - 1) % rows.length]; else if (event.key === "Home") next = rows[0]; else if (event.key === "End") next = rows.at(-1); if (next) { event.preventDefault(); next.focus(); next.click(); } }
  function scroll(direction: number) { const view = viewport.value; view?.scrollBy({ left: direction * view.clientWidth * .8, behavior: reduced.value ? "instant" : "smooth" }); }
  function focus(event: FocusEvent) { const target = event.target as HTMLElement; if (target.getAttribute("role") === "tab") reveal(target); }
  watch([state.value, state.icons, state.variant, reduced, state.placed], () => { void nextTick(update); }, { flush: "post" });
  watch(state.value, () => { void nextTick(revealSelected); }, { flush: "post" });
  onUpdated(update);
  onMounted(() => { mounted = true; if (typeof ResizeObserver !== "undefined") { observer = new ResizeObserver(update); for (const element of [root.value, viewport.value, list.value]) if (element) observer.observe(element); for (const tab of list.value?.querySelectorAll("[role=tab]") ?? []) if (tab.parentElement) observer.observe(tab.parentElement); } bound = viewport.value; bound?.addEventListener("scroll", measure, { passive: true }); update(); revealSelected(); });
  onBeforeUnmount(() => { mounted = false; observer?.disconnect(); bound?.removeEventListener("scroll", measure); cancelFrame(synchronizeClips); });
  return { edges, tracked, keyboard, scroll, focus };
}

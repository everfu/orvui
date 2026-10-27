import { computed, onBeforeUnmount, onMounted, ref, type Ref } from "vue";
export interface RailEntry { id: string; label: string; description?: string; href?: string; ariaLabel?: string; target?: "_blank" | "_self" | "_parent" | "_top"; rel?: string }
export function useRailState(root: Ref<HTMLElement | null>, props: { items: RailEntry[]; highlightActive: boolean }, active: Ref<string>, emit: { (event: "activeChange", value: string): void; (event: "itemSelect", value: RailEntry): void }) {
  const hovered = ref<string | null>(null);
  const pinned = ref<string | null>(null);
  const focused = ref<string | null>(null);
  const selected = computed(() => props.items.some(item => item.id === active.value) ? active.value : props.items[0]?.id ?? "");
  const preview = computed(() => hovered.value ?? pinned.value ?? focused.value ?? "");
  const highlighted = computed(() => preview.value || (props.highlightActive ? selected.value : ""));
  const index = computed(() => props.items.findIndex(item => item.id === highlighted.value));
  let pointer: { id: number; kind: string; x: number; y: number; pinned: boolean } | undefined;
  function down(event: PointerEvent, item: RailEntry) { pointer = { id: event.pointerId, kind: event.pointerType, x: event.clientX, y: event.clientY, pinned: pinned.value === item.id }; focused.value = null; }
  function move(event: PointerEvent) { if (pointer && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 10) pointer = undefined; }
  function cancel() { pointer = undefined; }
  function focus(event: FocusEvent, item: RailEntry) { if ((event.currentTarget as HTMLElement).matches(":focus-visible")) focused.value = item.id; }
  function select(event: MouseEvent, item: RailEntry) { const gesture = pointer; cancel(); if (gesture && gesture.kind !== "mouse") { pinned.value = item.id; if (item.href && !gesture.pinned) { event.preventDefault(); return; } } active.value = item.id; emit("activeChange", item.id); emit("itemSelect", item); }
  function enter(event: PointerEvent, item: RailEntry) { if (event.pointerType !== "touch") hovered.value = item.id; }
  function leave(event: PointerEvent) { if (event.pointerType !== "touch") hovered.value = null; }
  function outside(event: PointerEvent) { if (!root.value?.contains(event.target as Node)) pinned.value = null; }
  function blur(event: FocusEvent) { if (!root.value?.contains(event.relatedTarget as Node)) { focused.value = null; pinned.value = null; } }
  function scale(at: number) { const distance = index.value < 0 ? Infinity : Math.abs(at - index.value); return [1, .68, .44][distance] ?? .25; }
  let owner: Document | undefined;
  onMounted(() => { owner = root.value?.ownerDocument ?? document; owner.addEventListener("pointerdown", outside); });
  onBeforeUnmount(() => { owner?.removeEventListener("pointerdown", outside); cancel(); });
  return { selected, preview, highlighted, down, move, cancel, focus, select, enter, leave, blur, scale };
}

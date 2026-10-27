import { onBeforeUnmount } from "vue";
import type { MenuPoint, MenuState } from "./menu-state";
export function useMenuGesture(ctx: MenuState, disabled: () => boolean | undefined) {
  let pending: ReturnType<typeof setTimeout> | undefined;
  let origin: MenuPoint | undefined;
  let restore: (() => void) | undefined;
  const cancel = () => { clearTimeout(pending); pending = undefined; origin = undefined; };
  const end = () => { cancel(); restore?.(); restore = undefined; };
  onBeforeUnmount(end);
  function pointerdown(event: PointerEvent) {
    if (event.defaultPrevented || disabled() || !["touch", "pen"].includes(event.pointerType)) return;
    end();
    const surface = event.currentTarget as HTMLElement;
    const selection = [surface.style.userSelect, surface.style.webkitUserSelect];
    surface.style.userSelect = surface.style.webkitUserSelect = "none";
    restore = () => { [surface.style.userSelect, surface.style.webkitUserSelect] = selection; };
    const point = origin = { x: event.clientX, y: event.clientY };
    pending = setTimeout(() => { pending = undefined; origin = undefined; ctx.openAt(point, "touch"); }, 520);
  }
  return {
    onPointerdown: pointerdown,
    onPointermove(event: PointerEvent) { if (origin && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 10) cancel(); },
    onPointerup: end, onPointercancel: end,
    onContextmenu(event: MouseEvent) {
      if (event.defaultPrevented || disabled()) return;
      event.preventDefault(); end(); ctx.openAt({ x: event.clientX, y: event.clientY }, "pointer");
    },
    onKeydown(event: KeyboardEvent) {
      if (event.defaultPrevented || disabled() || !(event.key === "ContextMenu" || event.shiftKey && event.key === "F10")) return;
      event.preventDefault();
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      ctx.openAt({ x: rect.left + Math.min(24, rect.width / 2), y: rect.top + rect.height / 2 }, "keyboard");
    },
  };
}

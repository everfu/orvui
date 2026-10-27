import { inject, nextTick, onBeforeUnmount, onMounted, watch, type InjectionKey, type Ref, type VNodeChild } from "vue";
import { useOverlay } from "../../../lib/composables";
import type { LightboxImage } from "./types";
export interface ImageViewerContext { images: Ref<LightboxImage[]>; value: Ref<string | null>; index: Ref<number>; image: Ref<LightboxImage | undefined>; id: string; direction: Ref<number>; label: Ref<string>; reduce: Ref<boolean>; renderCaption?: (image: LightboxImage) => VNodeChild; select: (value: string | null) => void; move: (direction: number) => void }
export const viewerKey: InjectionKey<ImageViewerContext> = Symbol("ImageViewer");
export function useViewer() { const viewer = inject(viewerKey); if (!viewer) throw Error("ImageViewer parts must be used within ImageViewer."); return viewer; }
const inertLeases = new WeakMap<HTMLElement, { owners: number; initial: boolean }>();
function acquireInert(element: HTMLElement) { let lease = inertLeases.get(element); if (!lease) { lease = { owners: 0, initial: element.inert }; inertLeases.set(element, lease); } lease.owners++; element.inert = true; return () => { if (--lease!.owners === 0) { element.inert = lease!.initial; inertLeases.delete(element); } }; }
export function useViewerModal(open: Ref<boolean>, root: Ref<HTMLElement | null>, panel: Ref<HTMLElement | null>, close: () => void) {
  const overlay = useOverlay(open, panel, close);
  let mounted = false;
  let revision = 0;
  let release: (() => void) | undefined;
  function focusFirst() { const surface = panel.value; const choices = surface?.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])'); const first = Array.from(choices ?? []).find(element => element.tabIndex >= 0 && !element.closest("[inert]")); (first ?? surface)?.focus({ preventScroll: true }); }
  async function synchronize() {
    const version = ++revision; release?.(); release = undefined;
    if (!mounted || !open.value) return; await nextTick();
    const portal = root.value; if (!mounted || version !== revision || !open.value || !portal || !panel.value) return;
    const owner = portal.ownerDocument;
    const portalInert = portal.inert; portal.inert = false;
    const siblings = Array.from(owner.body.children).filter((node): node is HTMLElement => node instanceof HTMLElement && node !== portal && !overlay.containsOwnedPortal(node));
    const removers = siblings.map(acquireInert);
    let redirecting = false;
    function focus(event: FocusEvent) {
      const boundary = panel.value;
      const portal = root.value;
      if (redirecting || !boundary || !portal || portal.inert) return;
      // The composed event route includes the dialog even when a focused
      // control lives behind a shadow root and the event target is retargeted.
      const route = event.composedPath();
      if (route.includes(boundary) || overlay.containsHigher(event.target)) return;
      if (!(event.target instanceof Node) || !overlay.isTop()) return;
      redirecting = true;
      try { focusFirst(); }
      finally { redirecting = false; }
    }
    owner.addEventListener("focusin", focus);
    release = () => { owner.removeEventListener("focusin", focus); portal.inert = inertLeases.has(portal) ? true : portalInert; removers.forEach(remove => remove()); };
  }
  watch(open, synchronize, { flush: "sync" });
  onMounted(() => { mounted = true; void synchronize(); });
  onBeforeUnmount(() => { mounted = false; ++revision; release?.(); release = undefined; });
}

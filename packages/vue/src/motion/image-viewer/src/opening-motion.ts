import type { ImageViewerContext } from "./context";

export const VIEWER_OPEN_MOTION = { type: "tween", duration: .46, ease: [.22, 1, .36, 1] } as const;

const sources = new WeakMap<ImageViewerContext, HTMLElement>();

export function rememberViewerSource(viewer: ImageViewerContext, element: HTMLElement) {
  sources.set(viewer, element);
}

export function viewerSource(viewer: ImageViewerContext) {
  return sources.get(viewer);
}

export function forgetViewerSource(viewer: ImageViewerContext, element: HTMLElement) {
  if (sources.get(viewer) === element) sources.delete(viewer);
}

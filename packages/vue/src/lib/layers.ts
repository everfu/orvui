// Only ancestry is required; Vue 3.6 parents can also be generic component instances.
type ComponentOwner = { readonly parent: ComponentOwner | null };

type Surface = () => HTMLElement | null;
export interface Layer {
  key: symbol;
  modal: boolean;
  owner: ComponentOwner | null;
  surface: Surface;
  returnTo: HTMLElement | null;
}
const active: Layer[] = [];
const portals = new Set<{ owner: ComponentOwner | null; surface: Surface }>();

function belongsTo(child: ComponentOwner | null, parent: ComponentOwner | null) {
  if (!parent) return false;
  for (let node = child; node; node = node.parent) if (node === parent) return true;
  return false;
}
function later(layer: Layer) {
  const index = active.indexOf(layer);
  return index < 0 ? [] : active.slice(index + 1);
}
export const layerManager = {
  attach(layer: Layer) {
    if (active.includes(layer)) return false;
    layer.returnTo = document.activeElement as HTMLElement | null;
    const before = active.findIndex(entry => entry.owner !== layer.owner && belongsTo(entry.owner, layer.owner));
    active.splice(before < 0 ? active.length : before, 0, layer);
    return true;
  },
  detach(layer: Layer, restore: boolean) {
    const index = active.indexOf(layer);
    if (index < 0) return;
    const wasLast = index === active.length - 1;
    const surface = layer.surface();
    for (const successor of later(layer)) {
      if (successor.returnTo && surface?.contains(successor.returnTo)) successor.returnTo = layer.returnTo;
    }
    active.splice(index, 1);
    if (restore && wasLast && layer.returnTo?.isConnected) layer.returnTo.focus({ preventScroll: true });
  },
  top(layer: Layer) { return active.at(-1) === layer; },
  modal(layer: Layer) { return active.slice().reverse().find(entry => entry.modal) === layer; },
  higher(layer: Layer, target: EventTarget | null) {
    return !!target && typeof (target as Node).nodeType === "number" && later(layer).some(entry => entry.surface()?.contains(target as Node));
  },
  scopes(layer: Layer) {
    const result = [layer.surface()];
    for (const entry of later(layer)) if (!entry.modal && belongsTo(entry.owner, layer.owner)) result.push(entry.surface());
    return result.filter((surface): surface is HTMLElement => surface !== null);
  },
  portal(owner: ComponentOwner | null, surface: Surface) {
    const portal = { owner, surface };
    portals.add(portal);
    return () => portals.delete(portal);
  },
  containsPortal(owner: ComponentOwner | null, target: HTMLElement) {
    for (const portal of portals) {
      const node = portal.surface();
      if (node && belongsTo(portal.owner, owner) && target.contains(node)) return true;
    }
    return false;
  },
};

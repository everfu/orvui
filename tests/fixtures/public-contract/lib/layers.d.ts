import type { ComponentInternalInstance } from "vue";
type Surface = () => HTMLElement | null;
export interface Layer {
    key: symbol;
    modal: boolean;
    owner: ComponentInternalInstance | null;
    surface: Surface;
    returnTo: HTMLElement | null;
}
export declare const layerManager: {
    attach(layer: Layer): boolean;
    detach(layer: Layer, restore: boolean): void;
    top(layer: Layer): boolean;
    modal(layer: Layer): boolean;
    higher(layer: Layer, target: EventTarget | null): boolean;
    scopes(layer: Layer): HTMLElement[];
    portal(owner: ComponentInternalInstance | null, surface: Surface): () => boolean;
    containsPortal(owner: ComponentInternalInstance | null, target: HTMLElement): boolean;
};
export {};

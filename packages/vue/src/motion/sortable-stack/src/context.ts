import { inject, type ComputedRef, type Ref } from "vue";
import type { useDragControls } from "motion-v";
export type MoveDirection = -1 | 1 | "first" | "last";
export interface SortableContext { items: Ref<any[]>; ids: ComputedRef<string[]>; canUndo: ComputedRef<boolean>; props: { disabled?: boolean; label: string; itemClassName?: string; getItemLabel?: (item: any) => string }; id: string; reorder: (ids: string[]) => void; move: (id: string, direction: MoveDirection) => void; undo: () => void; begin: () => void; finish: (id: string) => void }
export interface SortableItemContext { id: string; controls: ReturnType<typeof useDragControls>; dragging: Ref<boolean> }
export function sortableContext(component: string) { const context = inject<SortableContext>("orvui-sortable"); if (!context) throw new Error(`${component} must be inside SortableList`); return context; }

export type SidebarResourceKind = "folder" | "project" | "file" | "bookmark";
export interface SidebarResource {
    id: string;
    label: string;
    kind: SidebarResourceKind;
    children?: SidebarResource[];
    disabled?: boolean;
}
export type SidebarResourceDropPosition = "before" | "inside" | "after";
export interface SidebarResourceMove {
    itemId: string;
    targetId: string | null;
    position: SidebarResourceDropPosition;
}
export interface SidebarResourceMoveCommands {
    up?: () => void;
    down?: () => void;
    into?: {
        label: string;
        run: () => void;
    };
    out?: () => void;
}
export interface SidebarResourceMenuControls {
    close: () => void;
    rename: () => void;
    moves: SidebarResourceMoveCommands;
}
export interface FlatResource {
    item: SidebarResource;
    depth: number;
    parentId: string | null;
}
export declare function canContain(item: SidebarResource): boolean;
export declare function flattenResources(items: SidebarResource[], expanded: Set<string>, depth?: number, parentId?: string | null): FlatResource[];
export declare function findResource(items: SidebarResource[], id: string): SidebarResource | undefined;
export declare function containsResource(item: SidebarResource, id: string): boolean;
export declare function removeResource(items: SidebarResource[], id: string): {
    items: SidebarResource[];
    removed?: SidebarResource;
};
export declare function insertResource(items: SidebarResource[], resource: SidebarResource, targetId: string | null, position: SidebarResourceDropPosition): SidebarResource[];
export declare function moveResource(items: SidebarResource[], move: SidebarResourceMove): SidebarResource[] | null;
export declare function renameResource(items: SidebarResource[], id: string, label: string): SidebarResource[];

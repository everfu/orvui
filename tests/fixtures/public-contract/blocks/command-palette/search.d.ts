export type SearchableCommand = {
    label: string;
    group?: string;
    keywords?: string[];
};
export declare function searchCommands<T extends SearchableCommand>(items: T[], query: string): T[];

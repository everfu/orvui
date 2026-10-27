import { type InjectionKey } from "vue";
export declare const TabsContext: InjectionKey<any>;
export declare const TABS_TRANSITION: {
    type: "spring";
    stiffness: number;
    damping: number;
    mass: number;
};
export declare function useTabs(): any;

interface TickPlayer {
    prepare: () => void;
    play: () => void;
    dispose: () => void;
}
export declare function createTickPlayer(): TickPlayer;
export {};

export interface OrbFrame {
    activity: number;
    colors: readonly [
        string,
        string,
        string
    ];
    speed: number;
    animated: boolean;
}
export declare function createOrbRenderer(canvas: HTMLCanvasElement, read: () => OrbFrame, onError: (error: Error) => void): {
    requestDraw: () => void;
    dispose(): void;
};

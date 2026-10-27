export declare function imagePanBounds(imageWidth: number, imageHeight: number, boundsWidth: number, boundsHeight: number): {
    x: number;
    y: number;
};
export declare function clampImagePan(value: number, bound: number): number;
export declare function imageSwipe(start: {
    x: number;
    y: number;
}, end: {
    x: number;
    y: number;
}): 1 | -1 | null;

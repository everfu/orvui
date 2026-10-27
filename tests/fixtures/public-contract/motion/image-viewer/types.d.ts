export interface LightboxImage {
    id: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
}
export type ImageViewerImage = LightboxImage;

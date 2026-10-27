export interface VolumeProfileBin {
    id: string;
    priceLow: number;
    priceHigh: number;
    volume: number;
}
export declare function buildVolumeProfile(data: readonly VolumeProfileBin[], target: number | false): {
    rows: {
        price: number;
        top: number;
        height: number;
        center: number;
        proportion: number;
        share: number;
        isPoc: boolean;
        inValueArea: boolean;
        id: string;
        priceLow: number;
        priceHigh: number;
        volume: number;
    }[];
    poc: {
        price: number;
        top: number;
        height: number;
        center: number;
        proportion: number;
        share: number;
        isPoc: boolean;
        inValueArea: boolean;
        id: string;
        priceLow: number;
        priceHigh: number;
        volume: number;
    };
    valueArea: {
        priceLow: number;
        priceHigh: number;
        volume: number;
        share: number;
        target: number;
    } | null;
    totalVolume: number;
    maxVolume: number;
    priceLow: number;
    priceHigh: number;
};
export type VolumeProfileRow = ReturnType<typeof buildVolumeProfile>["rows"][number];

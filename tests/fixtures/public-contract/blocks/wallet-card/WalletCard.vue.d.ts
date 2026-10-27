import { type Content } from "../shared";
export interface WalletAccount {
    id: string;
    name: string;
    address: string;
    avatar?: Content;
}
type __VLS_Props = {
    accounts: WalletAccount[];
    accountId?: string;
    defaultAccountId?: string;
    balance: number;
    balancePrefix?: string;
    defaultChange?: number;
    defaultBalanceHidden?: boolean;
    searchPlaceholder?: string;
    searchRecent?: string[];
    hasNotifications?: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    send: () => any;
    swap: () => any;
    buy: () => any;
    "update:accountId": (id: string) => any;
    accountChange: (id: string) => any;
    deposit: () => any;
    searchChange: (value: string) => any;
    searchSubmit: (value: string) => any;
    notifications: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSend?: (() => any) | undefined;
    onSwap?: (() => any) | undefined;
    onBuy?: (() => any) | undefined;
    "onUpdate:accountId"?: ((id: string) => any) | undefined;
    onAccountChange?: ((id: string) => any) | undefined;
    onDeposit?: (() => any) | undefined;
    onSearchChange?: ((value: string) => any) | undefined;
    onSearchSubmit?: ((value: string) => any) | undefined;
    onNotifications?: (() => any) | undefined;
}>, {
    balancePrefix: string;
    defaultBalanceHidden: boolean;
    searchRecent: string[];
    hasNotifications: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;

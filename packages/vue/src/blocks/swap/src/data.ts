import type { Chain, Token } from "./types";
const networks = [
  ["eth", "Ethereum", "bg-primary text-primary-foreground", "Ξ"],
  ["sol", "Solana", "bg-secondary text-secondary-foreground", "◎"],
  ["base", "Base", "bg-accent text-accent-foreground", "B"],
  ["arb", "Arbitrum", "bg-muted text-muted-foreground", "A"],
  ["op", "Optimism", "bg-destructive text-primary-foreground", "O"],
  ["poly", "Polygon", "bg-primary/80 text-primary-foreground", "P"],
  ["bnb", "BNB", "bg-secondary text-secondary-foreground", "B"],
  ["avax", "Avalanche", "bg-destructive/80 text-primary-foreground", "A"],
];
export const CHAINS: Chain[] = networks.map(([id, name, tone, symbol]) => ({
  id,
  name,
  tone,
  symbol,
}));
type TokenSeed = [string, string, string, string, number, number?, string?];
const seeds: TokenSeed[] = [
  ["eth-eth", "ETH", "Ether", "eth", 1.245, 3142],
  ["eth-weth", "WETH", "Wrapped Ether", "eth", 0.5, 3142],
  ["eth-usdc", "USDC", "USD Coin", "eth", 4521, 1],
  ["eth-usdt", "USDT", "Tether", "eth", 2100, 1],
  ["eth-dai", "DAI", "Dai Stablecoin", "eth", 800, 1],
  ["eth-wbtc", "WBTC", "Wrapped Bitcoin", "eth", 0.04, 96000],
  ["eth-link", "LINK", "ChainLink Token", "eth", 120, 22, "0x51...86ca"],
  ["eth-aztec", "AZTEC", "AZTEC", "eth", 0, undefined, "0xa2...62d2"],
  ["eth-cfg", "CFG", "Centrifuge", "eth", 0, undefined, "0xcc...8a94"],
  ["eth-ondo", "ONDO", "Ondo", "eth", 0, undefined, "0xfa...9be3"],
  ["sol-sol", "SOL", "Solana", "sol", 12.4, 168],
  ["sol-usdc", "USDC", "USD Coin", "sol", 985.32, 1],
  ["base-eth", "ETH", "Ether", "base", 0.65, 3142],
  ["base-usdc", "USDC", "USD Coin", "base", 1200, 1],
  ["arb-arb", "ARB", "Arbitrum", "arb", 800, 0.95],
  ["arb-eth", "ETH", "Ether", "arb", 0.32, 3142],
  ["op-op", "OP", "Optimism", "op", 450, 2.8],
  ["poly-matic", "MATIC", "Polygon", "poly", 1500, 0.75],
  ["bnb-bnb", "BNB", "BNB", "bnb", 0, 620],
  ["avax-avax", "AVAX", "Avalanche", "avax", 0, 38],
];
export const TOKENS: Token[] = seeds.map(
  ([id, symbol, name, chainId, balance, usd, address], index) => ({
    id,
    symbol,
    name,
    chainId,
    balance,
    ...(usd === undefined ? {} : { usd }),
    ...(address ? { address, trending: true } : {}),
    ...(index < 6 ? { popular: true } : {}),
  }),
);

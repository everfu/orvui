export function diceBearGlassUrl(seed: string) {
  return (
    "https://api.dicebear.com/9.x/glass/svg?seed=" + encodeURIComponent(seed)
  );
}
export function truncateAddress(address: string) {
  if (address.length <= 12) return address;
  return [address.substring(0, 6), address.substring(address.length - 4)].join(
    "…",
  );
}

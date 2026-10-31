import { onBeforeUnmount, onMounted, ref } from "vue";

export const githubRepository = "https://github.com/everfu/orvui";
export function formatGithubStars(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
}

/** Optional decoration: never block SSR, navigation, or an offline build. */
export function useGithubStars() {
  const stars = ref<number | null>(null);
  let controller: AbortController | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  onMounted(async () => {
    controller = new AbortController();
    timeout = setTimeout(() => controller?.abort(), 3000);
    try {
      const response = await fetch(
        "https://api.github.com/repos/everfu/orvui",
        {
          signal: controller.signal,
          credentials: "omit",
          headers: { Accept: "application/vnd.github+json" },
        },
      );
      if (!response.ok) return;
      const data: unknown = await response.json();
      const count =
        data && typeof data === "object" && "stargazers_count" in data
          ? data.stargazers_count
          : undefined;
      if (
        !disposed &&
        !controller.signal.aborted &&
        typeof count === "number" &&
        Number.isSafeInteger(count) &&
        count >= 0
      )
        stars.value = count;
    } catch {
      // GitHub remains a working link when public statistics are unavailable.
    } finally {
      clearTimeout(timeout);
    }
  });
  onBeforeUnmount(() => {
    disposed = true;
    controller?.abort();
    clearTimeout(timeout);
  });
  return stars;
}

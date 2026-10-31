import { onBeforeUnmount, onMounted, ref, watch } from "vue";
export interface NewBadgeEntry {
  badge?: string;
  launchedAt?: string;
}
export const NEW_BADGE_DURATION_MS = 7 * 86_400_000;
export const NEW_BADGE_SNAPSHOT = Date.parse("2026-10-25T00:00:00Z");
const expiration = (date?: string) =>
  date ? Date.parse(`${date}T00:00:00Z`) + NEW_BADGE_DURATION_MS : NaN;
export function getNewBadgeRemainingMs(launchedAt?: string, now = Date.now()) {
  const end = expiration(launchedAt);
  return Number.isFinite(end) ? Math.max(0, end - now) : 0;
}
export function isComponentNew(entry: NewBadgeEntry, now = Date.now()) {
  return (
    entry.badge === "new" && getNewBadgeRemainingMs(entry.launchedAt, now) > 0
  );
}
type Subscription = {
  entries: () => readonly NewBadgeEntry[];
  publish: (timestamp: number) => void;
};
/** A mounted-only deadline agenda owns one browser wakeup for every badge. */
class BadgeAgenda {
  private members = new Map<symbol, Subscription>();
  private wakeup: ReturnType<typeof setTimeout> | undefined;
  private visible = () => {
    if (document.visibilityState !== "hidden") this.refresh();
  };
  constructor() {
    window.addEventListener("focus", this.refresh);
    document.addEventListener("visibilitychange", this.visible);
  }
  get size() {
    return this.members.size;
  }
  join(subscription: Subscription) {
    const key = Symbol("badge-clock-reader");
    this.members.set(key, subscription);
    this.refresh();
    return key;
  }
  leave(key: symbol) {
    this.members.delete(key);
    this.refresh();
  }
  refresh = () => {
    clearTimeout(this.wakeup);
    this.wakeup = undefined;
    const timestamp = Date.now();
    const deadlines: number[] = [];
    for (const member of [...this.members.values()]) {
      member.publish(timestamp);
      deadlines.push(
        ...member
          .entries()
          .filter((entry) => entry.badge === "new")
          .map((entry) => expiration(entry.launchedAt))
          .filter((end) => end > timestamp && Number.isFinite(end)),
      );
    }
    const next = deadlines.sort((left, right) => left - right)[0];
    if (next !== undefined)
      this.wakeup = setTimeout(
        this.refresh,
        Math.min(2_147_483_647, next - timestamp),
      );
  };
  destroy() {
    clearTimeout(this.wakeup);
    this.wakeup = undefined;
    this.members.clear();
    window.removeEventListener("focus", this.refresh);
    document.removeEventListener("visibilitychange", this.visible);
  }
}
let agenda: BadgeAgenda | undefined;
export function useNewBadgeClock(entries: () => readonly NewBadgeEntry[]) {
  const now = ref(NEW_BADGE_SNAPSHOT),
    mounted = ref(false);
  let subscription: symbol | undefined;
  let lastProfile: string | undefined;
  const publish = (timestamp: number) => {
    // Publish only a changed expiry profile: a child mount must not recreate its
    // parent's function-rendered badge and start another clock refresh cycle.
    const profile = entries()
      .map((entry) => (isComponentNew(entry, timestamp) ? "1" : "0"))
      .join("");
    if (profile !== lastProfile) {
      lastProfile = profile;
      now.value = timestamp;
    }
  };
  onMounted(() => {
    mounted.value = true;
    agenda ??= new BadgeAgenda();
    subscription = agenda.join({ entries, publish });
  });
  watch(
    () => entries().map((entry) => [entry.badge, entry.launchedAt]),
    () => {
      if (mounted.value) agenda?.refresh();
    },
    { flush: "sync" },
  );
  onBeforeUnmount(() => {
    mounted.value = false;
    if (subscription === undefined || !agenda) return;
    agenda.leave(subscription);
    subscription = undefined;
    if (!agenda.size) {
      agenda.destroy();
      agenda = undefined;
    }
  });
  return {
    now,
    mounted,
    isNew: (entry: NewBadgeEntry) => isComponentNew(entry, now.value),
  };
}

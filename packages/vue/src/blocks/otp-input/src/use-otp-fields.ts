import { computed, ref, watch } from "vue";

type Options = {
  length: () => number;
  value: () => string | undefined;
  initial: string;
  masked: () => boolean;
  changed: (value: string) => void;
  completed: (value: string) => void;
};

export function useOtpFields(options: Options) {
  const count = computed(() =>
    Number.isFinite(options.length())
      ? Math.max(1, Math.floor(options.length()))
      : 1,
  );
  const digits = (value: string) =>
    value.replace(/\D/g, "").slice(0, count.value);
  const spread = (value: string) => {
    const clean = digits(value);
    return Array.from(
      { length: count.value },
      (_, index) => clean[index] ?? "",
    );
  };
  const fields = ref(spread(options.value() ?? options.initial));
  const cursor = ref(0);
  const announcement = ref("");
  function announce(value: string) {
    announcement.value =
      value === announcement.value ? value + "\u00a0" : value;
  }
  function publish(next: string[]) {
    const previous = fields.value;
    const changes = next
      .map((value, index) => (value !== previous[index] ? index : -1))
      .filter((index) => index >= 0);
    const progress = `${next.filter(Boolean).length} of ${count.value} digits entered.`;
    if (changes.length === 1) {
      const replacement = next[changes[0]];
      announce(
        replacement
          ? `${options.masked() ? "Digit" : replacement}. ${progress}`
          : `Deleted. ${progress}`,
      );
    } else if (changes.length) announce(progress);
    fields.value = next;
    const value = next.join("");
    options.changed(value);
    if (!previous.every(Boolean) && next.every(Boolean))
      options.completed(value);
  }
  function insert(value: string) {
    const addition = value.replace(/\D/g, "");
    if (!addition) return;
    const next = fields.value.slice();
    const end = Math.min(count.value, cursor.value + addition.length);
    for (let index = cursor.value; index < end; index++)
      next[index] = addition[index - cursor.value];
    publish(next);
    cursor.value = Math.min(count.value - 1, end);
  }
  function erase(backwards: boolean) {
    const index =
      backwards && !fields.value[cursor.value]
        ? cursor.value - 1
        : cursor.value;
    if (index < 0) return;
    const next = fields.value.slice();
    next[index] = "";
    publish(next);
    cursor.value = index;
  }
  function navigate(key: string) {
    const positions: Record<string, number> = {
      ArrowLeft: cursor.value - 1,
      ArrowRight: cursor.value + 1,
      Home: 0,
      End: count.value - 1,
    };
    if (!(key in positions)) return false;
    cursor.value = Math.max(0, Math.min(count.value - 1, positions[key]));
    const value = fields.value[cursor.value];
    announce(
      `${value ? (options.masked() ? "Filled" : value) : "Empty"}, digit ${cursor.value + 1} of ${count.value}.`,
    );
    return true;
  }
  function replace(value: string) {
    const clean = digits(value);
    if (!clean) return;
    publish(spread(clean));
    cursor.value = Math.min(clean.length, count.value - 1);
  }
  watch([options.value, count], ([value]) => {
    if (value !== undefined && digits(value) !== fields.value.join(""))
      fields.value = spread(value);
    else if (fields.value.length !== count.value)
      fields.value = Array.from(
        { length: count.value },
        (_, index) => fields.value[index] ?? "",
      );
    cursor.value = Math.min(cursor.value, count.value - 1);
  });
  return {
    count,
    fields,
    cursor,
    announcement,
    insert,
    erase,
    navigate,
    replace,
  };
}

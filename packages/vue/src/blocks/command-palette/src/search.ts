export type SearchableCommand = {
  label: string;
  group?: string;
  keywords?: string[];
};

type Field = { text: string; words: string[]; label: boolean };
const fold = (text: string) =>
  text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

function match(word: string, field: Field) {
  if (field.words.includes(word)) return 100;
  if (field.words.some((part) => part.startsWith(word))) return 80;
  if (field.text.includes(word)) return 60;
  if (word.length < 3) return 0;
  const abbreviation = field.words.some((candidate) => {
    if (candidate.length - word.length > 2) return false;
    let at = 0;
    for (const char of candidate) if (char === word[at]) at++;
    return at === word.length;
  });
  return abbreviation ? 20 : 0;
}

export function searchCommands<T extends SearchableCommand>(
  items: T[],
  query: string,
): T[] {
  const text = fold(query);
  if (!text) return items;
  const tokens = text.split(/\s+/);
  const ranked: { item: T; score: number; order: number }[] = [];
  items.forEach((item, order) => {
    const names = [item.label, item.group ?? "", ...(item.keywords ?? [])].map(
      fold,
    );
    const fields = names.map((value, index): Field => ({
      text: value,
      words: value.split(" "),
      label: index === 0,
    }));
    let score =
      names[0] === text
        ? 10000
        : names.slice(2).includes(text)
          ? 5000
          : names[0].startsWith(text)
            ? 2000
            : 0;
    for (const token of tokens) {
      let best = 0;
      for (const field of fields) {
        const relevance = match(token, field);
        if (relevance)
          best = Math.max(best, relevance + (field.label ? 40 : 0));
      }
      if (!best) return;
      score += best;
    }
    ranked.push({ item, score, order });
  });
  ranked.sort((a, b) => b.score - a.score || a.order - b.order);
  return ranked.map(({ item }) => item);
}

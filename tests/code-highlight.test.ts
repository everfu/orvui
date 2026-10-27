import { expect, it } from "vitest";
import {
  getHighlighter,
  highlightCode,
} from "../apps/docs/.vitepress/theme/highlight";

it("loads both GitHub high-contrast palettes and the Vue/source grammars once", async () => {
  const first = getHighlighter(),
    next = getHighlighter();
  expect(next).toBe(first);
  const highlighter = await first;
  expect(highlighter.getLoadedThemes()).toContain("github-light-high-contrast");
  expect(highlighter.getLoadedThemes()).toContain("github-dark-high-contrast");
  expect(highlighter.getLoadedLanguages()).toEqual(
    expect.arrayContaining([
      "vue",
      "tsx",
      "typescript",
      "javascript",
      "jsx",
      "css",
      "bash",
      "json",
    ]),
  );
  const html = highlightCode(
    highlighter,
    "<template><button>Hello</button></template>",
    "vue",
  );
  expect(html).toContain("--shiki-light:");
  expect(html).toContain("--shiki-dark:");
  expect(html).toContain('class="k');
  const container = document.createElement("div");
  container.innerHTML = html;
  expect(container.querySelector("pre")?.textContent).toBe(
    "<template><button>Hello</button></template>",
  );
  expect(html).not.toContain("<button>Hello</button>");
});
it("preserves source notation highlight, diff and focus classes", async () => {
  const highlighter = await getHighlighter();
  const html = highlightCode(
    highlighter,
    [
      "const added = 1 // [!code ++]",
      "const removed = 2 // [!code --]",
      "const highlighted = 3 // [!code highlight]",
      "const focused = 4 // [!code focus]",
    ].join("\n"),
    "typescript",
  );
  expect(html).toContain('class="line diff add"');
  expect(html).toContain('class="line diff remove"');
  expect(html).toContain('class="line highlighted"');
  expect(html).toContain('class="line focused"');
  expect(html).not.toContain("[!code");
});

import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import SitePage from "../apps/docs/app/components/docs/SitePage.vue";
import {
  getSitePage,
  sitePages,
  sitePageToc,
} from "../apps/docs/app/utils/docs/site-page-data";
import { sitePageMarkdown } from "../apps/docs/app/utils/docs/site-page-markdown";

describe("Web installation instructions", () => {
  for (const en of [false, true]) {
    it(`renders and exports the same ${en ? "English" : "Chinese"} installation steps`, () => {
      const page = getSitePage("installation");
      const wrapper = mount(SitePage, {
        props: {
          page: "installation",
          en,
          siteUrl: "http://localhost:6111/docs",
        },
        global: {
          stubs: {
            CodePanel: { props: ["code"], template: "<pre>{{code}}</pre>" },
            CopyPage: true,
          },
        },
      });
      try {
        expect(wrapper.get("h1").text()).toBe(page.title[en ? "en" : "zh"]);
        const ids = wrapper.findAll("h2").map((node) => node.attributes("id"));
        expect(ids).toEqual([
          "choose-path",
          "requirements",
          "package",
          "source-setup",
          "shadcn-vue",
          "verify",
        ]);
        expect(ids).toEqual(sitePageToc("installation").map((item) => item.id));
        const markdown = sitePageMarkdown(
          "installation",
          en,
          "http://localhost:6111",
        );
        for (const id of ids) expect(markdown).toContain(`<a id="${id}"></a>`);
        for (const panel of wrapper.findAll("pre"))
          expect(markdown).toContain(panel.text());
        expect(markdown).not.toContain("{{origin}}");
        expect(markdown).not.toContain("Pinned upstream revision");
        expect(markdown).not.toMatch(
          /manual-source|manual source|manual copying|手动/i,
        );
        expect(markdown).toContain("orvui-vue-0.1.0.tgz");
        expect(markdown).toContain("@orvui/vue/style.css");
        expect(markdown).toContain("import './style.css'");
        expect(markdown).toContain(
          "shadcn-vue@2.8.2 add http://localhost:6111/r/button.json",
        );
        expect(markdown).toContain("tailwindcss@^4");
        expect(markdown).toContain("src/components/orvui/");
        expect(markdown).toContain("pnpm exec vue-tsc --noEmit");
        expect(
          wrapper.find(`a[href="${en ? "/en" : ""}/docs/theme"]`).exists(),
        ).toBe(true);
        expect(markdown).not.toMatch(/vue-lynx|@orvui\/lynx|\/lynx\//);
      } finally {
        wrapper.unmount();
      }
    });
  }
});

it("keeps previous getting-started anchors while moving complete setup into a separate installation guide", () => {
  expect(getSitePage("introduction").path).toBe("/guide");
  expect(sitePageToc("introduction").map((item) => item.id)).toEqual([
    "installation",
    "import-components",
    "copy-source",
    "state",
    "nuxt",
    "attribution",
  ]);
  const intro = sitePageMarkdown("introduction", true);
  expect(intro).toContain("/en/docs/installation");
  expect(intro).not.toContain("pnpm add");
  expect(intro).not.toMatch(/manual-source|manual source|manual copying|手动/i);
  expect(sitePages.filter((page) => page.slug === "introduction")).toHaveLength(
    1,
  );
  expect(sitePages.filter((page) => page.slug === "installation")).toHaveLength(
    1,
  );
  expect(intro).not.toMatch(/vue-lynx|@orvui\/lynx|\/lynx\//);
});

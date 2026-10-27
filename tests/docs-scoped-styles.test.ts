// @vitest-environment node
import { readFileSync } from "node:fs";
import { compileStyle, parse } from "vue/compiler-sfc";
import { expect, it } from "vitest";

it.each(["SiteInstallCommand"])("keeps %s dark effects scoped to its actual elements", name => {
  const filename = `apps/docs/.vitepress/theme/${name}.vue`;
  const descriptor = parse(readFileSync(filename,"utf8"),{filename}).descriptor;
  const result = compileStyle({filename,source:descriptor.styles[0].content,id:"data-v-isolation",scoped:true});
  expect(result.errors).toEqual([]);
  const darkRules: string[]=[];
  result.rawResult!.root.walkRules(rule=>{
    if (rule.selector.startsWith('.dark')) {
      darkRules.push(rule.selector);
      expect(rule.selector).not.toBe('.dark');
      expect(rule.selector).toContain('[data-v-isolation]');
      expect(rule.selector).toMatch(/\.command-/);
    }
  });
  expect(darkRules.length).toBeGreaterThan(0);
});

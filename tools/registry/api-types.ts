import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import ts from "typescript";
import baseline from "../catalog/public-api.json";
const api = baseline.components;
function names(file: string, seen = new Set<string>()): Set<string> {
  if (seen.has(file) || !existsSync(file)) return new Set();
  seen.add(file);
  const source = ts.createSourceFile(
      file,
      readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    ),
    result = new Set<string>();
  for (const node of source.statements) {
    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause))
        for (const e of node.exportClause.elements) result.add(e.name.text);
      else if (
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        node.moduleSpecifier.text.startsWith(".")
      )
        for (const name of names(
          resolve(dirname(file), node.moduleSpecifier.text + ".ts"),
          seen,
        ))
          result.add(name);
    } else if (
      ts.canHaveModifiers(node) &&
      ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      if ("name" in node && node.name && ts.isIdentifier(node.name as ts.Node))
        result.add((node.name as ts.Identifier).text);
      if (ts.isVariableStatement(node))
        for (const d of node.declarationList.declarations)
          if (ts.isIdentifier(d.name)) result.add(d.name.text);
    }
  }
  return result;
}
let count = 0;
for (const item of api) {
  const folder = resolve("packages/vue/src", item.category, item.slug),
    index = folder + "/index.ts";
  if (!existsSync(index)) continue;
  let content = readFileSync(index, "utf8").replace(
    /\nexport type \* from ['"]\.\/(?:src\/)?api-types['"];?\n?/g,
    "\n",
  );
  writeFileSync(index, content);
  const existing = names(index),
    components = new Map<string, string>();
  for (const m of content.matchAll(
    /export\s*\{\s*default\s+as\s+(\w+)(?:[^}]*)\}\s*from\s*['"]([^'"]+\.vue)['"]/g,
  ))
    components.set(m[1], m[2]);
  const generated: string[] = [];
  const apiFile = resolve(folder, "src/api-types.ts");
  for (const entry of item.exports) {
    if (!entry.name.endsWith("Props") || existing.has(entry.name)) continue;
    const component = components.get(entry.name.slice(0, -5));
    if (!component) continue;
    let specifier = relative(dirname(apiFile), resolve(folder, component)).replaceAll("\\", "/");
    if (!specifier.startsWith(".")) specifier = "./" + specifier;
    generated.push(
      `export type ${entry.name} = ${item.slug === "infinite-masonry" ? `Parameters<typeof import('${specifier}')['default']>[0]` : `InstanceType<typeof import('${specifier}')['default']>['$props']`}`,
    );
  }
  if (generated.length) {
    writeFileSync(
      apiFile,
      "// Vue public prop types, derived from the actual components.\n" +
        generated.join("\n") +
        "\n",
    );
    writeFileSync(index, content.trimEnd() + "\n\nexport type * from './src/api-types';\n");
    count += generated.length;
  }
}
console.log(`Exported ${count} Vue component prop types.`);

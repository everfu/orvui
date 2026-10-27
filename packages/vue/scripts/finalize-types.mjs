import { readdirSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import ts from "typescript";
const root = resolve(import.meta.dirname, ".."),
  source = resolve(root, "src"),
  dist = resolve(root, "dist");
// Vite emits public JS entries beside their source-shaped declaration folders.
// Pair each JS entry with a declaration file so TS does not resolve the JS first.
for (const category of ["motion", "blocks", "agents", "charts"]) {
  writeFileSync(
    resolve(dist, category + ".d.ts"),
    `export * from './${category}/index';\n`,
  );
  for (const entry of readdirSync(resolve(source, category), {
    withFileTypes: true,
  }))
    if (
      entry.isDirectory() &&
      existsSync(resolve(source, category, entry.name, "index.ts"))
    )
      writeFileSync(
        resolve(dist, category, entry.name + ".d.ts"),
        `export * from './${entry.name}/index';\n`,
      );
}
const options = {
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
  failures = [];
let files = 0,
  imports = 0,
  extractedStyleImports = 0;
function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      visit(path);
      continue;
    }
    if (!entry.name.endsWith(".d.ts")) continue;
    files++;
    const original = readFileSync(path, "utf8");
    const originalAst = ts.createSourceFile(
      path,
      original,
      ts.ScriptTarget.Latest,
      true,
    );
    // Vite extracts these runtime styles into style.css. They carry no types
    // and their original source paths do not exist beside emitted declarations.
    // Keep line breaks so the declaration source map retains its line offsets.
    let content = original;
    for (const node of [...originalAst.statements].reverse()) {
      if (
        ts.isImportDeclaration(node) &&
        !node.importClause &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        node.moduleSpecifier.text.endsWith(".css")
      ) {
        const start = node.getStart(originalAst), end = node.getEnd();
        content = content.slice(0, start) +
          content.slice(start, end).replace(/[^\r\n]/g, "") +
          content.slice(end);
        extractedStyleImports++;
      }
    }
    if (content !== original) writeFileSync(path, content);
    const ast = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
    function check(node) {
      const spec =
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
          ? node.moduleSpecifier.text
          : ts.isImportTypeNode(node) &&
              ts.isLiteralTypeNode(node.argument) &&
              ts.isStringLiteral(node.argument.literal)
            ? node.argument.literal.text
            : undefined;
      if (spec?.startsWith(".")) {
        imports++;
        const resolved = ts.resolveModuleName(
          spec,
          path,
          options,
          ts.sys,
        ).resolvedModule;
        if (!resolved || !/\.d\.[cm]?ts$/.test(resolved.resolvedFileName))
          failures.push(
            `${relative(dist, path)} -> ${spec} -> ${resolved?.resolvedFileName ?? "unresolved"}`,
          );
      }
      ts.forEachChild(node, check);
    }
    check(ast);
  }
}
visit(dist);
if (failures.length)
  throw new Error(
    `Invalid generated declaration imports:\n${failures.join("\n")}`,
  );
writeFileSync(
  resolve(dist, "declaration-audit.json"),
  JSON.stringify(
    { files, relativeImports: imports, extractedStyleImports, unresolved: failures },
    null,
    2,
  ) + "\n",
);
console.log(
  `Declarations audited: ${files} files, ${imports} relative imports, zero unresolved.`,
);

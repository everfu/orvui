import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { dirname, extname, relative, resolve } from "node:path";
import ts from "typescript";

/** The same portable source files back both manual copying and CLI installation. */
export function sourceClosure(
  starts: string[],
  options: {
    root: string;
    dependencies: Record<string, string>;
    peerDependencies?: Record<string, string>;
    namespace?: string;
  },
) {
  const root = realpathSync(resolve(options.root)),
    files = new Map<string, string>(),
    packages = new Set<string>();
  const resolveImport = (file: string, specifier: string) => {
    const base = resolve(dirname(file), specifier);
    return [
      base,
      base + ".ts",
      base + ".vue",
      base + ".css",
      base + "/index.ts",
      base.replace(/\.js$/, ".ts"),
    ].find(
      (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
    );
  };
  function visit(file: string) {
    file = realpathSync(file);
    if (files.has(file)) return;
    if (!file.startsWith(root + "/"))
      throw new Error(`Registry import escapes component source: ${file}`);
    if (relative(root, file).split(/[\\/]/).includes("tests"))
      throw new Error(`Registry runtime import reaches a test: ${file}`);
    const content = readFileSync(file, "utf8");
    files.set(file, content);
    const specs = new Set<string>();
    const scripts =
      extname(file) === ".vue"
        ? [...content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(
            (match) => match[1],
          )
        : extname(file) === ".css"
          ? []
          : [content];
    for (const script of scripts) {
      const source = ts.createSourceFile(
        file + ".ts",
        script,
        ts.ScriptTarget.Latest,
        true,
      );
      function scan(node: ts.Node) {
        if (
          (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
          node.moduleSpecifier &&
          ts.isStringLiteral(node.moduleSpecifier)
        )
          specs.add(node.moduleSpecifier.text);
        if (
          ts.isCallExpression(node) &&
          node.expression.kind === ts.SyntaxKind.ImportKeyword &&
          node.arguments[0] &&
          ts.isStringLiteral(node.arguments[0])
        )
          specs.add(node.arguments[0].text);
        if (
          ts.isImportTypeNode(node) &&
          ts.isLiteralTypeNode(node.argument) &&
          ts.isStringLiteral(node.argument.literal)
        )
          specs.add(node.argument.literal.text);
        ts.forEachChild(node, scan);
      }
      scan(source);
    }
    const styles =
      extname(file) === ".css"
        ? [content]
        : [...content.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(
            (match) => match[1],
          );
    for (const style of styles)
      for (const match of style
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/g))
        specs.add(match[1]);
    if (extname(file) === ".vue")
      for (const match of content.matchAll(
        /<(?:script|style)\b[^>]*\bsrc=["']([^"']+)["']/g,
      ))
        specs.add(match[1]);
    for (const specifier of specs) {
      if (specifier.startsWith(".")) {
        const path = resolveImport(file, specifier);
        if (!path) throw new Error(`Unresolved ${specifier} from ${file}`);
        visit(path);
      } else if (specifier.startsWith("@/"))
        throw new Error(`Unportable alias ${specifier}`);
      else if (!/^(?:https?:|data:|\/\/)/.test(specifier)) {
        const name = specifier.startsWith("@")
          ? specifier.split("/").slice(0, 2).join("/")
          : specifier.split("/")[0];
        if (options.dependencies[name])
          packages.add(`${name}@${options.dependencies[name]}`);
        else if (!(name === "vue" && options.peerDependencies?.vue))
          throw new Error(`Undeclared registry dependency ${name} (${specifier}) from ${file}`);
      }
    }
  }
  for (const start of starts) visit(resolve(start));
  const licenses = new Map<string, string>();
  for (const file of files.keys()) {
    let directory = dirname(file);
    while (directory === root || directory.startsWith(root + "/")) {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (entry.isFile() && /^(?:LICENSE|NOTICE)(?:[.-]|$)/i.test(entry.name)) {
          const location = resolve(directory, entry.name);
          if (!files.has(location)) licenses.set(location, readFileSync(location, "utf8"));
        }
      }
      if (directory === root) break;
      directory = dirname(directory);
    }
  }
  return {
    files: [...files]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([file, content]) => ({
        path: `registry/${options.namespace ?? "orvui"}/${relative(root, file)}${extname(file) === ".css" ? ".txt" : ""}`,
        target: `~/src/components/${options.namespace ?? "orvui"}/${relative(root, file)}`,
        type:
          extname(file) === ".vue"
            ? "registry:component"
            : extname(file) === ".css"
              ? "registry:file"
              : "registry:lib",
        content,
      })).concat([...licenses].sort(([a],[b]) => a.localeCompare(b)).map(([file, text]) => ({
        path: `registry/${options.namespace ?? "orvui"}/${relative(root, file)}.txt`,
        target: `~/src/components/${options.namespace ?? "orvui"}/${relative(root, file)}.txt`,
        type: "registry:file",
        content: text,
      }))),
    dependencies: [...packages].sort(),
  };
}

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { compileScript, parse as parseSfc } from "vue/compiler-sfc";
import catalog from "../../../tools/catalog/components.json";
import type { CatalogCategory } from "../../../tools/registry/types";
import type {
  ApiComponent,
  ApiComposition,
  ApiDiagnostic,
  ApiEntry,
  ApiEvent,
  ApiProp,
  ApiSlot,
  ComponentDocs,
} from "../app/utils/docs/component-docs-types";

const virtualSuffix = ".__orvui_api.ts";
const normalize = (file: string) => file.replaceAll("\\", "/");
const own = (node: ts.Node) => node.getSourceFile().fileName;
function resolveFile(base: string): string | undefined {
  return [base, `${base}.ts`, `${base}.tsx`, resolve(base, "index.ts")].find(
    (file) => existsSync(file) && /\.(?:vue|tsx?)$/.test(file),
  );
}
function ast(file: string, source = readFileSync(file, "utf8")) {
  return ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
}
function visit(node: ts.Node, fn: (node: ts.Node) => void) {
  fn(node);
  ts.forEachChild(node, (child) => visit(child, fn));
}
function macro(
  file: ts.SourceFile,
  name: string,
): ts.CallExpression | undefined {
  let match: ts.CallExpression | undefined;
  visit(file, (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === name
    )
      match = node;
  });
  return match;
}
function nameOf(
  node: ts.PropertyName | ts.BindingName | undefined,
): string | undefined {
  return node &&
    (ts.isIdentifier(node) ||
      ts.isStringLiteralLike(node) ||
      ts.isNumericLiteral(node))
    ? node.text
    : undefined;
}

/** Resolve runtime component aliases, excluding type-only exports and native/library types. */
export function sfcExports(
  file: string,
  seen = new Set<string>(),
): Map<string, string> {
  const result = new Map<string, string>();
  if (seen.has(file) || !existsSync(file)) return result;
  seen.add(file);
  for (const statement of ast(file).statements) {
    if (
      !ts.isExportDeclaration(statement) ||
      statement.isTypeOnly ||
      !statement.moduleSpecifier ||
      !ts.isStringLiteral(statement.moduleSpecifier)
    )
      continue;
    const specifier = statement.moduleSpecifier.text;
    if (!specifier.startsWith(".")) continue;
    const target = resolveFile(resolve(dirname(file), specifier));
    if (!target) continue;
    if (target.endsWith(".vue")) {
      if (statement.exportClause && ts.isNamedExports(statement.exportClause))
        for (const entry of statement.exportClause.elements)
          if (
            !entry.isTypeOnly &&
            (entry.propertyName?.text ?? entry.name.text) === "default"
          )
            result.set(entry.name.text, target);
      continue;
    }
    const children = sfcExports(target, new Set(seen));
    if (!statement.exportClause)
      for (const [name, path] of children) result.set(name, path);
    else if (ts.isNamedExports(statement.exportClause))
      for (const entry of statement.exportClause.elements) {
        const child = children.get(entry.propertyName?.text ?? entry.name.text);
        if (!entry.isTypeOnly && child) result.set(entry.name.text, child);
      }
  }
  return result;
}

interface Parsed {
  file: string;
  script: string;
  ast: ts.SourceFile;
  template: ReturnType<typeof parseSfc>["descriptor"]["template"];
  props?: ts.CallExpression;
  emits?: ts.CallExpression;
  slots?: ts.CallExpression;
  generic?: string;
}

export function buildComponentDocs(
  options: {
    root?: string;
    categories?: CatalogCategory[];
    revision?: string;
    sourceRoot?: string;
    packageName?: string;
  } = {},
): ComponentDocs {
  const root = resolve(options.root ?? process.cwd());
  const categories: CatalogCategory[] =
    options.categories ?? catalog.categories;
  const sourceRoot = resolve(root, options.sourceRoot ?? "packages/vue/src");
  const packageName = options.packageName ?? "@orvui/vue";
  const rel = (file: string) =>
    normalize(relative(root, file.replace(virtualSuffix, "")));
  const diagnostics: ApiDiagnostic[] = [];
  const parsed = new Map<string, Parsed>();
  const exportsByEntry = new Map<string, Map<string, string>>();
  const aliases = new Map<string, Set<string>>();
  function parse(file: string): Parsed {
    const cached = parsed.get(file);
    if (cached) return cached;
    const { descriptor, errors } = parseSfc(readFileSync(file, "utf8"), {
      filename: file,
    });
    for (const error of errors)
      diagnostics.push({
        file: rel(file),
        code: "sfc-parse",
        message: String(error),
      });
    const script = [descriptor.script?.content, descriptor.scriptSetup?.content]
      .filter(Boolean)
      .join("\n");
    const source = ast(file, script);
    const value: Parsed = {
      file,
      script,
      ast: source,
      template: descriptor.template,
      props: macro(source, "defineProps"),
      emits: macro(source, "defineEmits"),
      slots: macro(source, "defineSlots"),
      generic:
        typeof descriptor.scriptSetup?.attrs.generic === "string"
          ? descriptor.scriptSetup.attrs.generic
          : undefined,
    };
    parsed.set(file, value);
    return value;
  }
  for (const category of categories)
    for (const entry of category.components) {
      const key = `${category.slug}/${entry.slug}`;
      const exports = sfcExports(resolve(sourceRoot, key, "index.ts"));
      exportsByEntry.set(key, exports);
      for (const [name, file] of exports) {
        if (!aliases.has(file)) aliases.set(file, new Set());
        aliases.get(file)!.add(name);
        parse(file);
      }
    }

  // Keep real source imports and declarations intact. Only macro inputs get
  // aliases; TypeScript resolves intersections, imported interfaces and unions.
  const virtual = new Map<string, string>();
  function virtualSource(file: string): string {
    const cached = virtual.get(file + virtualSuffix);
    if (cached !== undefined) return cached;
    const p = parse(file);
    const input = (call?: ts.CallExpression) =>
      call?.typeArguments?.[0]?.getText(p.ast) ?? "{}";
    const generic = p.generic ? `<${p.generic}>` : "";
    // Generic parameters remain real type parameters in the public metadata;
    // only the internal import stub needs an instantiation for DefineComponent.
    const parameters = p.generic
      ? ((
          ast(file, `type __Generic${generic} = never`)
            .statements[0] as ts.TypeAliasDeclaration
        ).typeParameters ?? [])
      : [];
    const instance = parameters.length
      ? `<${parameters.map(() => "any").join(", ")}>`
      : "";
    const source = `${p.script}\nexport type __OrvuiOwnProps${generic} = ${input(p.props)};\nexport type __OrvuiOwnEmits${generic} = ${input(p.emits)};\nexport type __OrvuiOwnSlots${generic} = ${input(p.slots)};\nexport default {} as import('vue').DefineComponent<__OrvuiOwnProps${instance}>;\n`;
    virtual.set(file + virtualSuffix, source);
    return source;
  }
  for (const file of parsed.keys()) virtualSource(file);
  const macroFile = resolve(root, "__orvui_api_macros.d.ts");
  virtual.set(
    macroFile,
    `declare function defineProps<T>(): Readonly<T>;
declare function withDefaults<T, D>(props: T, defaults: D): T;
declare function defineEmits<T = (...args: any[]) => void>(events?: readonly string[]): T;
declare function defineSlots<T>(): T;
declare function defineOptions(options: object): void;
declare function defineExpose(options: object): void;`,
  );
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    skipLibCheck: true,
    allowArbitraryExtensions: true,
    allowSyntheticDefaultImports: true,
    jsx: ts.JsxEmit.Preserve,
    noEmit: true,
    types: [],
  };
  const host = ts.createCompilerHost(compilerOptions);
  const normalExists = host.fileExists.bind(host),
    normalRead = host.readFile.bind(host);
  host.fileExists = (file) => virtual.has(file) || normalExists(file);
  host.readFile = (file) => virtual.get(file) ?? normalRead(file);
  host.getSourceFile = (file, version) => {
    const text = host.readFile(file);
    return text === undefined
      ? undefined
      : ts.createSourceFile(file, text, version, true);
  };
  host.resolveModuleNames = (names, containingFile) =>
    names.map((name) => {
      if (name.startsWith(".") && name.endsWith(".vue")) {
        const file = resolve(dirname(containingFile), name);
        if (existsSync(file)) {
          virtualSource(file);
          return {
            resolvedFileName: file + virtualSuffix,
            extension: ts.Extension.Ts,
          };
        }
      }
      return ts.resolveModuleName(name, containingFile, compilerOptions, host)
        .resolvedModule;
    });
  const program = ts.createProgram([...virtual.keys()], compilerOptions, host);
  const checker = program.getTypeChecker();
  const formatFlags =
    ts.TypeFormatFlags.NoTruncation |
    ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
  function hasErrorType(type: ts.Type, seen = new Set<ts.Type>()): boolean {
    if (seen.has(type)) return false;
    seen.add(type);
    if (
      (type as ts.Type & { intrinsicName?: string }).intrinsicName === "error"
    )
      return true;
    if (
      type.isUnionOrIntersection() &&
      type.types.some((part) => hasErrorType(part, seen))
    )
      return true;
    if (type.aliasTypeArguments?.some((part) => hasErrorType(part, seen)))
      return true;
    if (
      type.flags & ts.TypeFlags.Object &&
      (type as ts.ObjectType).objectFlags & ts.ObjectFlags.Reference
    )
      return checker
        .getTypeArguments(type as ts.TypeReference)
        .some((part) => hasErrorType(part, seen));
    return false;
  }
  function describeType(
    type: ts.Type,
    location: ts.Node,
    optional = false,
  ): string | null {
    if (hasErrorType(type)) return null;
    if (optional && type.isUnion()) {
      const values = type.types.filter(
        (part) => !(part.flags & ts.TypeFlags.Undefined),
      );
      const boolean = values.filter(
        (part) => part.flags & ts.TypeFlags.BooleanLiteral,
      );
      if (boolean.length === 2)
        return [
          "boolean",
          ...values
            .filter((part) => !(part.flags & ts.TypeFlags.BooleanLiteral))
            .map((part) => describeType(part, location))
            .filter((value): value is string => value !== null),
        ].join(" | ");
      return (
        values
          .map((part) => describeType(part, location))
          .filter((value): value is string => value !== null)
          .join(" | ") || null
      );
    }
    if (
      (type as ts.Type & { intrinsicName?: string }).intrinsicName === "error"
    )
      return null;
    return checker.typeToString(type, location, formatFlags);
  }
  const docsByFile: Record<string, ApiComponent> = {};
  for (const [file, names] of aliases) {
    const p = parse(file),
      source = program.getSourceFile(file + virtualSuffix)!;
    const localDiagnostics: ApiDiagnostic[] = [];
    const issue = (code: string, message: string, member?: string) =>
      localDiagnostics.push({
        file: rel(file),
        code,
        message,
        ...(member ? { member } : {}),
      });
    const typeOfAlias = (name: string) => {
      const node = source.statements.find(
        (node): node is ts.TypeAliasDeclaration =>
          ts.isTypeAliasDeclaration(node) && node.name.text === name,
      )!;
      return { node, type: checker.getTypeAtLocation(node) };
    };
    const defaults = new Map<
      string,
      { value: string; source: ApiProp["defaultSource"] }
    >();
    const propsCall = macro(source, "defineProps");
    if (
      propsCall &&
      ts.isCallExpression(propsCall.parent) &&
      ts.isIdentifier(propsCall.parent.expression) &&
      propsCall.parent.expression.text === "withDefaults"
    ) {
      const values = propsCall.parent.arguments[1];
      if (values && ts.isObjectLiteralExpression(values))
        for (const property of values.properties)
          if (ts.isPropertyAssignment(property)) {
            const name = nameOf(property.name);
            if (name)
              defaults.set(name, {
                value: property.initializer.getText(source),
                source: "withDefaults",
              });
          }
    }
    let propsBinding: ts.Identifier | undefined;
    if (propsCall) {
      const holder = ts.isCallExpression(propsCall.parent)
        ? propsCall.parent.parent
        : propsCall.parent;
      if (ts.isVariableDeclaration(holder)) {
        if (ts.isIdentifier(holder.name)) propsBinding = holder.name;
        else if (ts.isObjectBindingPattern(holder.name))
          for (const binding of holder.name.elements)
            if (binding.initializer) {
              const name = nameOf(binding.propertyName ?? binding.name);
              if (name)
                defaults.set(name, {
                  value: binding.initializer.getText(source),
                  source: "destructure",
                });
            }
      }
    }
    // Vue Boolean casting is a runtime default even when withDefaults omits a
    // field. Read the compiler's real runtime type list instead of assuming a
    // TypeScript boolean union always receives that cast.
    if (p.props)
      try {
        const { descriptor } = parseSfc(readFileSync(file, "utf8"), {
          filename: file,
        });
        const compiled = ast(
          file,
          compileScript(descriptor, {
            id: rel(file),
            fs: {
              fileExists: existsSync,
              readFile: (path) => readFileSync(path, "utf8"),
            },
          }).content,
        );
        visit(compiled, (node) => {
          if (
            !ts.isPropertyAssignment(node) ||
            nameOf(node.name) !== "props" ||
            !ts.isObjectLiteralExpression(node.initializer)
          )
            return;
          for (const prop of node.initializer.properties) {
            if (
              !ts.isPropertyAssignment(prop) ||
              !ts.isObjectLiteralExpression(prop.initializer)
            )
              continue;
            const name = nameOf(prop.name);
            if (!name || defaults.has(name)) continue;
            const type = prop.initializer.properties.find(
              (member): member is ts.PropertyAssignment =>
                ts.isPropertyAssignment(member) &&
                nameOf(member.name) === "type",
            )?.initializer;
            const types =
              type && ts.isArrayLiteralExpression(type)
                ? type.elements.map((entry) => entry.getText(compiled))
                : type
                  ? [type.getText(compiled)]
                  : [];
            if (
              types.includes("Boolean") &&
              (!types.includes("String") ||
                types.indexOf("Boolean") < types.indexOf("String"))
            )
              defaults.set(name, { value: "false", source: "boolean-cast" });
          }
        });
      } catch (error) {
        issue(
          "runtime-defaults-unresolved",
          `Vue compiler could not inspect runtime casting defaults: ${String(error).split("\n")[0]}`,
        );
      }
    // A number of component defaults live in their imported composable rather
    // than withDefaults. Follow only calls receiving the actual props object,
    // and compare TypeScript symbols so a shadowed `props` name cannot leak in.
    const fallbacks = new Map<string, Set<string>>();
    const examined = new Set<string>();
    const addFallback = (name: string, value: string) => {
      if (!fallbacks.has(name)) fallbacks.set(name, new Set());
      fallbacks.get(name)!.add(value);
    };
    function collectFallbacks(scope: ts.Node, binding: ts.Identifier) {
      const symbol = checker.getSymbolAtLocation(binding);
      if (!symbol) return;
      const key = `${own(scope)}:${scope.pos}:${binding.text}`;
      if (examined.has(key)) return;
      examined.add(key);
      const isProps = (node: ts.Node) =>
        ts.isIdentifier(node) && checker.getSymbolAtLocation(node) === symbol;
      visit(scope, (node) => {
        if (
          ts.isBinaryExpression(node) &&
          node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken &&
          ts.isPropertyAccessExpression(node.left) &&
          isProps(node.left.expression)
        )
          addFallback(node.left.name.text, node.right.getText());
        if (!ts.isCallExpression(node)) return;
        for (let index = 0; index < node.arguments.length; index++) {
          if (!isProps(node.arguments[index])) continue;
          const declaration = checker.getResolvedSignature(node)?.declaration;
          if (
            !declaration ||
            own(declaration).includes("node_modules") ||
            !(
              ts.isFunctionDeclaration(declaration) ||
              ts.isFunctionExpression(declaration) ||
              ts.isArrowFunction(declaration) ||
              ts.isMethodDeclaration(declaration)
            ) ||
            !declaration.body
          )
            continue;
          const parameter = declaration.parameters[index];
          if (!parameter) continue;
          if (ts.isIdentifier(parameter.name))
            collectFallbacks(declaration.body, parameter.name);
          else if (ts.isObjectBindingPattern(parameter.name))
            for (const element of parameter.name.elements) {
              const name = nameOf(element.propertyName ?? element.name);
              if (name && element.initializer)
                addFallback(name, element.initializer.getText());
            }
        }
      });
    }
    if (propsBinding) collectFallbacks(source, propsBinding);
    for (const [name, values] of fallbacks)
      if (!defaults.has(name)) {
        if (values.size === 1)
          defaults.set(name, { value: [...values][0], source: "fallback" });
        else
          issue(
            "ambiguous-fallback-default",
            `The props object has multiple fallback expressions: ${[...values].join("; ")}. No single default was guessed.`,
            name,
          );
      }
    const propType = typeOfAlias("__OrvuiOwnProps");
    const props: ApiProp[] = [];
    if (p.props?.typeArguments?.length)
      for (const symbol of checker.getPropertiesOfType(propType.type)) {
        const declarations = symbol.getDeclarations() ?? [];
        const declaration = declarations.find(
          (declaration) => !own(declaration).includes("node_modules"),
        );
        if (!declaration) continue;
        const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
        const required = !(symbol.flags & ts.SymbolFlags.Optional);
        const description = ts.displayPartsToString(
          symbol.getDocumentationComment(checker),
        );
        const jsdocDefault = symbol
          .getJsDocTags(checker)
          .find((tag) => tag.name === "default" || tag.name === "defaultValue");
        const fallback =
          defaults.get(symbol.name) ??
          (jsdocDefault?.text
            ? {
                value: ts.displayPartsToString(jsdocDefault.text),
                source: "jsdoc" as const,
              }
            : undefined);
        const formatted = describeType(type, declaration, !required);
        if (formatted === null)
          issue(
            "unresolved-prop-type",
            "TypeScript could not resolve the declared prop type.",
            symbol.name,
          );
        if (formatted === "any" || formatted === "unknown")
          issue(
            "source-declared-broad-type",
            `The source declares ${formatted}; this is preserved rather than replaced with a guessed narrower type.`,
            symbol.name,
          );
        props.push({
          name: symbol.name,
          type: formatted,
          required,
          defaultValue: fallback?.value ?? null,
          defaultSource: fallback?.source ?? null,
          description,
          sourceFile: rel(own(declaration)),
        });
      }
    if (
      p.props?.typeArguments?.length &&
      propType.type.flags & ts.TypeFlags.Any
    )
      issue(
        "unresolved-props",
        "TypeScript could not resolve the defineProps input; no fabricated fields were emitted.",
      );
    if (p.props && !p.props.typeArguments?.length)
      issue(
        "runtime-props",
        "Runtime defineProps needs an explicit runtime declaration extractor.",
      );

    const events: ApiEvent[] = [];
    if (p.emits?.typeArguments?.length) {
      const { type } = typeOfAlias("__OrvuiOwnEmits");
      for (const symbol of checker.getPropertiesOfType(type)) {
        const node =
          symbol.valueDeclaration ?? symbol.declarations?.[0] ?? source;
        const payload = describeType(
          checker.getTypeOfSymbolAtLocation(symbol, node),
          node,
        );
        events.push({
          name: symbol.name,
          signature: payload,
          declaration: "typed",
          description: ts.displayPartsToString(
            symbol.getDocumentationComment(checker),
          ),
        });
        if (payload === null)
          issue(
            "unresolved-event-type",
            "TypeScript could not resolve the declared event payload.",
            symbol.name,
          );
      }
      for (const signature of checker.getSignaturesOfType(
        type,
        ts.SignatureKind.Call,
      )) {
        const parameter = signature.getParameters()[0];
        if (!parameter) continue;
        const location = parameter.valueDeclaration ?? source;
        const eventType = checker.getTypeOfSymbolAtLocation(
          parameter,
          location,
        );
        const candidates = eventType.isUnion() ? eventType.types : [eventType];
        for (const candidate of candidates)
          if (candidate.isStringLiteral())
            events.push({
              name: candidate.value,
              signature: checker.signatureToString(
                signature,
                source,
                formatFlags,
              ),
              declaration: "typed",
              description: "",
            });
      }
    } else if (
      p.emits?.arguments[0] &&
      ts.isArrayLiteralExpression(p.emits.arguments[0])
    ) {
      for (const event of p.emits.arguments[0].elements)
        if (ts.isStringLiteralLike(event))
          events.push({
            name: event.text,
            signature: null,
            declaration: "runtime",
            description: "",
          });
      if (events.length)
        issue(
          "runtime-event-payload",
          "Event names are declared by a runtime array; payload types are not declared by the component and have not been guessed.",
        );
    }
    const slots: ApiSlot[] = [];
    if (p.slots?.typeArguments?.length) {
      const { type } = typeOfAlias("__OrvuiOwnSlots");
      for (const symbol of checker.getPropertiesOfType(type)) {
        const node =
          symbol.valueDeclaration ?? symbol.declarations?.[0] ?? source;
        slots.push({
          name: symbol.name,
          signature: describeType(
            checker.getTypeOfSymbolAtLocation(symbol, node),
            node,
            true,
          ),
          declaration: "typed",
          bindings: [],
          description: ts.displayPartsToString(
            symbol.getDocumentationComment(checker),
          ),
        });
      }
    }
    function templateSlots(node: any) {
      if (node.type === 1 && node.tag === "slot") {
        const dynamicName = node.props.find(
          (prop: any) =>
            prop.type === 7 &&
            prop.name === "bind" &&
            prop.arg?.content === "name",
        );
        const name = dynamicName
          ? `[${dynamicName.exp?.content ?? "name"}]`
          : (node.props.find(
              (prop: any) => prop.type === 6 && prop.name === "name",
            )?.value?.content ?? "default");
        const bindings = node.props
          .filter(
            (prop: any) =>
              prop.type === 7 &&
              prop.name === "bind" &&
              prop.arg?.content !== "name",
          )
          .map((prop: any) => ({
            name: prop.arg?.content ?? "v-bind",
            expression: prop.exp?.content ?? "",
          }));
        const existing = slots.find((slot) => slot.name === name);
        if (existing)
          existing.bindings.push(
            ...bindings.filter(
              (binding: ApiSlot["bindings"][number]) =>
                !existing.bindings.some(
                  (item) =>
                    item.name === binding.name &&
                    item.expression === binding.expression,
                ),
            ),
          );
        else
          slots.push({
            name,
            signature: bindings.length ? null : "() => VNodeChild",
            declaration: "template",
            bindings,
            description: "",
          });
        if (bindings.length && !existing)
          issue(
            "untyped-slot-bindings",
            "Template declares scoped slot bindings without a defineSlots payload type; original binding expressions are retained.",
            name,
          );
        if (dynamicName)
          issue(
            "dynamic-slot-name",
            "Slot outlet name is dynamic; consult its source expression.",
          );
      }
      for (const child of node.children ?? []) templateSlots(child);
    }
    if (p.template?.ast) templateSlots(p.template.ast);
    const value: ApiComponent = {
      displayName: [...names][0],
      aliases: [...names],
      file: rel(file),
      props,
      events,
      slots,
      diagnostics: localDiagnostics,
    };
    docsByFile[rel(file)] = value;
    diagnostics.push(...localDiagnostics);
  }

  function composition(
    key: string,
    demoFile: string,
    exports: Map<string, string>,
  ): ApiComposition {
    const direct: { name: string; file: string }[] = [];
    const entryFolder = resolve(sourceRoot, key);
    const publicFiles = new Set(exports.values());
    const include = (name: string, file: string) => {
      if (publicFiles.has(file) && !direct.some((item) => item.file === file))
        direct.push({ name, file });
    };
    function readImports(file: string, seen = new Set<string>()) {
      if (seen.has(file)) return;
      seen.add(file);
      const demo = parse(file);
      for (const statement of demo.ast.statements) {
        if (
          !ts.isImportDeclaration(statement) ||
          statement.importClause?.isTypeOnly ||
          !ts.isStringLiteral(statement.moduleSpecifier)
        )
          continue;
        const specifier = statement.moduleSpecifier.text;
        const target = specifier.startsWith(".")
          ? resolveFile(resolve(dirname(file), specifier))
          : specifier.startsWith(packageName + "/")
            ? resolveFile(
                resolve(sourceRoot, specifier.slice(packageName.length + 1)),
              )
            : undefined;
        if (
          !target ||
          !normalize(target).startsWith(normalize(entryFolder) + "/")
        )
          continue;
        if (target.endsWith(".vue")) {
          const name = statement.importClause?.name?.text;
          if (name) include(name, target);
          if (!publicFiles.has(target)) readImports(target, seen);
        } else if (
          statement.importClause?.namedBindings &&
          ts.isNamedImports(statement.importClause.namedBindings)
        ) {
          const imported = sfcExports(target);
          for (const element of statement.importClause.namedBindings.elements) {
            const file = imported.get(
              element.propertyName?.text ?? element.name.text,
            );
            if (!element.isTypeOnly && file)
              include(element.propertyName?.text ?? element.name.text, file);
          }
        }
      }
    }
    readImports(demoFile);
    // Include public compound parts used by a selected component's default slots,
    // without pulling in sibling variants or cross-entry shared controls.
    const dependencies = new Set<string>();
    function follow(file: string) {
      if (dependencies.has(file)) return;
      dependencies.add(file);
      const p = parse(file);
      for (const statement of p.ast.statements)
        if (
          ts.isImportDeclaration(statement) &&
          !statement.importClause?.isTypeOnly &&
          ts.isStringLiteral(statement.moduleSpecifier) &&
          statement.moduleSpecifier.text.startsWith(".")
        ) {
          const target = resolveFile(
            resolve(dirname(file), statement.moduleSpecifier.text),
          );
          if (
            target?.endsWith(".vue") &&
            normalize(target).startsWith(normalize(entryFolder) + "/")
          ) {
            const publicName = [...exports].find(
              ([, value]) => value === target,
            )?.[0];
            if (publicName) include(publicName, target);
            follow(target);
          }
        }
    }
    for (const item of [...direct]) follow(item.file);
    if (!direct.length)
      diagnostics.push({
        file: rel(demoFile),
        code: "unmapped-composition",
        message:
          "No public component import from this entry was found; no primary source was guessed.",
      });
    return {
      demoFile: rel(demoFile),
      primaryFile: direct[0] ? rel(direct[0].file) : null,
      sourceFiles: direct.map((item) => rel(item.file)),
      components: direct.map((item) => ({
        ...docsByFile[rel(item.file)],
        displayName: item.name,
      })),
    };
  }
  const entries: Record<string, ApiEntry> = {};
  for (const category of categories)
    for (const entry of category.components) {
      const key = `${category.slug}/${entry.slug}`,
        exports = exportsByEntry.get(key)!;
      entries[key] = {
        category: category.slug,
        slug: entry.slug,
        publicComponents: [...exports.keys()],
        default: composition(
          key,
          resolve(sourceRoot, key, "demo.vue"),
          exports,
        ),
        variants: Object.fromEntries(
          (entry.examples ?? []).map((example) => [
            example.slug,
            composition(
              key,
              resolve(sourceRoot, key, "examples", `${example.slug}.vue`),
              exports,
            ),
          ]),
        ),
      };
    }
  const components = Object.values(docsByFile);
  return {
    schemaVersion: 1,
    productVersion: options.revision ?? catalog.product.version,
    entries,
    components: docsByFile,
    diagnostics,
    summary: {
      entries: Object.keys(entries).length,
      variants: Object.values(entries).reduce(
        (sum, entry) => sum + Object.keys(entry.variants).length,
        0,
      ),
      publicComponents: [...exportsByEntry.values()].reduce(
        (sum, values) => sum + values.size,
        0,
      ),
      uniqueSfcFiles: components.length,
      props: components.reduce((sum, doc) => sum + doc.props.length, 0),
      events: components.reduce((sum, doc) => sum + doc.events.length, 0),
      slots: components.reduce((sum, doc) => sum + doc.slots.length, 0),
      diagnostics: diagnostics.length,
    },
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const docs = buildComponentDocs();
  writeFileSync(
    resolve("apps/docs/app/data/component-docs.json"),
    JSON.stringify(docs, null, 2) + "\n",
  );
  console.log(JSON.stringify(docs.summary, null, 2));
  const unresolved = docs.diagnostics.filter(
    (item) =>
      item.code.startsWith("unresolved") ||
      item.code === "unmapped-composition" ||
      item.code === "sfc-parse",
  );
  if (unresolved.length) {
    console.error(JSON.stringify(unresolved, null, 2));
    process.exitCode = 1;
  }
}

# orvui development

orvui is a Vue 3.5 component library with a Vue 3.6 RC development Beta. The active contract is in `design.md`; the product catalog and public API compatibility baseline live in `tools/catalog/`.

- Preserve the existing geometry, motion, 11 palette values and semantic CSS override behavior. Generate CSS with `pnpm theme:build`.
- Implement internals independently against the frozen public behavior contract. Preserve actual implementation provenance and applicable copyright and license notices with the code and assets that use them.
- Components live in `packages/vue/src/{motion,blocks,agents,charts}/<slug>/`. Keep `index.ts` as the public barrel, implementations and types in `src/`, existing standalone CSS in `styles/`, the primary `demo.vue` at the component root, and registered variant demos in `examples/`. Put demo-only helpers in `examples/internal/` so they are not discovered as variants. Do not create empty directories or extract existing SFC styles merely to fill a folder.
- Keep single-component tests beside the component in `tests/`; cross-component, documentation, distribution and SSR/hydration integration tests and frozen fixtures stay in the root `tests/`. Exclude colocated tests from package files, declarations, registry payloads, source panels and Tailwind scanning. Preserve the frozen contract fixtures when moving implementation files.
- Public APIs use Composition API, `modelValue`/`update:modelValue`, `open`/`update:open`, slots and provide/inject. Optional controlled Boolean props default explicitly to `undefined`.
- Motion uses `whilePress`; normalize refs with `resolveElement`, use CSS units, per-instance IDs, shared springs and the overlay stack, and release all resources on unmount. Support reduced motion and SSR/hydration.
- Package exports and the copy-source registry use the same source. Follow all relative dependencies and preserve real third-party notices, including the separate Paper Design shader license and font OFL.
- Run `pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm exec tsx tools/registry/build.ts --strict`. Declaration emission, browser behavior, visual acceptance, SSR, hydration and real package/registry consumption are separate checks.
- Builds and tests must be self-contained within this project. Generated coverage reports belong in `artifacts/reports/`; local package archives belong in `artifacts/packages/<version>/`.
- Web only. Components support Vue and Nuxt projects through explicit imports. No npm publication, push or deployment is authorized by local commands.

## Git 提交规范

遵循 [Conventional Commits 1.0.0](https://www.conventionalcommits.org/zh-hans/v1.0.0/)。

- 使用 `<type>(<scope>): <中文简述>`，范围可以省略。类型和范围使用小写英文，冒号后保留一个空格。范围采用实际组件或子系统名称，如 `table`、`charts`、`docs`、`brand`。
- 新功能使用 `feat`，缺陷修复使用 `fix`。其他类型按实际改动选择：`docs`（文档）、`refactor`（不改变行为的重构）、`perf`（性能）、`test`（测试）、`build`（构建及依赖）、`ci`（持续集成）、`style`（仅代码格式）、`chore`（其他维护）、`revert`（还原）。界面样式或交互变化不能仅因涉及 CSS 就使用 `style`。
- 一次提交只表达一个完整目的。源码、对应回归测试和受影响的生成注册表一起提交；依赖、锁文件及脚本随所属功能提交。无关改动分开，保证中间提交具备所需依赖。
- 标题直接说明具体变化，例如 `fix(table): 修正筛选后的虚拟行引用`。避免使用“全面优化”“完善相关功能”“更新代码”等空泛描述，标题末尾不加句号。
- 简单提交只写标题。复杂提交在空行后用简短正文说明原因及行为变化；需要引用问题时使用真实的 `Refs:` 或 `Fixes:` 脚注。不要将执行日志、文件清单或未验证的测试结论填入正文。
- 提交说明不添加表情、Markdown 标题、固定总结模板或自动生成署名。保留真实贡献署名、实现来源、版权和许可证声明，不因整理文案改变实际归属。
- 不兼容变更使用 `!` 或大写 `BREAKING CHANGE:` 脚注标记，并说明影响和迁移方式。不要为内部文件迁移或普通修复添加破坏性变更标记。
- 提交前逐项检查暂存差异，确认提交范围和说明一致。不得混入无关修改、缓存、生成报告、浏览器产物或本地包归档，不默认暂存全部工作区。
- 重写历史前备份原始引用和未提交改动，在独立分支完成整理；保留真实作者和原作者时间，提交者时间使用实际操作时间，不伪造开发顺序或验证结果。已共享历史的重写需要明确授权。
- 本地提交和历史整理不代表远程同步。推送、强制推送、npm 发布和部署仍需用户明确授权。

# 参与 orvui 开发

使用根目录 `package.json` 指定的 pnpm 版本。运行 `pnpm install` 和 `pnpm dev` 启动文档站，检查终端显示的实际地址。

## 工作区

| 目录           | 职责                                           |
| -------------- | ---------------------------------------------- |
| `packages/vue` | `@orvui/vue` 组件源码、样式、声明与组件包      |
| `apps/docs`    | 中文和英文文档、交互演示及可下载资源           |
| `tools`        | 产品目录、主题和文档生成、源码注册表及消费验证 |

## 组件目录

组件放在 `packages/vue/src/{motion,blocks,agents,charts}/<slug>/`。保留四类目录和组件安装名称。

```text
<slug>/
├── index.ts          公共入口，直接导出实现与类型
├── src/              Vue 实现、类型、组合函数和内部工具
├── styles/           已有独立 CSS，按需存在
├── demo.vue          主演示
├── examples/         已注册的变体演示
│   └── internal/     仅供演示使用的辅助文件，按需存在
├── tests/            单组件测试，按需存在
└── LICENSE.*         适用的第三方许可证，按需存在
```

演示通过组件公共入口导入公开组件。实现内部使用可移植的相对依赖；跨组件引用公开入口，共享内部模块继续使用原有位置。不要为了填满目录抽离 SFC 样式、创建空文件夹或复制第二份实现。公共类型与实现放在同一个 `src/` 中，经 `index.ts` 导出。内部路径不是推荐的消费入口。

产品目录、路由和注册示例由 `tools/catalog/components.json` 管理。只有注册变体放在 `examples/*.vue`；演示辅助文件放入 `examples/internal/`，避免被误认为独立示例。修改内容后运行 `pnpm metadata:docs`，同步 API、使用代码和注册表。

## 行为与样式

以 `design.md` 为准，保留现有尺寸、动效、11 套配色及语义 CSS 覆盖行为。通过 `pnpm theme:build` 生成主题 CSS。沿用 Composition API、受控属性和事件约定；可选受控 Boolean 显式默认为 `undefined`。保持减少动态效果、键盘操作、SSR/hydration 与卸载清理。

保留实际实现和资源对应的版权声明。组件根目录的许可证随源码依赖复制，Paper Design Shader 的独立许可证和字体 OFL 不得省略。

## 测试与检查

单组件测试放在组件旁的 `tests/*.test.ts`，通过公共入口测试行为；内部算法测试可以引用 `../src/`。跨组件、文档、分发及 SSR/hydration 集成测试保留在根目录 `tests/`。迁移测试时保留全部原有断言。冻结 API、组件行为及声明夹具是兼容基线，不得因目录迁移重新生成。

```sh
pnpm metadata:docs
pnpm typecheck
pnpm api:check
pnpm test
pnpm build
pnpm exec tsx tools/registry/build.ts --strict
pnpm theme:check
```

可以使用 `pnpm exec vitest run packages/vue/src/motion/button/tests` 检查单组件。组件测试必须从声明、发布源文件、注册表、文档源码面板和 Tailwind 扫描中排除。测试、构建、浏览器交互、视觉比较和真实消费是独立的验收层次。

`pnpm build` 会生成文档元数据、组件库与类型声明，再构建文档站和下载资源。`pnpm theme:build` 根据配色约定生成 CSS，`pnpm theme:check` 检查生成结果是否一致。

## 分发与消费验证

在仓库根目录打包，`prepack` 会自动构建组件库、声明、主题和源码注册表：

```sh
pnpm --filter @orvui/vue pack --pack-destination "$PWD/artifacts/packages/0.1.0"
```

`pnpm package:build` 只构建分发内容，不生成归档。本地归档放在 `artifacts/packages/<version>/`，生成报告放在 `artifacts/reports/`，两者都不提交到 Git。

打包后分别检查包消费、使用代码和实际 shadcn-vue CLI 安装：

```sh
node tools/verify-distribution.mjs
node tools/verify-public-usage.mjs
node tools/verify-registry-usage.mjs
node tools/verify-component-install.mjs
```

验证脚本会创建隔离的临时项目，默认将证据写入系统临时目录下的 `orvui-verification`。使用 `ORVUI_VERIFICATION_DIR` 指定输出目录；`--archive /absolute/path.tgz`、`ORVUI_PACKAGE_ARCHIVE` 或 `ORVUI_USAGE_PACKAGE` 可选择归档，否则使用当前版本目录中的默认归档。已有 `IUI_` 环境变量别名继续兼容。两个源码安装验证脚本会启动本地注册表并调用真实 CLI。

设置 `ORVUI_PREVIOUS_REGISTRY_DIRECTORY` 后，单组件安装验证还会从指定的旧注册表安装 Button，再更新到当前源码结构，检查类型、构建及使用者文件保留情况。更新源码时不要自动删除使用者目录中的旧文件或自定义内容。

源码与包必须来自同一份实现。生成的注册表和 API 覆盖报告位于 `artifacts/reports/`。验证辅助模块位于 `tools/verification/`，可以独立运行其检查：

```sh
node --test tools/verification/metadata.test.mjs
```

## 项目约定的来源

- `tools/catalog/components.json`：schema version 2 产品目录、路由、公共入口和注册示例
- `tools/catalog/public-api.json`：冻结的包及组件导出名称与种类
- `tools/catalog/component-contract.json`：冻结的 props、事件、slots 和受控 Boolean 默认值
- `packages/vue/src/theme/palettes.ts`：11 套配色和语义覆盖关系
- `design.md`：视觉、行为和兼容要求

## 文档托管

Netlify 使用根目录 `netlify.toml`，执行 `pnpm build`，发布目录为 `apps/docs/.vitepress/dist`。文档与源码注册表使用 `https://orvui.efu.me`；注册表通过 HTTPS 提供组件级源码安装，入口为 `/r/registry.json`。中英文安装指南分别位于 `/docs/installation` 和 `/en/docs/installation`。

所有开发工作和验证均在本项目内自包含完成。发布 npm、推送代码或部署需要另行明确授权。

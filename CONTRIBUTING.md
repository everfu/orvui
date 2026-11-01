# 参与 orvui 开发

使用根目录 `package.json` 指定的 pnpm 版本。运行 `pnpm install` 和 `pnpm docs:dev` 启动文档站，检查终端显示的实际地址。

## 工作区

| 目录           | 职责                                           |
| -------------- | ---------------------------------------------- |
| `packages/vue` | `@orvui/vue` 组件源码、样式、声明与组件包      |
| `apps/docs`    | 中文和英文文档、交互演示、生成脚本及可下载资源           |
| `tools`        | 产品目录、主题生成、源码注册表及共享分发工具 |

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

产品目录、路由和注册示例由 `tools/catalog/components.json` 管理。只有注册变体放在 `examples/*.vue`；演示辅助文件放入 `examples/internal/`，避免被误认为独立示例。新增组件或修改 API、演示导入及生成资源来源后运行 `pnpm docs:resources`，同步主题、API、使用代码、注册表和文档资源。站点操作直接使用 `pnpm docs:dev`、`pnpm docs:build`、`pnpm docs:preview` 和 `pnpm docs:typecheck` 调用 Nuxt，不执行前置生成；品牌资源单独用 `pnpm brand:sync` 复制。

## 行为与样式

以 `design.md` 为准，保留现有尺寸、动效、11 套配色及语义 CSS 覆盖行为。通过 `pnpm theme:build` 生成主题 CSS。沿用 Composition API、受控属性和事件约定；可选受控 Boolean 显式默认为 `undefined`。保持减少动态效果、键盘操作、SSR/hydration 与卸载清理。

保留实际实现和资源对应的版权声明。组件根目录的许可证随源码依赖复制，Paper Design Shader 的独立许可证和字体 OFL 不得省略。

## 测试与检查

单组件测试放在组件旁的 `tests/*.test.ts`，通过公共入口测试行为；内部算法测试可以引用 `../src/`。根目录 `tests/` 按职责组织：

| 目录 | 内容 |
| --- | --- |
| `contracts/` | 公共 API、组件成员、默认值和配色兼容性 |
| `docs/` | 文档生成、站点控件、路由和文档 SSR/hydration |
| `distribution/` | 注册表、源码依赖、安装导入、类型生成和资源许可证 |
| `runtime/` | 跨组件交互、共享模型和组件 SSR/hydration |
| `e2e/` | 真实浏览器交互 |
| `fixtures/` | 冻结契约和消费类型夹具 |
| `helpers/` | 测试环境辅助代码 |

优先测试可观察行为与实际缺陷。重复场景只保留一处；不为固定文案、内部类名或文件位置添加断言。API、安装命令、稳定锚点与许可证需要对应检查。冻结夹具不得为使测试通过而重新生成。

```sh
pnpm docs:resources
pnpm typecheck
pnpm test
pnpm build
pnpm exec tsx tools/registry/build.ts --strict
```

浏览器测试统一使用一个配置，运行前先启动本项目文档站，并传入实际地址：

```sh
PLAYWRIGHT_BROWSERS_PATH=artifacts/browsers ORVUI_NUXT_URL=http://localhost:3000 pnpm exec playwright test --config apps/docs/playwright.config.ts
```

可追加文件名和 `--project desktop` 运行文档或浮层测试；首页使用 `home-desktop`、`home-tablet`、`home-mobile`，动态效果检查使用 `effects-desktop`、`effects-mobile`。浏览器测试不包含在 `pnpm test` 中。

可以使用 `pnpm exec vitest run packages/vue/src/motion/button/tests` 检查单组件。组件测试必须从声明、发布源文件、注册表、文档源码面板和 Tailwind 扫描中排除。测试、构建、浏览器交互、视觉比较和真实消费是独立的验收层次。

`pnpm build` 先统一生成一次资源，再构建组件库、类型声明和文档站。`pnpm check` 依次运行构建、类型检查和现有测试，不重复生成资源。公共 API 兼容性由现有基线测试检查。`pnpm theme:build` 根据配色约定生成 CSS；需要单独检查主题结果时可运行 `pnpm exec tsx tools/theme/build.ts --check`。

## 本地分发构建

在仓库根目录打包，`prepack` 会自动构建组件库、声明、主题和源码注册表：

```sh
pnpm --filter @orvui/vue pack --pack-destination "$PWD/artifacts/packages/0.1.1"
```

`pnpm package:build` 只构建分发内容，不生成归档。本地归档放在 `artifacts/packages/<version>/`，生成报告放在 `artifacts/reports/`，两者都不提交到 Git。

源码与包必须来自同一份实现。基础检查保留现有分发、SSR/hydration 与兼容性测试，但通过构建不代表已经验证真实消费或浏览器视觉效果。工具职责见 [tools/README.md](./tools/README.md)。

## 项目约定的来源

- `tools/catalog/components.json`：schema version 2 产品目录、路由、公共入口和注册示例
- `tools/catalog/public-api.json`：冻结的包及组件导出名称与种类
- `tools/catalog/component-contract.json`：冻结的 props、事件、slots 和受控 Boolean 默认值
- `packages/vue/src/theme/palettes.ts`：11 套配色和语义覆盖关系
- `design.md`：视觉、行为和兼容要求

## 文档托管

文档仅使用 Nuxt SSR。Netlify 使用根目录 `netlify.toml`，以 `apps/docs` 为基础目录，运行 `pnpm --dir ../.. build`，使用 Nitro netlify preset 生成 `dist` 和 SSR 函数。文档与源码注册表使用 `https://orvui.efu.me`；注册表通过 HTTPS 提供组件级源码安装，入口为 `/r/registry.json`。中英文安装指南分别位于 `/docs/installation` 和 `/en/docs/installation`。

所有开发工作和验证均在本项目内自包含完成。发布 npm、推送代码或部署需要另行明确授权。

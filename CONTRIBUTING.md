# 参与 orvui 开发

使用根目录 `package.json` 指定的 pnpm 版本。运行 `pnpm install` 和 `pnpm dev` 启动文档站，检查终端显示的实际地址。

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

本地归档放在 `artifacts/packages/<version>/`，生成报告放在 `artifacts/reports/`。打包后按 README 执行包消费和实际 shadcn-vue CLI 安装验证；源码与包必须来自同一份实现。已有源码安装更新时，使用 CLI 覆盖公共入口和依赖文件；不要自动删除使用者目录中的旧文件或自定义内容。

所有开发工作和验证均在本项目内自包含完成。发布 npm、推送代码或部署需要另行明确授权。

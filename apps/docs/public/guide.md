# 介绍

为 Vue 构建自然、生动且易于定制的用户界面。


orvui 是一个基于 Vue 3.5、Composition API 和 TypeScript 的开源组件库。组件包含交互动效、语义主题和状态绑定，可安装组件包，也可按需复制完整源码。

<a id="state"></a>

<a id="why-orvui"></a>

## 为什么选择 orvui？

- **开箱即用的细节** — 从按钮、表单到数据图表，组件共享字体、间距与十一套配色。先接入产品，再调整需要的部分。

- **交互自带动效** — 按压、布局变化与弹层过渡服务于交互反馈，并响应减少动态效果的系统偏好。

- **按 Vue 的方式组合** — 通过 v-model、插槽、子组件和组合式 API 连接状态。类型声明与组件页 API 帮助你了解每个接口。

- **保留定制空间** — 使用语义 CSS 变量调整主题，通过组件属性与插槽改变内容；需要修改内部实现时，可以复制单个组件源码。

- **键盘与服务端场景** — 表单和浮层提供键盘操作、焦点管理及相应语义。组件覆盖 SSR 与水合场景，具体交互和限制见各页说明。

- **为 AI 工作流提供上下文** — 通过 MCP、Agent Skills 与 Markdown 文档读取真实导入、状态绑定、示例和许可，帮助助手使用现有组件。

<a id="import-components"></a>

<a id="copy-source"></a>

<a id="installation"></a>

## 选择适合你的接入方式

组件包和复制源码使用相同的公共 API。按维护方式选择入口，完整配置集中在快速开始。

- [安装组件包](https://orvui.efu.me/docs/installation#package): 使用预构建入口与完整样式，显式导入需要的组件。
- [复制组件源码](https://orvui.efu.me/docs/installation#source-setup): 通过 shadcn-vue 按组件安装，将实现与相对依赖放入自己的项目。
<a id="nuxt"></a>

<a id="ecosystem"></a>

## 围绕组件的工具与资源

- [Vue 与 Nuxt](https://orvui.efu.me/docs/installation#package): 在 Vue 应用中导入组件与样式；Nuxt 在 css 配置中加载样式，组件仍显式导入。
- [主题与动效](https://orvui.efu.me/docs/theme): 选择配色、切换明暗模式，并使用语义变量和共享动效约定。
- [MCP Server](https://orvui.efu.me/docs/mcp-server): 让开发工具查询组件 API、示例、源码与主题变量。
- [Agent Skills](https://orvui.efu.me/docs/agent-skills): 为编程助手安装可按需读取的组件说明与使用约定。
- [组件目录](https://orvui.efu.me/components): 按使用场景浏览交互、组合模块、AI 组件和图表。
- [应用模板](https://orvui.efu.me/templates): 体验 Dashboard、Mail、Chat、Finances 与 CRM 的独立演示。
<a id="faq"></a>

## 常见问题

### 可以免费用于商业项目吗？

orvui 以 MIT 许可提供。使用和分发时保留版权、LICENSE 和 NOTICE；独立 Shader 与字体资源遵循各自许可，详见许可清单。

### 需要安装 Tailwind CSS 吗？

组件包包含预编译样式，无需额外配置 Tailwind。复制源码需要 Tailwind CSS 4，并按快速开始配置样式与路径。

### 支持 Vue、Nuxt 和 TypeScript 吗？

支持 Vue 与 Nuxt 显式导入，提供 TypeScript 声明。Nuxt 在 nuxt.config.ts 中加载组件包样式；涉及浏览器能力的场景，请同时阅读组件的 SSR 说明。

### 如何试用 Vue 3.6？

使用页眉版本菜单切换到 Beta，并按对应快速开始安装本地归档和锁定 Vue RC 依赖。当前支持常规虚拟 DOM 渲染，尚未启用 Vapor 编译。

<a id="attribution"></a>

## 参与项目

在 [GitHub](https://github.com/everfu/orvui) 查看源码、报告问题或贡献改进。复制和分发组件时，保留实现中的版权与适用许可。

- [源码与问题反馈](https://github.com/everfu/orvui): 提供复现步骤、版本和预期行为，帮助定位问题。
- [版权与许可](https://orvui.efu.me/licenses/orvui-NOTICE.txt): 查阅组件、Shader 与字体资源的来源和许可说明。
## 下一步

- [快速开始](/docs/installation)


© 2026 everfu · orvui · 版权和第三方许可见 [LICENSE](/licenses/MIT.txt) 与 [NOTICE](/licenses/orvui-NOTICE.txt)。

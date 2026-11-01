# AGENTS.md · Preview

为使用 orvui 的项目添加清晰的组件选用、安装与验证约定。

> 产品版本: 0.2.0-beta.1

<a id="add-to-project"></a>

## 添加到项目

下载[AGENTS.md](/orvui-agent/AGENTS.md)，阅读后将相关段落合并到项目已有规则中，保留团队自己的约束。

在项目根目录保存为标准文件名，与下方提示词和文件内引用保持一致。如果已有同名文件，请先打开上面的下载链接，合并需要的内容。

```bash
curl -fsSL https://orvui.efu.me/orvui-agent/AGENTS.md -o AGENTS.md
```

<a id="usage"></a>

## 连接到编码助手

AGENTS.md 记录如何使用组件，[DESIGN.md](/beta/docs/design-md) 记录外观与交互。将设计文件保存为 DESIGN.md 后，在已有项目规则中引用。各助手对规则文件的发现方式不同，也可在提示词中显式说明。

```text
使用 orvui 实现这个界面。遵循项目 AGENTS.md，并读取 DESIGN.md 中的视觉与交互约定。
```

<a id="included"></a>

## 包含内容

组件选用、两种安装方式、Vue/Nuxt 显式导入、真实状态绑定、验证和许可约定。这里是消费项目指引，不包含 orvui 仓库的内部维护流程。

<a id="preview"></a>

## 文件预览

```markdown
# orvui AGENTS.md

产品版本: 0.2.0-beta.1

将需要的段落合并到项目已有的 AGENTS.md 或助手规则中，保留项目本身的约束。

## 选用组件

先读取 [文档索引](https://orvui.efu.me/llms.txt)，再查阅所需组件的 API、示例和版本。优先组合现有组件。

```bash
npx skills add everfu/orvui --skill orvui
```

技能包的 references/index.md 指向完整双语参考。也可通过 [MCP](https://orvui.efu.me/docs/mcp-server) 查询当前部署版本的文档和完整源码。核对其版本与项目版本。

## 安装与导入

根据项目选择一种 [安装方式](https://orvui.efu.me/docs/installation)，避免无意混用组件包和复制源码。Vue 与 Nuxt 均使用显式公开导入。

- 组件包：安装 @orvui/vue，全局加载一次 @orvui/vue/style.css；Nuxt 在 nuxt.config.ts 的 css 中配置样式。
- 复制源码：使用注册表中的真实安装 slug，检查完整文件与依赖。示例：npx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/button.json。源码方式需要 Tailwind CSS 4。

## 使用真实 API

- 仅在组件暴露对应配对时使用 modelValue/update:modelValue 或 open/update:open；不要为仅通过插槽组合的组件发明状态绑定。
- 可选受控 Boolean 属性保持 undefined 默认值。根据文档使用插槽与 provide/inject，不访问组件内部实现。
- 应用提供真实的数据、服务、权限和持久化；示例交互不代表已完成后端接入。

## 视觉与验证

遵循 [DESIGN.md](./DESIGN.md) 中的视觉与交互约定。保留组件几何、语义主题覆盖和动效。

运行消费项目自身的类型检查与相关测试；分别验证键盘与焦点、减少动态效果、移动布局，以及 Nuxt 的 SSR/hydration。报告实际通过的检查。

## 来源与许可

保留使用的代码和资产的真实来源、版权及适用许可，包括 Paper Design shader 与字体 OFL。参阅 [LICENSE](https://orvui.efu.me/licenses/MIT.txt) 与 [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)。

```

## 下一步

- [DESIGN.md](/beta/docs/design-md)
- [Agent Skills](/beta/docs/agent-skills)


© 2026 everfu · orvui · 版权和第三方许可见 [LICENSE](/licenses/MIT.txt) 与 [NOTICE](/licenses/orvui-NOTICE.txt)。

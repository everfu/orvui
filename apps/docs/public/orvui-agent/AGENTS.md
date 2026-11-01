# orvui AGENTS.md

产品版本: 0.1.1

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
- 复制源码：使用注册表中的真实安装 slug，检查完整文件与依赖。示例：npx shadcn-vue@2.8.2 add https://orvui.efu.me/r/button.json。源码方式需要 Tailwind CSS 4。

## 使用真实 API

- 仅在组件暴露对应配对时使用 modelValue/update:modelValue 或 open/update:open；不要为仅通过插槽组合的组件发明状态绑定。
- 可选受控 Boolean 属性保持 undefined 默认值。根据文档使用插槽与 provide/inject，不访问组件内部实现。
- 应用提供真实的数据、服务、权限和持久化；示例交互不代表已完成后端接入。

## 视觉与验证

遵循 [DESIGN.md](./DESIGN.md) 中的视觉与交互约定。保留组件几何、语义主题覆盖和动效。

运行消费项目自身的类型检查与相关测试；分别验证键盘与焦点、减少动态效果、移动布局，以及 Nuxt 的 SSR/hydration。报告实际通过的检查。

## 来源与许可

保留使用的代码和资产的真实来源、版权及适用许可，包括 Paper Design shader 与字体 OFL。参阅 [LICENSE](https://orvui.efu.me/licenses/MIT.txt) 与 [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)。

# Vue Web 简介

使用 Vue 3.5 Composition API 构建带有原始几何与交互动效的 Web 界面。通过组件包或完整源码，将现成组件接入你的 Vue 项目。


<a id="installation"></a>

## 开始安装

按照[Web 安装指南](/docs/installation)选择本地组件包或 shadcn-vue。组件包尚未发布到 npm；指南提供实际可用的本地打包步骤。

<a id="import-components"></a>

## 导入组件

组件页的“组件包”用法从 @orvui/vue 按需入口导入；“复制源码”用法从应用内的 @/components/orvui/ 路径导入。参见[组件包安装](/docs/installation#package)与[源码配置](/docs/installation#source-setup)。

<a id="copy-source"></a>

## 拥有组件源码

源码安装项包含组件、相对依赖、主题与许可。使用[shadcn-vue](/docs/installation#shadcn-vue)将完整实现安装到项目内，再按需编辑。

<a id="state"></a>

## 状态与组合

表单使用 v-model，弹层使用 v-model:open。组件的默认状态、插槽与组合式子组件以每页 API 为准；从[组件目录](/components/motion)选择所需控件。

<a id="nuxt"></a>

## SSR 与 Nuxt

组件以 SSR 安全为目标设计；SSR、hydration、浏览器行为与视觉验收分别验证。Nuxt 专用模块与自动导入暂缓，不属于当前安装流程。

<a id="attribution"></a>

## 来源与许可

复制组件时保留 MIT 与 NOTICE；Shader 等内容保留其独立许可。阅读[NOTICE](/licenses/orvui-NOTICE.txt)和[Paper Design 许可](/licenses/paper-design-PolyForm-Shield.txt)。


© 2026 everfu · orvui · 版权和第三方许可见 [LICENSE](/licenses/MIT.txt) 与 [NOTICE](/licenses/orvui-NOTICE.txt)。

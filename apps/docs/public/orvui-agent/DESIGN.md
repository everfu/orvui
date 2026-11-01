# orvui DESIGN.md

产品版本: 0.1.1

让生成的界面沿用 orvui 的视觉语言。请从 AGENTS.md、编辑器规则或提示词引用本文件；不要假定助手会自动发现 DESIGN.md。

## 语义主题

使用 bg-background、text-foreground、bg-card、border-border 与 ring-ring 等语义工具类及对应 CSS 变量。明暗模式和配色由主题控制，不为每个页面硬编码颜色。参阅 [主题配置](https://orvui.efu.me/docs/theme)。

配色: `default`, `violet`, `blue`, `green`, `amber`, `blood-orange`, `rose`, `red`, `teal`, `indigo`, `lime`.

以下默认主题值直接来自组件库，用于交接与核对。实现时引用语义变量；项目定制主题后，应同步本文件。

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `--background` | `oklch(99% 0 0)` | `#151515` |
| `--foreground` | `oklch(15% 0 0)` | `oklch(96% 0 0)` |
| `--card` | `oklch(97% 0 0)` | `#1c1c1c` |
| `--card-foreground` | `oklch(15% 0 0)` | `oklch(96% 0 0)` |
| `--popover` | `oklch(97% 0 0)` | `#1c1c1c` |
| `--popover-foreground` | `oklch(15% 0 0)` | `oklch(96% 0 0)` |
| `--primary` | `#0285f7` | `#0285f7` |
| `--primary-foreground` | `#ffffff` | `#ffffff` |
| `--muted` | `oklch(97% 0 0)` | `#1c1c1c` |
| `--muted-foreground` | `oklch(50% 0 0)` | `oklch(62% 0 0)` |
| `--border` | `oklch(15% 0 0 / 0.06)` | `rgb(255 255 255 / 0.05)` |
| `--ring` | `oklch(15% 0 0 / 0.12)` | `rgb(255 255 255 / 0.1)` |

## 布局与层次

- 保留所选组件的字体、间距、圆角、边框和阴影，通过公开属性和插槽组合布局，不统一重设所有组件尺寸。
- 默认主题字体映射为 Geist 与 Geist Mono；沿用应用字体配置，保持文字层次和代码可读性。
- 用内容顺序、留白和表面层级区分信息，将主色留给主要操作、选中和焦点状态。窄屏重新排布内容，避免整体缩小界面。

## 组合与动效

- 优先使用 orvui 的公开组件及其组合部件，遵循各组件真实状态绑定。保持现有几何、弹簧和过渡，避免重复包装导致双重动画。
- 自定义交互沿用共享弹簧与 whilePress；处理 prefers-reduced-motion，减少位移和过冲，保留可理解的状态反馈。参阅 [动效指南](https://orvui.efu.me/docs/motion-patterns)。

## 可访问性与服务端渲染

- 保留键盘操作、可见焦点、可访问名称、禁用与验证反馈，以及弹层的焦点管理和关闭方式。
- 明暗主题均检查文本、边框和焦点对比度。交互目标适合触摸；内容和代码不应撑破移动视口。
- Vue/Nuxt 使用确定的初始状态和实例级 ID；浏览器资源在挂载后创建，并在卸载时释放，避免 hydration 不一致。

## 来源与许可

保留使用的代码和资产的真实来源、版权及适用许可，包括 Paper Design shader 与字体 OFL。参阅 [LICENSE](https://orvui.efu.me/licenses/MIT.txt) 与 [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)。

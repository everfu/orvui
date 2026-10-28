# 导航栏右上角及展开交互验收

日期：2026-10-28。范围：文档站私有搜索、主题、明暗模式、语言与 GitHub 控件。参考：https://heroui.com/cn 。按确认方案保留 orvui 品牌、Geist 字体、11 套原始配色、复制 CSS、文档索引和手机 BottomSheet。

## 视觉证据

证据目录：`artifacts/reports/heroui-header/`。

- source visual truth：`reference-desktop-header.png`、`reference-desktop-theme.png`、`reference-desktop-language.png`、`reference-desktop-search.png`，均为 1440×1000 CSS px / 1440×1000 像素、DPR 1。
- 手机 source visual truth：`reference-mobile-theme-full.png`，390×844 CSS px / 390×844 像素、DPR 1。
- implementation screenshots：`desktop-header-default.png`、`desktop-theme-default.png`、`desktop-language.png`、`desktop-search.png`，1440×1000、DPR 1；对应 `mobile-*.png` 为 390×844、DPR 1。
- 深浅色、中英文：`desktop-header-light.png`、`desktop-header-english.png`、`mobile-header-light.png`、`mobile-header-english.png`。
- 全部截图均来自实际浏览器。上述最终证据以显式截图区域或项目浏览器测试保存，不使用早期带缩放的截图；最终比较仅裁切目标区域并并排放置，不拉伸内容。
- 完整控件区域与浮层对照：`final-comparison-header.png`、`final-comparison-theme.png`、`final-comparison-language.png`、`final-comparison-search.png`。手机完整面板对照：`final-comparison-mobile-theme.png`。原始全视口画面同时保留；页面主体内容的差异不属于此次复刻范围。
- 同一比较输入同时包含参考与实现。以上裁切已覆盖整个控件组、全部色球、浮层边界及搜索结果，因此无需再放大局部图标才能判断尺寸和排版。

## 发现、修复与复查

1. 首轮搜索选中行与面板背景过于接近。改用语义前景与面板背景混色，使选中行及 ESC 提示清晰可见，导航胶囊同步提高表面对比度。最终 `final-comparison-search.png`、`final-comparison-header.png` 已复查。
2. [P2，已修复] 高窗口下搜索面板垂直位置与参考不符。参考 DOM 的实际规则是桌面 `calc(50% - 250px)`，手机为顶部 16px。旧对照保存在 `comparison-search-before-placement-fix.png`；实现调整为桌面 `max(16px, calc(50dvh - 250px))`、768px 以下 16px，采用 12px 圆角。最终同视口截图已重新对照，浏览器测试直接断言位置及圆角。
3. [P1，已修复] 动画门户延迟挂载时语言面板可能保持隐藏；减少动态效果时主题面板可能未成功接收焦点。增加挂载后定位及受生命周期约束的焦点重试，并验证关闭/卸载时取消待执行帧。延迟挂载、延迟可见与快速重开均有回归覆盖。
4. [P1，已修复] 触屏不一定自动聚焦按钮，导致语言菜单内 Escape 可能作用于父 BottomSheet。点按时显式聚焦语言入口，菜单先处理自身 Escape；手机浏览器已验证当前语言焦点、关闭菜单后的焦点恢复及父菜单保留。

## 五项外观检查

- 字体与排版：保留项目 Geist 字体；检查 12px 控件文字、14px 语言/结果文字、18px 桌面搜索输入和手机 16px 输入；中英文无裁切，长结果允许自然换行。
- 间距与布局：32–34px 控件、6px 组间距、26px 外观选项；主题 248px/24px 圆角，语言 220px/24px 圆角；弹层距触发器 8px，并在视口内避让。桌面和手机均无水平溢出。
- 颜色与语义状态：深浅色、选中/悬停/焦点、色球选中环和搜索高亮可辨识；原有 11 套配色值与 CSS 导出未改动。
- 图标与资产：使用已有 Lucide 图标；GitHub 使用 `@iconify-json/simple-icons@1.2.100` 的品牌图标，CC0 来源和内容哈希记录在 `icon-provenance.json`，现有许可文件保留。没有热链接参考站资产。
- 内容：保留真实 orvui 指南、仓库和功能。GitHub 的 `1.2k` 仅是浏览器测试的模拟数据；真实预览在公开统计不可用时显示 `GitHub`，不会把参考站星数或测试数字作为实际数据。

## 已确认的差异

- 保留 orvui 品牌、字体与色板值；参考站的配色名称不进入项目。
- 主题面板保留复制 CSS，未增加鲜艳模式和主题编辑器，因此底部与总高度按功能内容自然缩短。
- 搜索使用 orvui 的五个指南和组件索引，不显示网页/移动端产品分类；面板内容高度相应变化。
- 手机入口保留项目现有菜单图标与 BottomSheet；语言、外观和 GitHub 收入其中。
- 沿用项目页面边距及主题语义，不改动公共组件预览。

## 检查结果

- `pnpm typecheck`：通过，见 `artifacts/reports/heroui-header-typecheck-final.log`。
- `pnpm test --maxWorkers=1`：97 个文件、1573 项测试通过，见 `artifacts/reports/heroui-header-tests-final.log`。
- `pnpm build`：生产构建及组件声明生成通过，见 `artifacts/reports/heroui-header-build-final.log`。
- `pnpm exec tsx tools/registry/build.ts --strict`：通过，109/109 组件、154 安装项、72/72 变体，见 `artifacts/reports/heroui-header-registry.log`。
- 生产预览浏览器验收：桌面与手机 20 项通过，见 `artifacts/reports/heroui-header-browser-final.log`。最终 CSS 定位修改后，包含深浅色、中英文截图及定位断言的导航专项在两个视口再次通过，见 `artifacts/reports/heroui-header-browser-focused.log`。
- 验证搜索快捷键、默认项、空结果、结果导航、色板键盘选择、CSS 复制、快速重开、Escape、焦点恢复、语言切换保留查询和锚点、手机嵌套菜单及浅色模式跨页面导航。浏览器检查同时监测控制台异常和 SSR 水合警告，以上通过流程均无未预期错误。
- GitHub 成功、无效响应、失败、超时与卸载中断由本地模拟验证，测试和构建均不依赖外网成功响应。
- 本次未做 npm 发布、推送、部署，也未把浏览器/构建通过等同于新的真实包消费验证。

没有未解决的 P0/P1/P2 外观或交互问题；以上确认差异属于实现范围约定。

final result: passed

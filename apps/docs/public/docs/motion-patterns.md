# 用动效解释，而非干扰

这是一份实用指南，帮助判断何时应当产生位移、选择合适的令牌，并交付快速、一致且可访问的动效。

> 产品版本: 0.1.0

## 动起来之前的四个问题

### 01. 先说明变化

指出用户刚刚操作的对象，以及操作后需要看见的位置或状态。

用连续的位置关系帮助理解，避免无关元素一起移动。

### 02. 控制等待

高频控件立即响应。弹层可以解释来源，但不应阻塞用户继续输入。

反复切换时也要支持中断，不能等待上一段动画播完。

### 03. 保持物理连续

同一个对象移动或变形时，共享布局和弹簧用于衔接当前位置与新目标。

进度条使用线性时间；手势从释放时的位置和速度继续。

### 04. 提供静态路径

减少动态效果时仍需显示状态、焦点和操作结果，移除装饰性的位移与循环。

不要让可访问性设置改变功能或键盘操作。

## 动效令牌

- EASE_OUT: [0.16, 1, 0.3, 1]
- EASE_IN_OUT: [0.77, 0, 0.175, 1]
- SPRING_PRESS: 可按压表面的快速、有分量反馈。
- SPRING_LAYOUT: 共享表面与指示器的持续空间运动。

## 时长

| 交互 | 范围 | 期望感受 |
| --- | --- | --- |
| 按钮按压 | 立即响应 | 跟随输入 |
| 提示和菜单 | 120–180ms | 快速到位 |
| 内容替换 | 180–240ms | 保留上下文 |
| 抽屉与对话框 | 200–300ms | 交代空间关系 |
| 拖动和滚动 | 由手势决定 | 连续、可中断 |

界面动效默认控制在 300ms 以内。更长的动效适合解释性演示、有意图的手势和大范围空间变化。

## 可以复制的模式

### 按压反馈

让可按压表面在指针按下时轻微收缩，松开后回到原位。

**目的:** 在异步结果返回前确认操作已被接收。

**避免:** 把按压反馈绑定到操作完成，或把位移放大。

```vue
<motion.button :while-press="reduce ? undefined : { scale: 0.97 }" :transition="SPRING_PRESS">Continue</motion.button>
```

### 图标响应

按操作含义选择短暂运动，并让键盘聚焦获得同等反馈。

**目的:** 让用户更容易辨认刚刚操作的控件。

**避免:** 所有图标都播放同一个循环，或把反馈只给鼠标用户。

```vue
<motion.span :animate="active && !reduce ? { rotate: [0, 10, -6, 0] } : { rotate: 0 }" :transition="{ duration: 0.24 }"><Bell /></motion.span>
```

### 新内容出现

先让整体表面出现，再呈现内容，避免读者追逐多个运动目标。

**目的:** 说明哪些内容是刚刚加入的。

**避免:** 对整个页面逐字逐项编排，延迟用户阅读。

```vue
<motion.section :initial="{ opacity: 0, y: reduce ? 0 : 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.2 }"><slot /></motion.section>
```

### 表面展开

触发器与展开区域属于同一个对象时，用共享布局保留这条联系。

**目的:** 在不同尺寸之间保留对象身份。

**避免:** 缩放长段文字，或在容器到位前显示全部内容。

```vue
<motion.div layout :transition="CONTINUITY_SPRING"><button @click="open = !open">Toggle</button><div v-if="open">Panel content</div></motion.div>
```

### 视图切换

保持外层布局稳定，在内部用短距离和透明度切换两种视图。

**目的:** 说明内容已变化，同时保留操作位置。

**避免:** 让频繁切换的标签页触发整页转场。

```vue
<div class="grid rounded-xl bg-background p-4"><motion.div v-for="current in views" :key="current" class="col-start-1 row-start-1" :aria-hidden="current !== view" :inert="current !== view" :initial="false" :animate="{ opacity: current === view ? 1 : 0 }" :transition="{ duration: reduce ? 0.08 : 0.18 }"><slot :view="current" /></motion.div></div>
```

## 减少动态效果是一种设计状态

不要移除全部过渡。保留有助理解的透明度、颜色和即时状态反馈，移除视差、大幅变换、反复缩放和弹簧过冲。

```ts
const reduce = useReducedMotion();
const start = computed(() => ({ opacity: 0, y: reduce.value ? 0 : 8 }));
const target = { opacity: 1, y: 0 };
```

## 下一步

- [主题设置](/docs/theme)
- [安装指南](/docs/installation)


© 2026 everfu · orvui · 版权和第三方许可见 [LICENSE](/licenses/MIT.txt) 与 [NOTICE](/licenses/orvui-NOTICE.txt)。

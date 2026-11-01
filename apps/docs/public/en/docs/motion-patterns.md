# Motion that explains, not distracts

A practical guide to deciding when something should move, choosing the right token, and shipping motion that stays fast, coherent, and accessible.

> Product version: 0.1.1

## Four questions before motion

### 01. Identify the change

Identify the object the user acted on and the state or destination they need to see next.

Keep motion attached to that relationship; leave unrelated elements still.

### 02. Budget the wait

Frequent controls respond immediately. A panel can explain where it came from without delaying the next input.

Repeated input must interrupt a transition rather than queue behind it.

### 03. Keep movement continuous

For a moving or resizing object, shared layout and springs connect its current position to its next target.

Use linear time for progress; gestures continue from their release position and velocity.

### 04. Provide a steady path

Reduced motion must still communicate state, focus and results while removing decorative travel and repetition.

Accessibility settings must not change functionality or keyboard operation.

## Motion tokens

- EASE_OUT: [0.16, 1, 0.3, 1]
- EASE_IN_OUT: [0.77, 0, 0.175, 1]
- SPRING_PRESS: Fast, weighted feedback for pressable surfaces.
- SPRING_LAYOUT: Continuous spatial movement for shared surfaces and indicators.

## Timing

| Interaction | Range | Desired feel |
| --- | --- | --- |
| Button press | Immediate | Follows input |
| Hints and menus | 120–180ms | Quick to settle |
| Content changes | 180–240ms | Preserves context |
| Drawers and dialogs | 200–300ms | Explains position |
| Dragging and scrolling | Gesture driven | Continuous and interruptible |

Under 300ms is the default for interface motion. Longer motion belongs to explanatory demos, deliberate gestures, and large spatial changes.

## Patterns you can copy

### Press response

Let a pressable surface contract slightly on pointer down and return on release.

**Purpose:** Acknowledge input before an asynchronous result arrives.

**Avoid:** Delaying feedback until completion or using large movement.

```vue
<motion.button :while-press="reduce ? undefined : { scale: 0.97 }" :transition="SPRING_PRESS">Continue</motion.button>
```

### Icon response

Choose a brief movement that suits the action and give keyboard focus equivalent feedback.

**Purpose:** Help users recognize the control they just operated.

**Avoid:** Repeating the same loop on every icon or limiting feedback to the mouse.

```vue
<motion.span :animate="active && !reduce ? { rotate: [0, 10, -6, 0] } : { rotate: 0 }" :transition="{ duration: 0.24 }"><Bell /></motion.span>
```

### New content

Introduce the surface as a unit so readers do not have to follow several moving targets.

**Purpose:** Show which content has just been added.

**Avoid:** Sequencing every item on a page and delaying reading.

```vue
<motion.section :initial="{ opacity: 0, y: reduce ? 0 : 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.2 }"><slot /></motion.section>
```

### Expanding surfaces

Use shared layout when the trigger and expanded region represent the same object.

**Purpose:** Preserve the identity of an object across sizes.

**Avoid:** Scaling long text or showing all content before the container has room.

```vue
<motion.div layout :transition="CONTINUITY_SPRING"><button @click="open = !open">Toggle</button><div v-if="open">Panel content</div></motion.div>
```

### View changes

Keep the outer layout stable and change internal views with a short offset and opacity.

**Purpose:** Show that content changed while keeping controls in place.

**Avoid:** Using a full page transition for a frequently changed tab.

```vue
<div class="grid rounded-xl bg-background p-4"><motion.div v-for="current in views" :key="current" class="col-start-1 row-start-1" :aria-hidden="current !== view" :inert="current !== view" :initial="false" :animate="{ opacity: current === view ? 1 : 0 }" :transition="{ duration: reduce ? 0.08 : 0.18 }"><slot :view="current" /></motion.div></div>
```

## Reduced motion is a designed state

Do not remove every transition. Preserve opacity, color and instant state feedback; remove parallax, large transforms, repeated scale and spring overshoot.

```ts
const reduce = useReducedMotion();
const start = computed(() => ({ opacity: 0, y: reduce.value ? 0 : 8 }));
const target = { opacity: 1, y: 0 };
```

## Next steps

- [Theme setup](/en/docs/theme)
- [Installation](/en/docs/installation)


© 2026 everfu · orvui · See [LICENSE](/licenses/MIT.txt) and [NOTICE](/licenses/orvui-NOTICE.txt) for copyright and third-party licenses.

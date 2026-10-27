<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onMounted,
  ref,
  type VNodeChild,
} from "vue";
import { AnimatePresence } from "motion-v";
import { cn } from "../../../lib/utils";
import ToastItem from "./ToastItem.vue";
import type {
  AnimatedToast,
  ToastClassNames,
  ToastPosition,
  ToastStatus,
} from "./useAnimatedToastStack";
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    toasts: AnimatedToast[];
    position?: ToastPosition;
    placement?: "static" | "fixed" | "absolute";
    fixed?: boolean;
    portal?: boolean;
    portalRoot?: Element | null;
    maxVisible?: number;
    className?: string;
    classNames?: ToastClassNames;
    icons?: Partial<Record<ToastStatus, any>>;
    renderToast?: (toast: AnimatedToast) => VNodeChild;
  }>(),
  { position: "bottom-right", portal: undefined, maxVisible: 4 },
);
const emit = defineEmits<{ dismiss: [id: string] }>(),
  instance = getCurrentInstance(),
  mounted = ref(false);
const placement = computed(
    () => props.placement ?? (props.fixed ? "fixed" : "static"),
  ),
  shouldPortal = computed(() => props.portal ?? placement.value === "fixed"),
  visible = computed(() => props.toasts.slice(-props.maxVisible));
const positions: Record<ToastPosition, string> = {
  "top-left": "left-4 top-4",
  "top-center": "left-1/2 top-4 -translate-x-1/2",
  "top-right": "right-4 top-4",
  "bottom-left": "bottom-6 left-4",
  "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-6 right-4",
};
onMounted(() => {
  mounted.value = true;
});
</script>
<template>
  <Teleport :to="portalRoot ?? 'body'" :disabled="!shouldPortal || !mounted"
    ><ol
      v-bind="$attrs"
      aria-live="polite"
      aria-atomic="false"
      :class="
        cn(
          'pointer-events-none flex w-[calc(100vw-2rem)] max-w-sm gap-2',
          position.startsWith('bottom') ? 'flex-col-reverse' : 'flex-col',
          placement === 'fixed' && 'fixed z-[90]',
          placement === 'absolute' && 'absolute z-20',
          placement !== 'static' && positions[position],
          classNames?.root,
          className,
          $attrs.class,
        )
      "
    >
      <AnimatePresence :initial="false" mode="popLayout"
        ><ToastItem
          v-for="(toast, index) in visible"
          :key="toast.id"
          :toast="toast"
          :index="index"
          :class-names="classNames"
          :icons="icons"
          :can-dismiss="
            toast.dismissible !== false && !!instance?.vnode.props?.onDismiss
          "
          :render-toast="renderToast"
          @dismiss="emit('dismiss', $event)"
          ><template v-if="$slots.toast" #default
            ><slot name="toast" :toast="toast" /></template></ToastItem
      ></AnimatePresence></ol
  ></Teleport>
</template>

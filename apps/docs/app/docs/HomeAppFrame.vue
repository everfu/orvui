<script setup lang="ts">
import { ref, type Component } from "vue";
import { CircleHelp, LogOut } from "lucide-vue-next";
import {
  AnimatedSidebarProvider,
  AnimatedSidebar,
  AnimatedSidebarHeader,
  AnimatedSidebarContent,
  AnimatedSidebarFooter,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuItem,
  AnimatedSidebarMenuButton,
  AnimatedSidebarTrigger,
} from "../../../../packages/vue/src/motion/animated-sidebar";
import {
  AnimatedToastStack,
  useAnimatedToastStack,
} from "../../../../packages/vue/src/motion/animated-toast-stack";
import { useSiteShell } from "./site-shell-state";

export interface HomeNavItem {
  id: string;
  label: string;
  icon: Component;
  group?: string;
  badge?: string;
}
withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    user?: string;
    items: HomeNavItem[];
    active: string;
  }>(),
  { user: "Alex Morgan" },
);
const emit = defineEmits<{ "update:active": [value: string] }>();
const { t } = useSiteShell();
const mobileOpen = ref(false);
const { toasts, showToast, dismissToast } = useAnimatedToastStack({
  limit: 3,
  defaultDuration: 3200,
});
function notify(title: string) {
  showToast({
    title,
    status: "success",
    dismissible: false,
    action: {
      label: t("关闭", "Dismiss"),
      onClick: (toast) => dismissToast(toast.id),
    },
  });
}
defineExpose({ notify });
</script>
<template>
  <AnimatedSidebarProvider
    v-model:open-mobile="mobileOpen"
    :shortcut="false"
    :expanded-width="210"
    class="home-app-frame min-h-0"
  >
    <AnimatedSidebar
      collapsible="offcanvas"
      :aria-label="t('示例应用导航', 'Demo application navigation')"
      panel-class-name="h-full min-h-0 sticky top-0"
    >
      <AnimatedSidebarHeader
        ><div class="home-app-account">
          <span class="home-avatar">{{
            user
              .split(" ")
              .map((part) => part[0])
              .join("")
          }}</span>
          <div>
            <strong>{{ user }}</strong
            ><small>{{ t("orvui 工作空间", "orvui workspace") }}</small>
          </div>
        </div></AnimatedSidebarHeader
      >
      <AnimatedSidebarContent>
        <AnimatedSidebarMenu class="[&_svg]:size-4">
          <template v-for="(item, index) in items" :key="item.id">
            <p
              v-if="
                item.group &&
                (index === 0 || item.group !== items[index - 1].group)
              "
              class="home-nav-group"
            >
              {{ item.group }}
            </p>
            <AnimatedSidebarMenuItem
              ><AnimatedSidebarMenuButton
                :is-active="active === item.id"
                :icon="item.icon"
                :badge="item.badge"
                @select="emit('update:active', item.id)"
                >{{ item.label }}</AnimatedSidebarMenuButton
              ></AnimatedSidebarMenuItem
            >
          </template>
        </AnimatedSidebarMenu>
        <slot name="sidebar" />
      </AnimatedSidebarContent>
      <AnimatedSidebarFooter
        ><AnimatedSidebarMenu class="[&_svg]:size-4"
          ><AnimatedSidebarMenuItem
            ><AnimatedSidebarMenuButton
              :icon="CircleHelp"
              @select="
                notify(
                  t(
                    '这是可交互的本地示例',
                    'This is an interactive local demo',
                  ),
                )
              "
              >{{
                t("帮助与信息", "Help & information")
              }}</AnimatedSidebarMenuButton
            ></AnimatedSidebarMenuItem
          ><AnimatedSidebarMenuItem
            ><AnimatedSidebarMenuButton
              :icon="LogOut"
              @select="
                notify(t('当前为演示账户', 'You are using a demo account'))
              "
              >{{ t("账户", "Account") }}</AnimatedSidebarMenuButton
            ></AnimatedSidebarMenuItem
          ></AnimatedSidebarMenu
        ></AnimatedSidebarFooter
      >
    </AnimatedSidebar>
    <div class="home-app-main">
      <header class="home-app-header">
        <AnimatedSidebarTrigger
          :aria-label="t('切换示例侧栏', 'Toggle demo sidebar')"
        />
        <div class="home-app-title">
          <h2>{{ title }}</h2>
          <p v-if="subtitle">{{ subtitle }}</p>
        </div>
        <div class="home-app-actions">
          <slot name="actions" :notify="notify" />
        </div>
      </header>
      <div
        class="home-app-body"
        tabindex="0"
        :aria-label="t('可滚动的示例内容', 'Scrollable demo content')"
      >
        <slot :notify="notify" />
      </div>
    </div>
    <AnimatedToastStack
      :toasts="toasts"
      placement="fixed"
      @dismiss="dismissToast"
    />
  </AnimatedSidebarProvider>
</template>

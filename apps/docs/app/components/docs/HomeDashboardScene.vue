<script setup lang="ts">
import { computed, h, ref } from "vue";
import {
  BarChart3,
  Bell,
  ClipboardList,
  Download,
  Filter,
  LayoutDashboard,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  UserPlus,
} from "lucide-vue-next";
import { Button } from "../../../../../packages/vue/src/motion/button";
import { Input } from "../../../../../packages/vue/src/motion/input";
import { Card } from "../../../../../packages/vue/src/motion/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../../../packages/vue/src/motion/tabs";
import {
  Table,
  type TableColumn,
  type SortState,
} from "../../../../../packages/vue/src/motion/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../../packages/vue/src/motion/select";
import { Switch } from "../../../../../packages/vue/src/motion/switch";
import HomeAppFrame from "./HomeAppFrame.vue";
import HomeMetric from "./HomeMetric.vue";
import HomeTrendChart from "./HomeTrendChart.vue";
import { useSiteShell } from "../../composables/site-shell-state";
import {
  count,
  currency,
  demoPeople,
  exportDemoCsv,
  initials,
} from "../../utils/docs/home-demo-data";
const { t } = useSiteShell();
const frame = ref<InstanceType<typeof HomeAppFrame>>();
const active = ref("dashboard"),
  tab = ref("overview"),
  range = ref("monthly"),
  query = ref(""),
  filter = ref(false),
  columnsCompact = ref(false),
  refreshed = ref(false),
  alerts = ref(true),
  sort = ref<SortState | null>(null);
const navigation = [
  { id: "dashboard", label: t("仪表盘", "Dashboard"), icon: LayoutDashboard },
  { id: "orders", label: t("订单", "Orders"), icon: ClipboardList },
  {
    id: "tracker",
    label: t("追踪", "Tracker"),
    icon: ClipboardList,
    badge: "New",
  },
  { id: "analytics", label: t("分析", "Analytics"), icon: BarChart3 },
  { id: "settings", label: t("设置", "Settings"), icon: Settings },
];
const multiplier = computed(
  () =>
    (range.value === "monthly" ? 1 : range.value === "weekly" ? 0.24 : 10.8) *
    (tab.value === "sales" ? 1.2 : tab.value === "expenses" ? 0.8 : 1) *
    (refreshed.value ? 1.03 : 1),
);
const metrics = computed(() => [
  {
    label: t("营收", "Revenue"),
    value: 228441 * multiplier.value,
    format: currency,
    change: "↗ 3.3%",
  },
  {
    label: t("支出", "Expenses"),
    value: 25108 * multiplier.value,
    format: currency,
    change: "↘ 3.3%",
  },
  {
    label: t("销售", "Sales"),
    value: Math.round(458 * multiplier.value),
    format: count,
    change: "↗ 3.3%",
  },
  {
    label: t("利润", "Profit"),
    value: 203333 * multiplier.value,
    format: currency,
    change: "↗ 4.1%",
  },
]);
const periods = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);
const sales = computed(() => [
  {
    id: "sales",
    name: t("销售额", "Sales"),
    color: "var(--primary)",
    values: [30, 52, 32, 18, 44, 25, 27, 30, 12, 44, 39, 32].map(
      (value) => value * multiplier.value,
    ),
  },
]);
const traffic = computed(() => [
  {
    id: "organic",
    name: t("自然访问", "Organic"),
    color: "var(--primary)",
    values: [2, 11, 7, 14, 15, 8, 12, 14, 16, 11, 20, 15].map(
      (value) => value * 1000 * multiplier.value,
    ),
  },
  {
    id: "ads",
    name: t("付费广告", "Paid ads"),
    color: "color-mix(in srgb, var(--primary) 45%, var(--foreground))",
    values: [1, 15, 9, 7, 14, 12, 5, 7, 12, 17, 23, 10].map(
      (value) => value * 1000 * multiplier.value,
    ),
  },
]);
const people = computed(() =>
  demoPeople.filter(
    (person) =>
      (!filter.value || person.type === "Employee") &&
      `${person.name} ${person.email} ${person.role}`
        .toLowerCase()
        .includes(query.value.toLowerCase()),
  ),
);
const columns = computed<TableColumn<(typeof demoPeople)[number]>[]>(() => [
  {
    key: "id",
    header: t("员工编号", "Worker ID"),
    width: "115px",
    cell: (row) => `#${row.id}`,
  },
  {
    key: "name",
    header: t("成员", "Member"),
    sortable: true,
    width: "235px",
    cell: (row) =>
      h("div", { class: "home-table-person" }, [
        h("span", { class: "home-avatar" }, initials(row.name)),
        h("span", [h("strong", row.name), h("small", row.email)]),
      ]),
  },
  ...(!columnsCompact.value
    ? [
        {
          key: "role",
          header: t("职务", "Role"),
          width: "180px",
          sortable: true,
        },
      ]
    : []),
  {
    key: "type",
    header: t("类型", "Worker type"),
    width: "125px",
    cell: (row) =>
      h(
        "span",
        { class: "home-status-badge" },
        row.type === "Employee"
          ? t("正式成员", "Employee")
          : t("协作伙伴", "Contractor"),
      ),
  },
]);
function download() {
  exportDemoCsv("orvui-team", [
    ["ID", "Member", "Email", "Role"],
    ...people.value.map((person) => [
      person.id,
      person.name,
      person.email,
      person.role,
    ]),
  ]);
}
</script>
<template>
  <div data-scene="dashboard">
    <HomeAppFrame
      ref="frame"
      v-model:active="active"
      :items="navigation"
      :title="
        active === 'dashboard'
          ? t('早上好，Alex', 'Good morning, Alex')
          : navigation.find((item) => item.id === active)!.label
      "
    >
      <template #actions="{ notify }"
        ><Button
          size="icon"
          variant="ghost"
          :aria-label="t('搜索成员', 'Search members')"
          @click="active = 'orders'"
          ><Search :size="16" /></Button
        ><Button
          size="icon"
          variant="ghost"
          :aria-label="t('查看通知', 'View notifications')"
          @click="notify(t('所有消息已读', 'You are all caught up'))"
          ><Bell :size="16" /></Button
        ><Button
          size="sm"
          @click="
            notify(t('本地邀请演示已完成', 'Local invitation demo complete'))
          "
          ><UserPlus :size="14" />{{ t("邀请", "Invite") }}</Button
        ></template
      >
      <template v-if="active === 'settings'"
        ><Card class="home-widget"
          ><h3>{{ t("工作空间设置", "Workspace settings") }}</h3>
          <Switch
            v-model="alerts"
            :label="
              t('接收工作空间通知', 'Receive workspace notifications')
            " /></Card
      ></template>
      <template v-else>
        <div class="home-app-toolbar">
          <Tabs v-model="tab" variant="pill"
            ><TabsList :aria-label="t('数据视图', 'Dashboard views')"
              ><TabsTrigger value="overview">{{
                t("概览", "Overview")
              }}</TabsTrigger
              ><TabsTrigger value="sales">{{ t("销售", "Sales") }}</TabsTrigger
              ><TabsTrigger value="expenses">{{
                t("支出", "Expenses")
              }}</TabsTrigger></TabsList
            ></Tabs
          >
          <div class="home-toolbar-actions">
            <Button
              size="icon"
              variant="secondary"
              :aria-label="t('刷新数据', 'Refresh data')"
              @click="refreshed = !refreshed"
              ><RefreshCw :size="14" /></Button
            ><Select v-model="range"
              ><SelectTrigger
                class="w-28"
                :aria-label="t('统计周期', 'Reporting period')"
                ><SelectValue /></SelectTrigger
              ><SelectContent
                ><SelectItem value="monthly">{{
                  t("每月", "Monthly")
                }}</SelectItem
                ><SelectItem value="weekly">{{
                  t("每周", "Weekly")
                }}</SelectItem
                ><SelectItem value="yearly">{{
                  t("每年", "Yearly")
                }}</SelectItem></SelectContent
              ></Select
            ><Button size="sm" @click="download"
              ><Download :size="14" />{{ t("下载", "Download") }}</Button
            >
          </div>
        </div>
        <div
          v-if="active !== 'orders' && active !== 'tracker'"
          class="home-kpi-grid"
        >
          <HomeMetric
            v-for="metric in metrics"
            :key="metric.label"
            v-bind="metric"
          />
        </div>
        <div
          v-if="active !== 'orders' && active !== 'tracker'"
          class="home-chart-grid"
        >
          <Card class="home-widget"
            ><div class="home-widget-heading">
              <h3>{{ t("销售表现", "Sales performance") }}</h3>
              <small>{{ t("最近 12 期", "Last 12 periods") }}</small>
            </div>
            <div class="home-sales-summary">
              <span
                ><strong>{{ currency(28441 * multiplier) }}</strong
                ><small>{{ t("每周销售", "Weekly sales") }}</small></span
              ><span
                ><strong>{{ currency(4063 * multiplier) }}</strong
                ><small>{{ t("每日销售", "Daily sales") }}</small></span
              ><span
                ><strong>{{ count(278 * multiplier) }}</strong
                ><small>{{ t("总订单", "Total orders") }}</small></span
              >
            </div>
            <HomeTrendChart
              :series="sales"
              :periods="periods"
              :label="t('销售表现', 'Sales performance')"
              bars /></Card
          ><Card class="home-widget"
            ><h3>{{ t("流量来源", "Traffic source") }}</h3>
            <p class="home-widget-number">
              {{ count(231856 * multiplier)
              }}<small>{{ t("次访问", "sessions") }}</small>
            </p>
            <HomeTrendChart
              :series="traffic"
              :periods="periods"
              :label="t('流量来源', 'Traffic source')"
          /></Card>
        </div>
        <section v-if="active !== 'analytics'" class="home-team-section">
          <div class="home-app-toolbar">
            <h3>
              {{
                active === "tracker"
                  ? t("团队追踪", "Team tracker")
                  : t("全部成员", "All members")
              }}
              <span class="home-count-badge">{{ people.length }}</span>
            </h3>
            <div class="home-toolbar-actions">
              <Button
                size="sm"
                variant="secondary"
                :aria-pressed="filter"
                @click="filter = !filter"
                ><Filter :size="13" />{{ t("筛选", "Filter") }}</Button
              ><Button
                size="sm"
                variant="secondary"
                @click="
                  sort = {
                    key: 'name',
                    direction: sort?.direction === 'asc' ? 'desc' : 'asc',
                  }
                "
                >{{ t("排序", "Sort") }}</Button
              ><Button
                size="sm"
                variant="secondary"
                :aria-pressed="columnsCompact"
                @click="columnsCompact = !columnsCompact"
                ><SlidersHorizontal :size="13" />{{
                  t("列", "Columns")
                }}</Button
              >
            </div>
          </div>
          <Input
            v-model="query"
            :left-icon="Search"
            :placeholder="t('搜索成员…', 'Search members…')"
            :aria-label="t('搜索成员', 'Search members')"
            class="home-table-search"
          /><Table
            v-model:sort="sort"
            :columns="columns"
            :data="people"
            :get-row-id="(row) => row.id"
            :height="350"
            :empty-state="t('没有匹配的成员', 'No matching members')"
            :aria-label="t('成员表格', 'Members table')"
          />
        </section>
      </template>
    </HomeAppFrame>
  </div>
</template>

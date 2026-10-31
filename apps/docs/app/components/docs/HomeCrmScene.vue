<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Bell,
  Building2,
  Calendar,
  CircleDollarSign,
  ClipboardList,
  Clock,
  FileText,
  Home,
  ListPlus,
  Users,
} from "lucide-vue-next";
import { Card } from "../../../../../packages/vue/src/motion/card";
import { Checkbox } from "../../../../../packages/vue/src/motion/checkbox";
import { Input } from "../../../../../packages/vue/src/motion/input";
import {
  DateRangePicker,
  DateRangePickerTrigger,
  DateRangePickerContent,
  DateRangePickerCalendar,
  DateRangePickerHeader,
  DateRangePickerGrid,
  DateRangePickerFooter,
  DateRangePickerSelection,
  type DateRange,
} from "../../../../../packages/vue/src/motion/date-range-picker";
import {
  DonutChart,
  DonutChartPlot,
  DonutChartCenter,
  DonutChartLegend,
} from "../../../../../packages/vue/src/charts/donut-chart";
import { FunnelChart } from "../../../../../packages/vue/src/charts/funnel-chart";
import HomeAppFrame from "./HomeAppFrame.vue";
import HomeMetric from "./HomeMetric.vue";
import HomeTrendChart from "./HomeTrendChart.vue";
import { useSiteShell } from "../../composables/site-shell-state";
import { currency, initials } from "../../utils/docs/home-demo-data";
const { t, en } = useSiteShell();
const active = ref("home"),
  forecast = ref<string | null>(null),
  query = ref(""),
  done = ref(false);
const range = ref<DateRange>({ from: "2026-09-28", to: "2026-10-27" });
const factor = computed(() =>
  Math.max(
    0.2,
    Math.min(
      3,
      ((Date.parse(range.value.to || range.value.from) -
        Date.parse(range.value.from)) /
        86400000 +
        1) /
        30,
    ),
  ),
);
const navigation = [
  { id: "home", label: t("首页", "Home"), icon: Home },
  { id: "next", label: t("接下来", "Up next"), icon: Clock },
  {
    id: "notifications",
    label: t("通知", "Notifications"),
    icon: Bell,
    badge: "2",
  },
  {
    id: "accounts",
    label: t("客户", "Accounts"),
    icon: Building2,
    group: t("记录", "Records"),
  },
  {
    id: "opportunities",
    label: t("商机", "Opportunities"),
    icon: CircleDollarSign,
    group: t("记录", "Records"),
  },
  {
    id: "contacts",
    label: t("联系人", "Contacts"),
    icon: Users,
    group: t("记录", "Records"),
  },
  {
    id: "tasks",
    label: t("任务", "Tasks"),
    icon: ClipboardList,
    group: t("资源", "Resources"),
  },
  {
    id: "meetings",
    label: t("会议", "Meetings"),
    icon: Calendar,
    group: t("资源", "Resources"),
  },
  {
    id: "notes",
    label: t("笔记", "Notes"),
    icon: FileText,
    group: t("资源", "Resources"),
  },
  {
    id: "new",
    label: t("新建列表", "New list"),
    icon: ListPlus,
    group: t("列表", "Lists"),
  },
  {
    id: "risk",
    label: t("风险客户", "At risk"),
    icon: FileText,
    group: t("列表", "Lists"),
  },
  {
    id: "warm",
    label: t("潜在客户", "Warm contacts"),
    icon: FileText,
    group: t("列表", "Lists"),
  },
];
const periods = [
  "Aug 20",
  "Aug 25",
  "Aug 28",
  "Sep 2",
  "Sep 5",
  "Sep 9",
  "Sep 12",
  "Sep 16",
];
const created = computed(() => [
  {
    id: "created",
    name: t("新增", "Created"),
    color: "var(--primary)",
    values: [4, 3, 2, 5, 3, 2, 4, 3].map((value) => value * factor.value),
  },
  {
    id: "closed",
    name: t("成交", "Closed"),
    color: "color-mix(in srgb, var(--primary) 35%, var(--foreground))",
    values: [1, 0, 2, 1, 0, 1, 2, 1].map((value) => value * factor.value),
  },
]);
const days = computed(() => [
  {
    id: "typical",
    name: t("常规", "Typical"),
    color: "var(--primary)",
    values: [22, 18, 23, 31, 24, 20, 21, 24],
  },
  {
    id: "slow",
    name: t("缓慢", "Slow"),
    color: "color-mix(in srgb, var(--primary) 50%, var(--foreground))",
    values: [36, 31, 38, 45, 39, 32, 34, 38],
  },
  {
    id: "stalled",
    name: t("停滞", "Stalled"),
    color: "var(--muted-foreground)",
    values: [57, 48, 49, 62, 54, 46, 49, 53],
  },
]);
const segments = computed(() => [
  {
    id: "open",
    name: t("开放商机", "Open pipeline"),
    value: 1000000 * factor.value,
    color: "var(--primary)",
  },
  {
    id: "best",
    name: t("最佳预期", "Best case"),
    value: 2700000 * factor.value,
    color: "color-mix(in srgb, var(--primary) 45%, var(--foreground))",
  },
  {
    id: "commit",
    name: t("已承诺", "Commit"),
    value: 2300000 * factor.value,
    color: "color-mix(in srgb, var(--primary) 25%, var(--background))",
  },
]);
const stages = computed(() =>
  [
    ["潜在客户", "Lead", 594],
    ["资格确认", "Qualification", 540],
    ["演示", "Demo", 420],
    ["试用", "Trial", 320],
    ["提案", "Proposal", 220],
    ["成交", "Won", 110],
  ].map(([zh, en, value], index) => ({
    id: String(index),
    label: t(String(zh), String(en)),
    value: Number(value) * factor.value,
  })),
);
const accounts = [
  {
    name: "Northstar",
    detail: t("3 个开放商机 · 采购阶段", "3 open · Procurement"),
    value: 890000,
  },
  {
    name: "Layers",
    detail: t("2 个开放商机 · 评估阶段", "2 open · Evaluation"),
    value: 780000,
  },
  {
    name: "Orbit",
    detail: t("2 个开放商机 · 谈判阶段", "2 open · Negotiation"),
    value: 720000,
  },
  {
    name: "Frame",
    detail: t("2 个开放商机 · 评估阶段", "2 open · Evaluation"),
    value: 640000,
  },
];
const opportunities = [
  {
    name: t("设计系统工作空间", "Design system workspace"),
    detail: "Northstar · Alex Morgan",
    value: 610000,
  },
  {
    name: t("团队协作平台", "Team collaboration platform"),
    detail: "Layers · Maya Chen",
    value: 540000,
  },
  {
    name: t("运营数据中心", "Operations data center"),
    detail: "Orbit · Jordan Lee",
    value: 495000,
  },
  {
    name: t("产品体验升级", "Product experience refresh"),
    detail: "Frame · Sam Rivera",
    value: 480000,
  },
];
const filteredAccounts = computed(() =>
  accounts.filter((item) =>
    item.name.toLowerCase().includes(query.value.toLowerCase()),
  ),
);
</script>
<template>
  <div data-scene="crm">
    <HomeAppFrame
      v-model:active="active"
      :items="navigation"
      user="orvui Team"
      :title="navigation.find((item) => item.id === active)!.label"
    >
      <template v-if="active === 'home'"
        ><div class="home-app-toolbar">
          <h3>{{ t("销售管线", "Pipeline") }}</h3>
          <DateRangePicker
            v-model="range"
            :locale="en ? 'en-US' : 'zh-CN'"
            :label="t('日期范围', 'Date range')"
            default-month="2026-10-01"
            ><DateRangePickerTrigger /><DateRangePickerContent
              ><DateRangePickerCalendar
                ><DateRangePickerHeader /><DateRangePickerGrid /><DateRangePickerFooter
                  ><DateRangePickerSelection /></DateRangePickerFooter></DateRangePickerCalendar></DateRangePickerContent
          ></DateRangePicker>
        </div>
        <div class="home-crm-kpis">
          <HomeMetric
            :label="t('销售管线', 'Pipeline')"
            :value="8400000 * factor"
            :format="(value) => '$' + (value / 1000000).toFixed(1) + 'M'"
            change="↗ 8%"
            :detail="t('20 个商机 · $1M 成交', '20 open · $1M won')"
            :spark="[3, 5, 4, 7, 6, 8, 7, 9]"
          /><HomeMetric
            :label="t('今日会议', 'Meetings today')"
            :value="5"
            detail="Northstar · Layers"
            :spark="[1, 4, 2, 7, 3, 5, 1, 3]"
          /><HomeMetric
            :label="t('本季度流失', 'Lost this quarter')"
            :value="1"
            detail="$276K · Orbit"
            :spark="[1, 2, 1, 2, 3, 4, 5, 9]"
            tone="var(--destructive)"
          /><HomeMetric
            :label="t('赢单率', 'Win rate')"
            :value="67"
            :format="(value) => Math.round(value) + '%'"
            :progress="67"
            change="↗ 4%"
            :detail="t('2 个成交 · 1 个流失', '2 won · 1 lost')"
          /><HomeMetric
            :label="t('风险商机', 'At risk')"
            :value="2"
            :progress="10"
            :detail="t('$549K · 20 个商机中的 2 个', '$549K · 2 of 20 open')"
            tone="var(--color-warning, #d3a94b)"
          /><HomeMetric
            :label="t('逾期跟进', 'Overdue follow-ups')"
            :value="5"
            :progress="50"
            detail="Northstar · Frame"
            tone="var(--destructive)"
          />
        </div>
        <div class="home-chart-grid">
          <Card class="home-widget"
            ><h3>{{ t("新增与成交", "Created vs closed") }}</h3>
            <HomeTrendChart
              :series="created"
              :periods="periods"
              :label="t('新增与成交', 'Created vs closed')"
              bars /></Card
          ><Card class="home-widget"
            ><h3>{{ t("成交周期", "Days to close") }}</h3>
            <HomeTrendChart
              :series="days"
              :periods="periods"
              :label="t('成交周期', 'Days to close')"
              :format-value="(value) => Math.round(value) + 'd'" /></Card
          ><Card class="home-widget"
            ><h3>{{ t("加权预测", "Weighted forecast") }}</h3>
            <DonutChart
              :segments="segments"
              :selected-id="forecast"
              :format-value="currency"
              :label="t('加权预测', 'Weighted forecast')"
              @select="forecast = forecast === $event ? null : $event"
              ><div class="home-forecast-plot">
                <DonutChartPlot
                  ><DonutChartCenter
                    :total-label="t('预测总额', 'Forecast total')"
                /></DonutChartPlot>
              </div>
              <DonutChartLegend /></DonutChart></Card
          ><Card class="home-widget"
            ><h3>{{ t("销售漏斗", "Pipeline funnel") }}</h3>
            <FunnelChart
              :stages="stages"
              :label="t('销售漏斗', 'Pipeline funnel')"
              :unit="t('商机', 'opportunities')"
          /></Card></div
      ></template>
      <template
        v-if="
          [
            'home',
            'accounts',
            'opportunities',
            'contacts',
            'risk',
            'warm',
          ].includes(active)
        "
        ><Input
          v-if="active !== 'home'"
          v-model="query"
          :placeholder="t('搜索客户…', 'Search accounts…')"
          :aria-label="t('搜索客户', 'Search accounts')"
        />
        <div class="home-chart-grid home-records-grid">
          <Card
            v-for="(list, index) in [filteredAccounts, opportunities]"
            :key="index"
            class="home-widget"
            ><h3>
              {{ index ? t("商机", "Opportunities") : t("客户", "Accounts") }}
            </h3>
            <div v-for="item in list" :key="item.name" class="home-record-row">
              <span class="home-avatar">{{ initials(item.name) }}</span>
              <div>
                <strong>{{ item.name }}</strong
                ><small>{{ item.detail }}</small>
              </div>
              <strong>{{ currency(item.value) }}</strong>
            </div>
            <p v-if="!list.length" class="home-empty">
              {{ t("暂无匹配项", "No matches") }}
            </p></Card
          >
        </div></template
      >
      <Card v-else-if="active !== 'home'" class="home-widget"
        ><h3>{{ navigation.find((item) => item.id === active)!.label }}</h3>
        <Input
          v-model="query"
          :label="
            active === 'notes' || active === 'new'
              ? t('添加内容', 'Add a note')
              : t('搜索', 'Search')
          " /><Checkbox
          v-model="done"
          :label="
            t(
              '与 Northstar 确认下一次产品演示',
              'Confirm the next product demo with Northstar',
            )
          " /><Checkbox
          :label="t('更新季度销售预测', 'Update the quarterly forecast')"
      /></Card>
    </HomeAppFrame>
  </div>
</template>

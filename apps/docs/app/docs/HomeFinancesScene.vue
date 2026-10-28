<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  ChartNoAxesCombined,
  CircleDollarSign,
  LayoutDashboard,
  Receipt,
  Settings,
  Wallet,
} from "lucide-vue-next";
import { Button } from "../../../../packages/vue/src/motion/button";
import { Card } from "../../../../packages/vue/src/motion/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../../packages/vue/src/motion/tabs";
import { Table } from "../../../../packages/vue/src/motion/table";
import { Switch } from "../../../../packages/vue/src/motion/switch";
import HomeAppFrame from "./HomeAppFrame.vue";
import HomeMetric from "./HomeMetric.vue";
import HomeTrendChart from "./HomeTrendChart.vue";
import { useSiteShell } from "./site-shell-state";
import { amount, currency } from "./home-demo-data";
const { t } = useSiteShell();
const active = ref("dashboard"),
  range = ref("1m"),
  allHoldings = ref(false),
  privateBalance = ref(false);
const navigation = [
  { id: "dashboard", label: t("仪表盘", "Dashboard"), icon: LayoutDashboard },
  {
    id: "portfolio",
    label: t("资产组合", "Portfolio"),
    icon: ChartNoAxesCombined,
  },
  { id: "spending", label: t("支出", "Spending"), icon: Wallet },
  { id: "transactions", label: t("交易记录", "Transactions"), icon: Receipt },
  {
    id: "earn",
    label: t("收益", "Earn"),
    icon: CircleDollarSign,
    badge: "New",
  },
  { id: "settings", label: t("设置", "Settings"), icon: Settings },
];
const history = [
  4834, 4905, 4957, 4898, 4820, 4784, 4938, 4852, 4990, 5025, 5058, 5016, 4958,
  4898, 5104, 5272, 5311, 5240, 5398, 4987, 5044, 5212, 5341, 5210, 5387, 5338,
  5328, 5427,
];
const rangeLengths: Record<string, number> = {
  "1d": 12,
  "1w": 7,
  "1m": 28,
  "3m": 13,
  "1y": 12,
  all: 24,
};
const rangeScales: Record<string, number> = {
  "1d": 0.08,
  "1w": 0.4,
  "1m": 1,
  "3m": 1.8,
  "1y": 3,
  all: 4,
};
const periods = computed(() =>
  Array.from({ length: rangeLengths[range.value] }, (_, index) => {
    if (range.value === "1d") return `${index * 2}:00`;
    if (range.value === "1y" || range.value === "all")
      return `${index + 1}${t("月", " mo")}`;
    if (range.value === "3m")
      return `${t("第", "Week ")}${index + 1}${t("周", "")}`;
    return `${t("第", "Day ")}${index + 1}${t("天", "")}`;
  }),
);
const portfolio = computed(() => [
  {
    id: "balance",
    name: t("资产净值", "Portfolio value"),
    color: "var(--primary)",
    values: periods.value.map(
      (_, index) =>
        5427.48 +
        (history[
          Math.round(
            (index * (history.length - 1)) /
              Math.max(1, periods.value.length - 1),
          )
        ] -
          5427) *
          rangeScales[range.value],
    ),
  },
]);
const holdings = [
  {
    id: "BTC",
    name: "Bitcoin",
    value: 1283.84,
    change: "+2.34%",
    tone: "#f59e0b",
  },
  {
    id: "USDC",
    name: "USD Coin",
    value: 2087.25,
    change: "+0.01%",
    tone: "#3b82f6",
  },
  {
    id: "ETH",
    name: "Ethereum",
    value: 1087.25,
    change: "−1.12%",
    tone: "#8b8ba0",
  },
  {
    id: "BNB",
    name: "BNB Chain",
    value: 165.2,
    change: "+0.92%",
    tone: "#d6ab24",
  },
  {
    id: "SOL",
    name: "Solana",
    value: 195.54,
    change: "+4.72%",
    tone: "#39a88e",
  },
  { id: "DAI", name: "Dai", value: 308.4, change: "+0.03%", tone: "#e1b85d" },
  { id: "AVAX", name: "Avalanche", value: 150, change: "+1.24%", tone: "#d56069" },
  { id: "LINK", name: "Chainlink", value: 150, change: "+0.83%", tone: "#4c83d6" },
];
const transactions = computed(() =>
  [
    {
      id: "0xa2bf…9d3a",
      type: t("合约交互", "Contract interaction"),
      asset: "ETH",
      value: "$320.65",
      date: "2026-10-26",
    },
    {
      id: "0xb4e0…12fa",
      type: t("收到", "Received"),
      asset: "USDC",
      value: "$500.00",
      date: "2026-10-25",
    },
    {
      id: "0xc1a2…4e39",
      type: t("发送", "Sent"),
      asset: "ETH",
      value: "$3,384.10",
      date: "2026-10-24",
    },
    {
      id: "0xd6b5…1635",
      type: t("兑换", "Swapped"),
      asset: "BTC",
      value: "$938.52",
      date: "2026-10-22",
    },
    {
      id: "0xe7c6…5410",
      type: t("收到", "Received"),
      asset: "SOL",
      value: "$269.21",
      date: "2026-10-20",
    },
  ].filter(
    (item) => active.value !== "spending" || item.type === t("发送", "Sent"),
  ),
);
const columns = computed(() => [
  { key: "id", header: t("交易编号", "Txn #"), width: "155px" },
  { key: "type", header: t("类型", "Type"), width: "170px" },
  { key: "asset", header: t("资产", "Asset"), width: "90px" },
  { key: "value", header: t("金额", "Value"), width: "130px" },
  { key: "date", header: t("日期", "Date"), width: "145px", sortable: true },
]);
</script>
<template>
  <div data-scene="finances">
    <HomeAppFrame
      v-model:active="active"
      :items="navigation"
      user="Jordan Lee"
      :title="t('下午好，Jordan', 'Good afternoon, Jordan')"
    >
      <template #actions="{ notify }"
        ><Button
          size="sm"
          variant="secondary"
          @click="
            notify(
              t(
                '兑换预览已生成，本地演示',
                'Swap preview generated · Local demo',
              ),
            )
          "
          ><ArrowLeftRight :size="14" />{{ t("兑换", "Swap") }}</Button
        ><Button
          size="sm"
          variant="secondary"
          @click="
            notify(
              t(
                '演示收款地址：orvui.demo',
                'Demo receiving address: orvui.demo',
              ),
            )
          "
          ><ArrowDownLeft :size="14" />{{ t("接收", "Receive") }}</Button
        ><Button
          size="sm"
          @click="
            notify(
              t(
                '发送流程演示完成，没有真实交易',
                'Send demo complete. No transaction was made.',
              ),
            )
          "
          ><ArrowUpRight :size="14" />{{ t("发送", "Send") }}</Button
        ></template
      >
      <Card v-if="active === 'settings'" class="home-widget"
        ><h3>{{ t("隐私设置", "Privacy settings") }}</h3>
        <Switch
          v-model="privateBalance"
          :label="t('隐藏账户余额', 'Hide account balance')"
      /></Card>
      <template v-else
        ><div class="home-kpi-grid">
          <HomeMetric
            :label="t('总余额', 'Total balance')"
            :value="5427.48"
            :format="privateBalance ? () => '••••' : amount"
            change="↗ 5.32%"
          /><HomeMetric
            :label="t('24 小时变化', '24h change')"
            :value="120.18"
            :format="amount"
            change="↗ 2.24%"
          /><HomeMetric
            :label="t('最佳表现 · SOL', 'Top performer · SOL')"
            :value="4.72"
            :format="(value) => value.toFixed(2) + '%'"
            change="↗ 4.72%"
          /><HomeMetric
            :label="t('持仓', 'Holdings')"
            :value="8"
            :detail="t('种资产', 'Assets')"
          />
        </div>
        <div
          v-if="active !== 'transactions' && active !== 'spending'"
          class="home-portfolio-grid"
        >
          <Card class="home-widget"
            ><div class="home-widget-heading">
              <h3>
                {{
                  active === "earn"
                    ? t("收益表现", "Earnings")
                    : t("资产组合", "Portfolio")
                }}
              </h3>
              <Tabs v-model="range" variant="pill"
                ><TabsList
                  :aria-label="t('资产时间范围', 'Portfolio time range')"
                  ><TabsTrigger
                    v-for="item in ['1d', '1w', '1m', '3m', '1y', 'all']"
                    :key="item"
                    :value="item"
                    >{{ item.toUpperCase() }}</TabsTrigger
                  ></TabsList
                ></Tabs
              >
            </div>
            <p class="home-widget-number">
              {{ privateBalance ? "••••" : amount(portfolio[0].values.at(-1)!)
              }}<small class="home-positive">↗ 8.16%</small>
            </p>
            <HomeTrendChart
              :series="portfolio"
              :periods="periods"
              :label="t('资产历史表现', 'Portfolio history')"
              :format-value="currency"
          /></Card>
          <section class="home-holdings">
            <h3>
              {{ t("持仓", "Holdings") }}
              <span class="home-count-badge">8</span>
            </h3>
            <div
              v-for="(holding, index) in holdings.slice(0, allHoldings ? holdings.length : 5)"
              :key="holding.id"
              class="home-holding-row"
            >
              <span class="home-coin" :style="{ '--coin': holding.tone }">{{
                holding.id.slice(0, 1)
              }}</span>
              <div>
                <strong>{{ holding.id }}</strong
                ><small>{{ holding.name }}</small>
              </div>
              <div class="home-holding-spark">
                <HomeTrendChart
                  compact
                  :series="[
                    {
                      id: holding.id,
                      name: holding.id,
                      color:
                        index === 2
                          ? 'var(--destructive)'
                          : 'var(--color-success, #54ad80)',
                      values: [4, 6, 3, 7, 5, 8, 7, 9].map(
                        (value, day) => value + ((index + day) % 3),
                      ),
                    },
                  ]"
                  :periods="['1', '2', '3', '4', '5', '6', '7', '8']"
                  :label="holding.name"
                />
              </div>
              <div class="home-holding-value">
                <strong>{{ amount(holding.value) }}</strong
                ><small
                  :class="index === 2 ? 'home-negative' : 'home-positive'"
                  >{{ holding.change }}</small
                >
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              class="w-full"
              @click="allHoldings = !allHoldings"
              >{{
                allHoldings
                  ? t("收起持仓", "Show fewer holdings")
                  : t("查看全部持仓", "See all holdings")
              }}</Button
            >
          </section>
        </div>
        <section class="home-team-section">
          <h3>
            {{
              active === "spending"
                ? t("支出记录", "Spending")
                : t("最近交易", "Recent activity")
            }}
            <span class="home-count-badge">{{ transactions.length }}</span>
          </h3>
          <Table
            :columns="columns"
            :data="transactions"
            :height="300"
            :get-row-id="(row) => row.id"
            :aria-label="t('交易记录表格', 'Transactions table')"
          /></section
      ></template>
    </HomeAppFrame>
  </div>
</template>

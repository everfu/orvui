---
title: "Table"
description: "使用虚拟滚动、选择、排序与可调整列浏览和编辑数据行。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/table"
markdown: "https://orvui.efu.me/components/motion/table.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Table

> 使用虚拟滚动、选择、排序与可调整列浏览和编辑数据行。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Table：使用虚拟滚动、选择、排序与可调整列浏览和编辑数据行。

<a id="install"></a>
## 安装

### Table — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/table.json
```

### Data Table — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/table.json
```

### Editable Table — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/table-editable.json https://orvui.efu.me/r/switch.json
```

### Async Table — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/table-async.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

在你的应用目录从 npm 安装已发布的组件包。

```bash
pnpm add @orvui/vue
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `@tanstack/vue-virtual@^3.13.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Table

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { h } from "vue";
import { Table, type TableColumn } from "@/components/orvui/motion/table";

interface DemoPerson {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
  mrr: number;
}
const given = [
    "Ava",
    "Leo",
    "Mia",
    "Kai",
    "Zoe",
    "Eli",
    "Noa",
    "Ren",
    "Ivy",
    "Jude",
  ],
  families = [
    "Cole",
    "Frost",
    "Vale",
    "Reyes",
    "Okafor",
    "Sato",
    "Lund",
    "Marsh",
    "Bose",
    "Quinn",
  ];
const roles = ["Owner", "Admin", "Member", "Viewer"],
  statuses = ["active", "invited", "suspended"] as const;
function buildPeople(count: number, start = 0) {
  const entries: DemoPerson[] = [];
  for (let index = start; index < start + count; index++) {
    const first = given[index % given.length],
      last = families[(index * 7) % families.length];
    entries.push({
      id: String(index),
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${index}@example.com`,
      role: roles[(index * 3) % roles.length],
      status: statuses[(index * 5) % statuses.length],
      mrr: 12 + ((index * 37) % 488),
    });
  }
  return entries;
}
const tone = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  invited: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  suspended: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};
function peopleColumns(sortable: boolean): TableColumn<DemoPerson>[] {
  return [
    {
      key: "name",
      header: "Name",
      ...(sortable ? { sortable: true, width: "1.4fr" } : {}),
      cell: (row) => h("span", { class: "font-medium" }, row.name),
    },
    { key: "email", header: "Email", width: sortable ? "1.8fr" : "220px" },
    {
      key: "role",
      header: "Role",
      ...(sortable ? { sortable: true } : {}),
      width: sortable ? "120px" : "110px",
    },
    {
      key: "status",
      header: "Status",
      width: sortable ? "130px" : "120px",
      cell: (row) =>
        h(
          "span",
          {
            class:
              "rounded-full px-2 py-0.5 font-medium text-xs capitalize " +
              tone[row.status],
          },
          row.status,
        ),
    },
    {
      key: "mrr",
      header: "MRR",
      ...(sortable ? { sortable: true } : {}),
      align: "right",
      width: sortable ? "110px" : "100px",
      cell: (row) =>
        h("span", { class: "tabular-nums" }, "$" + row.mrr.toLocaleString()),
    },
  ];
}

const data = buildPeople(10000),
  columns = peopleColumns(true),
  selected = ref<string[]>([]);
</script>
<template>
  <div class="flex w-full justify-center p-4">
    <div class="flex w-full flex-col gap-2">
      <div
        class="flex items-center justify-between px-1 text-xs text-muted-foreground"
      >
        <span>{{ data.length.toLocaleString() }} rows</span
        ><span v-if="selected.length"
          >{{ selected.length.toLocaleString() }} selected</span
        >
      </div>
      <Table
        v-model:selected-row-ids="selected"
        :data="data"
        :columns="columns"
        selectable
        resizable
        reorderable
        :default-sort="{ key: 'mrr', direction: 'desc' }"
        :height="420"
        :row-height="52"
        class="rounded-2xl"
      />
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { h } from "vue";
import { Table, type TableColumn } from "@orvui/vue/motion/table";

interface DemoPerson {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
  mrr: number;
}
const given = [
    "Ava",
    "Leo",
    "Mia",
    "Kai",
    "Zoe",
    "Eli",
    "Noa",
    "Ren",
    "Ivy",
    "Jude",
  ],
  families = [
    "Cole",
    "Frost",
    "Vale",
    "Reyes",
    "Okafor",
    "Sato",
    "Lund",
    "Marsh",
    "Bose",
    "Quinn",
  ];
const roles = ["Owner", "Admin", "Member", "Viewer"],
  statuses = ["active", "invited", "suspended"] as const;
function buildPeople(count: number, start = 0) {
  const entries: DemoPerson[] = [];
  for (let index = start; index < start + count; index++) {
    const first = given[index % given.length],
      last = families[(index * 7) % families.length];
    entries.push({
      id: String(index),
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${index}@example.com`,
      role: roles[(index * 3) % roles.length],
      status: statuses[(index * 5) % statuses.length],
      mrr: 12 + ((index * 37) % 488),
    });
  }
  return entries;
}
const tone = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  invited: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  suspended: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};
function peopleColumns(sortable: boolean): TableColumn<DemoPerson>[] {
  return [
    {
      key: "name",
      header: "Name",
      ...(sortable ? { sortable: true, width: "1.4fr" } : {}),
      cell: (row) => h("span", { class: "font-medium" }, row.name),
    },
    { key: "email", header: "Email", width: sortable ? "1.8fr" : "220px" },
    {
      key: "role",
      header: "Role",
      ...(sortable ? { sortable: true } : {}),
      width: sortable ? "120px" : "110px",
    },
    {
      key: "status",
      header: "Status",
      width: sortable ? "130px" : "120px",
      cell: (row) =>
        h(
          "span",
          {
            class:
              "rounded-full px-2 py-0.5 font-medium text-xs capitalize " +
              tone[row.status],
          },
          row.status,
        ),
    },
    {
      key: "mrr",
      header: "MRR",
      ...(sortable ? { sortable: true } : {}),
      align: "right",
      width: sortable ? "110px" : "100px",
      cell: (row) =>
        h("span", { class: "tabular-nums" }, "$" + row.mrr.toLocaleString()),
    },
  ];
}

const data = buildPeople(10000),
  columns = peopleColumns(true),
  selected = ref<string[]>([]);
</script>
<template>
  <div class="flex w-full justify-center p-4">
    <div class="flex w-full flex-col gap-2">
      <div
        class="flex items-center justify-between px-1 text-xs text-muted-foreground"
      >
        <span>{{ data.length.toLocaleString() }} rows</span
        ><span v-if="selected.length"
          >{{ selected.length.toLocaleString() }} selected</span
        >
      </div>
      <Table
        v-model:selected-row-ids="selected"
        :data="data"
        :columns="columns"
        selectable
        resizable
        reorderable
        :default-sort="{ key: 'mrr', direction: 'desc' }"
        :height="420"
        :row-height="52"
        class="rounded-2xl"
      />
    </div>
  </div>
</template>
```

<a id="data"></a>
### Data Table

浏览虚拟化数据行，并进行选择、排序和列位置调整。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { h } from "vue";
import { Table, type TableColumn } from "@/components/orvui/motion/table";

interface DemoPerson {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
  mrr: number;
}
const given = [
    "Ava",
    "Leo",
    "Mia",
    "Kai",
    "Zoe",
    "Eli",
    "Noa",
    "Ren",
    "Ivy",
    "Jude",
  ],
  families = [
    "Cole",
    "Frost",
    "Vale",
    "Reyes",
    "Okafor",
    "Sato",
    "Lund",
    "Marsh",
    "Bose",
    "Quinn",
  ];
const roles = ["Owner", "Admin", "Member", "Viewer"],
  statuses = ["active", "invited", "suspended"] as const;
function buildPeople(count: number, start = 0) {
  const entries: DemoPerson[] = [];
  for (let index = start; index < start + count; index++) {
    const first = given[index % given.length],
      last = families[(index * 7) % families.length];
    entries.push({
      id: String(index),
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${index}@example.com`,
      role: roles[(index * 3) % roles.length],
      status: statuses[(index * 5) % statuses.length],
      mrr: 12 + ((index * 37) % 488),
    });
  }
  return entries;
}
const tone = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  invited: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  suspended: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};
function peopleColumns(sortable: boolean): TableColumn<DemoPerson>[] {
  return [
    {
      key: "name",
      header: "Name",
      ...(sortable ? { sortable: true, width: "1.4fr" } : {}),
      cell: (row) => h("span", { class: "font-medium" }, row.name),
    },
    { key: "email", header: "Email", width: sortable ? "1.8fr" : "220px" },
    {
      key: "role",
      header: "Role",
      ...(sortable ? { sortable: true } : {}),
      width: sortable ? "120px" : "110px",
    },
    {
      key: "status",
      header: "Status",
      width: sortable ? "130px" : "120px",
      cell: (row) =>
        h(
          "span",
          {
            class:
              "rounded-full px-2 py-0.5 font-medium text-xs capitalize " +
              tone[row.status],
          },
          row.status,
        ),
    },
    {
      key: "mrr",
      header: "MRR",
      ...(sortable ? { sortable: true } : {}),
      align: "right",
      width: sortable ? "110px" : "100px",
      cell: (row) =>
        h("span", { class: "tabular-nums" }, "$" + row.mrr.toLocaleString()),
    },
  ];
}

const data = buildPeople(10000),
  columns = peopleColumns(true),
  selected = ref<string[]>([]);
</script>
<template>
  <div class="flex w-full justify-center p-4">
    <div class="flex w-full flex-col gap-2">
      <div
        class="flex items-center justify-between px-1 text-xs text-muted-foreground"
      >
        <span>{{ data.length.toLocaleString() }} rows</span
        ><span v-if="selected.length"
          >{{ selected.length.toLocaleString() }} selected</span
        >
      </div>
      <Table
        v-model:selected-row-ids="selected"
        :data="data"
        :columns="columns"
        selectable
        resizable
        reorderable
        :default-sort="{ key: 'mrr', direction: 'desc' }"
        :height="420"
        :row-height="52"
        class="rounded-2xl"
      />
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { h } from "vue";
import { Table, type TableColumn } from "@orvui/vue/motion/table";

interface DemoPerson {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
  mrr: number;
}
const given = [
    "Ava",
    "Leo",
    "Mia",
    "Kai",
    "Zoe",
    "Eli",
    "Noa",
    "Ren",
    "Ivy",
    "Jude",
  ],
  families = [
    "Cole",
    "Frost",
    "Vale",
    "Reyes",
    "Okafor",
    "Sato",
    "Lund",
    "Marsh",
    "Bose",
    "Quinn",
  ];
const roles = ["Owner", "Admin", "Member", "Viewer"],
  statuses = ["active", "invited", "suspended"] as const;
function buildPeople(count: number, start = 0) {
  const entries: DemoPerson[] = [];
  for (let index = start; index < start + count; index++) {
    const first = given[index % given.length],
      last = families[(index * 7) % families.length];
    entries.push({
      id: String(index),
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${index}@example.com`,
      role: roles[(index * 3) % roles.length],
      status: statuses[(index * 5) % statuses.length],
      mrr: 12 + ((index * 37) % 488),
    });
  }
  return entries;
}
const tone = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  invited: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  suspended: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};
function peopleColumns(sortable: boolean): TableColumn<DemoPerson>[] {
  return [
    {
      key: "name",
      header: "Name",
      ...(sortable ? { sortable: true, width: "1.4fr" } : {}),
      cell: (row) => h("span", { class: "font-medium" }, row.name),
    },
    { key: "email", header: "Email", width: sortable ? "1.8fr" : "220px" },
    {
      key: "role",
      header: "Role",
      ...(sortable ? { sortable: true } : {}),
      width: sortable ? "120px" : "110px",
    },
    {
      key: "status",
      header: "Status",
      width: sortable ? "130px" : "120px",
      cell: (row) =>
        h(
          "span",
          {
            class:
              "rounded-full px-2 py-0.5 font-medium text-xs capitalize " +
              tone[row.status],
          },
          row.status,
        ),
    },
    {
      key: "mrr",
      header: "MRR",
      ...(sortable ? { sortable: true } : {}),
      align: "right",
      width: sortable ? "110px" : "100px",
      cell: (row) =>
        h("span", { class: "tabular-nums" }, "$" + row.mrr.toLocaleString()),
    },
  ];
}

const data = buildPeople(10000),
  columns = peopleColumns(true),
  selected = ref<string[]>([]);
</script>
<template>
  <div class="flex w-full justify-center p-4">
    <div class="flex w-full flex-col gap-2">
      <div
        class="flex items-center justify-between px-1 text-xs text-muted-foreground"
      >
        <span>{{ data.length.toLocaleString() }} rows</span
        ><span v-if="selected.length"
          >{{ selected.length.toLocaleString() }} selected</span
        >
      </div>
      <Table
        v-model:selected-row-ids="selected"
        :data="data"
        :columns="columns"
        selectable
        resizable
        reorderable
        :default-sort="{ key: 'mrr', direction: 'desc' }"
        :height="420"
        :row-height="52"
        class="rounded-2xl"
      />
    </div>
  </div>
</template>
```

<a id="editable"></a>
### Editable Table

编辑单元格数值，同时保留表格的键盘与行导航方式。

**复制源码**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { Table, type TableColumn } from "@/components/orvui/motion/table";
import { Switch } from "@/components/orvui/motion/switch";
const rows = ref<Record<string, string>[]>([
  { id: "r1", name: "Ava Cole", role: "Owner", team: "Design" },
  { id: "r2", name: "Leo Frost", role: "Admin", team: "Growth" },
  { id: "r3", name: "Mia Vale", role: "Member", team: "Design" },
  { id: "r4", name: "Kai Reyes", role: "Member", team: "Platform" },
]);
const keys = ref(["name", "role", "team"]),
  labels = ref<Record<string, string>>({
    name: "Name",
    role: "Role",
    team: "Team",
  }),
  editable = ref(true);
let rowSequence = 5,
  columnSequence = 1;
const columns = computed<TableColumn<Record<string, string>>[]>(() =>
  keys.value.map((key, index) => ({
    key,
    header: labels.value[key] ?? key,
    editable: editable.value,
    width: index ? "180px" : undefined,
  })),
);
function edit(id: string, key: string, value: string) {
  rows.value = rows.value.map((row) =>
    row.id === id ? { ...row, [key]: value } : row,
  );
}
function insertRow(index: number, position: "before" | "after") {
  rows.value.splice(index + (position === "after" ? 1 : 0), 0, {
    id: `r${rowSequence++}`,
  });
}
function deleteRow(id: string) {
  rows.value = rows.value.filter((row) => row.id !== id);
}
function rename(key: string, value: string) {
  labels.value = { ...labels.value, [key]: value };
}
function insertColumn(index: number, position: "before" | "after") {
  const key = `field${columnSequence}`;
  labels.value[key] = `Field ${columnSequence++}`;
  keys.value.splice(index + (position === "after" ? 1 : 0), 0, key);
  rows.value = rows.value.map((row) => ({ ...row, [key]: "" }));
}
function deleteColumn(key: string) {
  keys.value = keys.value.filter((entry) => entry !== key);
  rows.value = rows.value.map((row) =>
    Object.fromEntries(Object.entries(row).filter(([entry]) => entry !== key)),
  );
}
</script>
<template>
  <div class="flex w-full flex-col gap-3 p-4">
    <div class="flex items-center justify-between">
      <p class="text-xs text-muted-foreground">
        {{
          editable
            ? "Click a cell to edit. Use the column and row handles to insert or delete."
            : "Read-only."
        }}
      </p>
      <Switch v-model="editable" label="Editable" />
    </div>
    <Table
      :data="rows"
      :columns="columns"
      :get-row-id="(row) => row.id"
      :row-height="48"
      :height="Math.min(Math.max(rows.length, 1), 6) * 48"
      :on-cell-edit="editable ? edit : undefined"
      :on-column-rename="editable ? rename : undefined"
      :on-insert-row="editable ? insertRow : undefined"
      :on-delete-row="editable ? deleteRow : undefined"
      :on-insert-column="editable ? insertColumn : undefined"
      :on-delete-column="editable ? deleteColumn : undefined"
      ><template #empty
        ><button
          type="button"
          class="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          @click="insertRow(0, 'before')"
        >
          Insert first row
        </button></template
      ></Table
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { Table, type TableColumn } from "@orvui/vue/motion/table";
import { Switch } from "@orvui/vue/motion/switch";
const rows = ref<Record<string, string>[]>([
  { id: "r1", name: "Ava Cole", role: "Owner", team: "Design" },
  { id: "r2", name: "Leo Frost", role: "Admin", team: "Growth" },
  { id: "r3", name: "Mia Vale", role: "Member", team: "Design" },
  { id: "r4", name: "Kai Reyes", role: "Member", team: "Platform" },
]);
const keys = ref(["name", "role", "team"]),
  labels = ref<Record<string, string>>({
    name: "Name",
    role: "Role",
    team: "Team",
  }),
  editable = ref(true);
let rowSequence = 5,
  columnSequence = 1;
const columns = computed<TableColumn<Record<string, string>>[]>(() =>
  keys.value.map((key, index) => ({
    key,
    header: labels.value[key] ?? key,
    editable: editable.value,
    width: index ? "180px" : undefined,
  })),
);
function edit(id: string, key: string, value: string) {
  rows.value = rows.value.map((row) =>
    row.id === id ? { ...row, [key]: value } : row,
  );
}
function insertRow(index: number, position: "before" | "after") {
  rows.value.splice(index + (position === "after" ? 1 : 0), 0, {
    id: `r${rowSequence++}`,
  });
}
function deleteRow(id: string) {
  rows.value = rows.value.filter((row) => row.id !== id);
}
function rename(key: string, value: string) {
  labels.value = { ...labels.value, [key]: value };
}
function insertColumn(index: number, position: "before" | "after") {
  const key = `field${columnSequence}`;
  labels.value[key] = `Field ${columnSequence++}`;
  keys.value.splice(index + (position === "after" ? 1 : 0), 0, key);
  rows.value = rows.value.map((row) => ({ ...row, [key]: "" }));
}
function deleteColumn(key: string) {
  keys.value = keys.value.filter((entry) => entry !== key);
  rows.value = rows.value.map((row) =>
    Object.fromEntries(Object.entries(row).filter(([entry]) => entry !== key)),
  );
}
</script>
<template>
  <div class="flex w-full flex-col gap-3 p-4">
    <div class="flex items-center justify-between">
      <p class="text-xs text-muted-foreground">
        {{
          editable
            ? "Click a cell to edit. Use the column and row handles to insert or delete."
            : "Read-only."
        }}
      </p>
      <Switch v-model="editable" label="Editable" />
    </div>
    <Table
      :data="rows"
      :columns="columns"
      :get-row-id="(row) => row.id"
      :row-height="48"
      :height="Math.min(Math.max(rows.length, 1), 6) * 48"
      :on-cell-edit="editable ? edit : undefined"
      :on-column-rename="editable ? rename : undefined"
      :on-insert-row="editable ? insertRow : undefined"
      :on-delete-row="editable ? deleteRow : undefined"
      :on-insert-column="editable ? insertColumn : undefined"
      :on-delete-column="editable ? deleteColumn : undefined"
      ><template #empty
        ><button
          type="button"
          class="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          @click="insertRow(0, 'before')"
        >
          Insert first row
        </button></template
      ></Table
    >
  </div>
</template>
```

<a id="async"></a>
### Async Table

通过 onEndReached 加载下一页，并保留明确的加载与失败状态。

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { h } from "vue";
import { Table, type TableColumn } from "@/components/orvui/motion/table";

interface DemoPerson {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
  mrr: number;
}
const given = [
    "Ava",
    "Leo",
    "Mia",
    "Kai",
    "Zoe",
    "Eli",
    "Noa",
    "Ren",
    "Ivy",
    "Jude",
  ],
  families = [
    "Cole",
    "Frost",
    "Vale",
    "Reyes",
    "Okafor",
    "Sato",
    "Lund",
    "Marsh",
    "Bose",
    "Quinn",
  ];
const roles = ["Owner", "Admin", "Member", "Viewer"],
  statuses = ["active", "invited", "suspended"] as const;
function buildPeople(count: number, start = 0) {
  const entries: DemoPerson[] = [];
  for (let index = start; index < start + count; index++) {
    const first = given[index % given.length],
      last = families[(index * 7) % families.length];
    entries.push({
      id: String(index),
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${index}@example.com`,
      role: roles[(index * 3) % roles.length],
      status: statuses[(index * 5) % statuses.length],
      mrr: 12 + ((index * 37) % 488),
    });
  }
  return entries;
}
const tone = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  invited: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  suspended: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};
function peopleColumns(sortable: boolean): TableColumn<DemoPerson>[] {
  return [
    {
      key: "name",
      header: "Name",
      ...(sortable ? { sortable: true, width: "1.4fr" } : {}),
      cell: (row) => h("span", { class: "font-medium" }, row.name),
    },
    { key: "email", header: "Email", width: sortable ? "1.8fr" : "220px" },
    {
      key: "role",
      header: "Role",
      ...(sortable ? { sortable: true } : {}),
      width: sortable ? "120px" : "110px",
    },
    {
      key: "status",
      header: "Status",
      width: sortable ? "130px" : "120px",
      cell: (row) =>
        h(
          "span",
          {
            class:
              "rounded-full px-2 py-0.5 font-medium text-xs capitalize " +
              tone[row.status],
          },
          row.status,
        ),
    },
    {
      key: "mrr",
      header: "MRR",
      ...(sortable ? { sortable: true } : {}),
      align: "right",
      width: sortable ? "110px" : "100px",
      cell: (row) =>
        h("span", { class: "tabular-nums" }, "$" + row.mrr.toLocaleString()),
    },
  ];
}

const rows = ref<DemoPerson[]>([]),
  loading = ref(true),
  page = ref(0),
  columns = peopleColumns(false);
let request: ReturnType<typeof setTimeout> | undefined;
function loadMore() {
  if (request !== undefined || page.value >= 8) return;
  const requestedPage = page.value;
  loading.value = true;
  const publishPage = () => {
    const batch = buildPeople(20, requestedPage * 20);
    rows.value = rows.value.concat(batch);
    page.value = requestedPage + 1;
    request = undefined;
    loading.value = false;
  };
  request = setTimeout(publishPage, 700);
}
onMounted(loadMore);
onBeforeUnmount(() => clearTimeout(request));
</script>
<template>
  <div class="flex w-full justify-center p-4">
    <div class="flex w-full flex-col gap-2">
      <div
        class="flex items-center justify-between px-1 text-xs text-muted-foreground"
      >
        <span>{{ rows.length.toLocaleString() }} loaded</span
        ><span>{{
          loading ? "Loading…" : page >= 8 ? "All loaded" : "Scroll for more"
        }}</span>
      </div>
      <Table
        :data="rows"
        :columns="columns"
        :get-row-id="(row) => row.id"
        :height="420"
        :row-height="52"
        :on-end-reached="loadMore"
        :loading="loading"
        class="rounded-2xl"
      />
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { h } from "vue";
import { Table, type TableColumn } from "@orvui/vue/motion/table";

interface DemoPerson {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
  mrr: number;
}
const given = [
    "Ava",
    "Leo",
    "Mia",
    "Kai",
    "Zoe",
    "Eli",
    "Noa",
    "Ren",
    "Ivy",
    "Jude",
  ],
  families = [
    "Cole",
    "Frost",
    "Vale",
    "Reyes",
    "Okafor",
    "Sato",
    "Lund",
    "Marsh",
    "Bose",
    "Quinn",
  ];
const roles = ["Owner", "Admin", "Member", "Viewer"],
  statuses = ["active", "invited", "suspended"] as const;
function buildPeople(count: number, start = 0) {
  const entries: DemoPerson[] = [];
  for (let index = start; index < start + count; index++) {
    const first = given[index % given.length],
      last = families[(index * 7) % families.length];
    entries.push({
      id: String(index),
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${index}@example.com`,
      role: roles[(index * 3) % roles.length],
      status: statuses[(index * 5) % statuses.length],
      mrr: 12 + ((index * 37) % 488),
    });
  }
  return entries;
}
const tone = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  invited: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  suspended: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};
function peopleColumns(sortable: boolean): TableColumn<DemoPerson>[] {
  return [
    {
      key: "name",
      header: "Name",
      ...(sortable ? { sortable: true, width: "1.4fr" } : {}),
      cell: (row) => h("span", { class: "font-medium" }, row.name),
    },
    { key: "email", header: "Email", width: sortable ? "1.8fr" : "220px" },
    {
      key: "role",
      header: "Role",
      ...(sortable ? { sortable: true } : {}),
      width: sortable ? "120px" : "110px",
    },
    {
      key: "status",
      header: "Status",
      width: sortable ? "130px" : "120px",
      cell: (row) =>
        h(
          "span",
          {
            class:
              "rounded-full px-2 py-0.5 font-medium text-xs capitalize " +
              tone[row.status],
          },
          row.status,
        ),
    },
    {
      key: "mrr",
      header: "MRR",
      ...(sortable ? { sortable: true } : {}),
      align: "right",
      width: sortable ? "110px" : "100px",
      cell: (row) =>
        h("span", { class: "tabular-nums" }, "$" + row.mrr.toLocaleString()),
    },
  ];
}

const rows = ref<DemoPerson[]>([]),
  loading = ref(true),
  page = ref(0),
  columns = peopleColumns(false);
let request: ReturnType<typeof setTimeout> | undefined;
function loadMore() {
  if (request !== undefined || page.value >= 8) return;
  const requestedPage = page.value;
  loading.value = true;
  const publishPage = () => {
    const batch = buildPeople(20, requestedPage * 20);
    rows.value = rows.value.concat(batch);
    page.value = requestedPage + 1;
    request = undefined;
    loading.value = false;
  };
  request = setTimeout(publishPage, 700);
}
onMounted(loadMore);
onBeforeUnmount(() => clearTimeout(request));
</script>
<template>
  <div class="flex w-full justify-center p-4">
    <div class="flex w-full flex-col gap-2">
      <div
        class="flex items-center justify-between px-1 text-xs text-muted-foreground"
      >
        <span>{{ rows.length.toLocaleString() }} loaded</span
        ><span>{{
          loading ? "Loading…" : page >= 8 ? "All loaded" : "Scroll for more"
        }}</span>
      </div>
      <Table
        :data="rows"
        :columns="columns"
        :get-row-id="(row) => row.id"
        :height="420"
        :row-height="52"
        :on-end-reached="loadMore"
        :loading="loading"
        class="rounded-2xl"
      />
    </div>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `Table` | `v-model:selectedRowIds` | `string[]` | `update:selectedRowIds` |
| `Table` | `v-model:sort` | `null \| SortState` | `update:sort` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### Table

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `data` | `any[]` | — | 是 | — |
| `columns` | `TableColumn<any>[]` | — | 是 | — |
| `getRowId` | `(row: any, index: number) => string` | — | 否 | Stable id per row, required for correct selection across sorts. Defaults to row index. |
| `selectable` | `boolean` | `false` | 否 | Render a leading checkbox column with select-all in the header. |
| `selectedRowIds` | `string[]` | — | 否 | — |
| `defaultSelectedRowIds` | `string[]` | `() => []` | 否 | — |
| `onSelectionChange` | `(ids: string[]) => void` | — | 否 | — |
| `sort` | `null \| SortState` | — | 否 | — |
| `defaultSort` | `null \| SortState` | `null` | 否 | — |
| `onSortChange` | `(sort: SortState \| null) => void` | — | 否 | — |
| `resizable` | `boolean` | `false` | 否 | Allow dragging the right edge of a header to resize that column. |
| `minColumnWidth` | `number` | `64` | 否 | Minimum column width in px when resizing. |
| `onColumnResize` | `(key: string, width: number) => void` | — | 否 | — |
| `reorderable` | `boolean` | `false` | 否 | Allow dragging a header grip to reorder columns. |
| `onColumnOrderChange` | `(keys: string[]) => void` | — | 否 | — |
| `onCellEdit` | `(rowId: string, columnKey: string, value: string) => void` | — | 否 | Called when an `editable` cell changes. |
| `onColumnRename` | `(columnKey: string, value: string) => void` | — | 否 | When set, non-sortable headers become editable inputs for the column name. |
| `onInsertRow` | `(index: number, position: InsertPosition) => void` | — | 否 | Enables the row menu (Insert before / after). Receives the target index. |
| `onDeleteRow` | `(rowId: string, index: number) => void` | — | 否 | Enables Delete in the row menu. |
| `onInsertColumn` | `(index: number, position: InsertPosition) => void` | — | 否 | Enables the column menu (Insert before / after). Receives the target column index. |
| `onDeleteColumn` | `(columnKey: string, index: number) => void` | — | 否 | Enables Delete in the column menu. |
| `rowHeight` | `number` | `48` | 否 | Fixed row height in px — required for virtualization. |
| `height` | `number` | `440` | 否 | Scroll viewport height in px. |
| `overscan` | `number` | `10` | 否 | Rows rendered above/below the viewport. |
| `onEndReached` | `() => void` | — | 否 | Fires when the viewport scrolls near the bottom — load the next page. |
| `loading` | `boolean` | `false` | 否 | Currently fetching — shows skeleton rows and pauses `onEndReached`. |
| `skeletonRows` | `number` | `3` | 否 | How many skeleton rows to show while loading more (default 3). |
| `emptyState` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren` | `"No data"` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:selectedRowIds` | — | — |
| `selectionChange` | — | — |
| `update:sort` | — | — |
| `sortChange` | — | — |
| `columnResize` | — | — |
| `columnOrderChange` | — | — |
| `cellEdit` | — | — |
| `columnRename` | — | — |
| `insertRow` | — | — |
| `deleteRow` | — | — |
| `insertColumn` | — | — |
| `deleteColumn` | — | — |
| `endReached` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `empty` | `() => VNodeChild` | — | — |
| `['cell-' + column.key]` | — | `row: rows[virtual.index].row`, `value: rows[virtual.index].row[column.key]`, `row-id: rows[virtual.index].id` | — |

<a id="about"></a>
## 关于 Table

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Table？**

通过 data、columns、getRowId、selectable、selectedRowIds、defaultSelectedRowIds、onSelectionChange、sort、defaultSort、onSortChange、resizable、minColumnWidth、onColumnResize、reorderable、onColumnOrderChange、onCellEdit、onColumnRename、onInsertRow、onDeleteRow、onInsertColumn、onDeleteColumn、rowHeight、height、overscan、onEndReached、loading、skeletonRows、emptyState、className 配置 Table；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:selectedRowIds、selectionChange、update:sort、sortChange、columnResize、columnOrderChange、cellEdit、columnRename、insertRow、deleteRow、insertColumn、deleteColumn、endReached，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Input](https://orvui.efu.me/components/motion/input): 在同一输入框中编辑文字，并可配置标签、图标与校验反馈。
- [Select](https://orvui.efu.me/components/motion/select): 从浮动列表选择选项，面板可从触发器连续展开。
- [Checkbox](https://orvui.efu.me/components/motion/checkbox): 通过动态勾选标记表示选中、未选中和半选状态。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/table.json
- 文档: https://orvui.efu.me/components/motion/table
- `packages/vue/src/motion/table/src/Table.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

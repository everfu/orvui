---
title: "Table"
description: "Inspect and edit rows with virtual scrolling, selection, sorting and adjustable columns."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/table"
markdown: "https://orvui.efu.me/en/components/motion/table.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Table

> Inspect and edit rows with virtual scrolling, selection, sorting and adjustable columns.

<a id="when-to-use"></a>

## When to use it

- Use Table when the interface needs this behavior: inspect and edit rows with virtual scrolling, selection, sorting and adjustable columns.

<a id="install"></a>
## Install

### Table — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/table.json
```

### Data Table — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/table.json
```

### Editable Table — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/table-editable.json https://orvui.efu.me/beta/r/switch.json
```

### Async Table — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/table-async.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the local Beta archive; see the Beta installation guide to build it.

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `@tanstack/vue-virtual@^3.13.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Table

**Registry source**

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

**Package**

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

Browse virtualized rows with selection, sorting and adjustable column placement.

**Registry source**

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

**Package**

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

Edit cell values while retaining the table's keyboard and row navigation.

**Registry source**

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

**Package**

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

Load another page through onEndReached and retain explicit loading and failure states.

**Registry source**

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

**Package**

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
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `Table` | `v-model:selectedRowIds` | `string[]` | `update:selectedRowIds` |
| `Table` | `v-model:sort` | `null \| SortState` | `update:sort` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### Table

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `data` | `any[]` | — | Yes | — |
| `columns` | `TableColumn<any>[]` | — | Yes | — |
| `getRowId` | `(row: any, index: number) => string` | — | No | Stable id per row, required for correct selection across sorts. Defaults to row index. |
| `selectable` | `boolean` | `false` | No | Render a leading checkbox column with select-all in the header. |
| `selectedRowIds` | `string[]` | — | No | — |
| `defaultSelectedRowIds` | `string[]` | `() => []` | No | — |
| `onSelectionChange` | `(ids: string[]) => void` | — | No | — |
| `sort` | `null \| SortState` | — | No | — |
| `defaultSort` | `null \| SortState` | `null` | No | — |
| `onSortChange` | `(sort: SortState \| null) => void` | — | No | — |
| `resizable` | `boolean` | `false` | No | Allow dragging the right edge of a header to resize that column. |
| `minColumnWidth` | `number` | `64` | No | Minimum column width in px when resizing. |
| `onColumnResize` | `(key: string, width: number) => void` | — | No | — |
| `reorderable` | `boolean` | `false` | No | Allow dragging a header grip to reorder columns. |
| `onColumnOrderChange` | `(keys: string[]) => void` | — | No | — |
| `onCellEdit` | `(rowId: string, columnKey: string, value: string) => void` | — | No | Called when an `editable` cell changes. |
| `onColumnRename` | `(columnKey: string, value: string) => void` | — | No | When set, non-sortable headers become editable inputs for the column name. |
| `onInsertRow` | `(index: number, position: InsertPosition) => void` | — | No | Enables the row menu (Insert before / after). Receives the target index. |
| `onDeleteRow` | `(rowId: string, index: number) => void` | — | No | Enables Delete in the row menu. |
| `onInsertColumn` | `(index: number, position: InsertPosition) => void` | — | No | Enables the column menu (Insert before / after). Receives the target column index. |
| `onDeleteColumn` | `(columnKey: string, index: number) => void` | — | No | Enables Delete in the column menu. |
| `rowHeight` | `number` | `48` | No | Fixed row height in px — required for virtualization. |
| `height` | `number` | `440` | No | Scroll viewport height in px. |
| `overscan` | `number` | `10` | No | Rows rendered above/below the viewport. |
| `onEndReached` | `() => void` | — | No | Fires when the viewport scrolls near the bottom — load the next page. |
| `loading` | `boolean` | `false` | No | Currently fetching — shows skeleton rows and pauses `onEndReached`. |
| `skeletonRows` | `number` | `3` | No | How many skeleton rows to show while loading more (default 3). |
| `emptyState` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren` | `"No data"` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
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

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `empty` | `() => VNodeChild` | — | — |
| `['cell-' + column.key]` | — | `row: rows[virtual.index].row`, `value: rows[virtual.index].row[column.key]`, `row-id: rows[virtual.index].id` | — |

<a id="about"></a>
## About Table

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Table?**

Configure Table through data, columns, getRowId, selectable, selectedRowIds, defaultSelectedRowIds, onSelectionChange, sort, defaultSort, onSortChange, resizable, minColumnWidth, onColumnResize, reorderable, onColumnOrderChange, onCellEdit, onColumnRename, onInsertRow, onDeleteRow, onInsertColumn, onDeleteColumn, rowHeight, height, overscan, onEndReached, loading, skeletonRows, emptyState, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:selectedRowIds, selectionChange, update:sort, sortChange, columnResize, columnOrderChange, cellEdit, columnRename, insertRow, deleteRow, insertColumn, deleteColumn, endReached to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Input](https://orvui.efu.me/en/components/motion/input): Edit text with optional labels, icons and validation feedback in a single field.
- [Select](https://orvui.efu.me/en/components/motion/select): Choose from a floating list whose panel can expand continuously from its trigger.
- [Checkbox](https://orvui.efu.me/en/components/motion/checkbox): Represent checked, unchecked and mixed values with an animated check mark.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/table.json
- Documentation: https://orvui.efu.me/en/components/motion/table
- `packages/vue/src/motion/table/src/Table.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

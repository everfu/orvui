<script setup lang="ts">
import { computed, h, nextTick, onBeforeUnmount, ref, watch } from "vue";
import {
  Bot,
  Clock3,
  Check,
  FolderKanban,
  Maximize2,
  MessageSquarePlus,
  Minimize2,
  PanelLeft,
  Paperclip,
  Search,
  User,
  WandSparkles,
} from "lucide-vue-next";
import { ChatApp } from "./index";
import { AISidebar, type SidebarResource } from "../ai-sidebar";
import { AgentActivity } from "../agent-activity";
import {
  ApprovalCard,
  type ApprovalCardQuestion,
  type ApprovalCardStatus,
} from "../approval-card";
import { CodeBlock } from "../code-block";
import { FileDiff } from "../file-diff";
import { ImageGeneration } from "../image-generation";
import { ThinkingShimmer } from "../loading-states";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "../message";
import { MessageBubble, MessageBubbleContent } from "../message-bubble";
import { MessageScroller } from "../message-scroller";
import { PromptInput } from "../prompt-input";
import { StreamingResponse } from "../streaming-response";
import { TodoList, type TodoItem } from "../todo-list";
import {
  ToolApproval,
  ToolApprovalCode,
  type ToolApprovalStatus,
} from "../tool-approval";
import { ToolResult, ToolResultOutput } from "../tool-result";
import {
  AnimatedSidebar,
  AnimatedSidebarContent,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarInset,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem,
  AnimatedSidebarRail,
  AnimatedSidebarTrigger,
} from "../../motion/animated-sidebar";
import { ActionSwapIcon } from "../../motion/action-swap";
import { useOverlay, useReducedMotion } from "../../lib/composables";
import { cn } from "../../lib/utils";
const resources: SidebarResource[] = [
  {
    id: "release",
    label: "Release workspace",
    kind: "project",
    children: [
      { id: "checkout", label: "Checkout audit", kind: "file" },
      { id: "release-notes", label: "Release notes", kind: "file" },
      { id: "references", label: "Research sources", kind: "bookmark" },
    ],
  },
  {
    id: "design",
    label: "Design system",
    kind: "folder",
    children: [
      { id: "tokens", label: "Motion tokens", kind: "file" },
      { id: "components", label: "Component inventory", kind: "file" },
    ],
  },
  { id: "archive", label: "Archived runs", kind: "folder" },
];

const diffLines = [
  {
    id: "context-1",
    type: "context" as const,
    oldLine: 41,
    newLine: 41,
    content: "  const total = subtotal + shipping;",
  },
  {
    id: "removed-1",
    type: "removed" as const,
    oldLine: 42,
    content: "  return submitOrder(total);",
  },
  {
    id: "added-1",
    type: "added" as const,
    newLine: 42,
    content: "  const result = validateOrder({ total, items });",
  },
  {
    id: "added-2",
    type: "added" as const,
    newLine: 43,
    content: "  return result.ok ? submitOrder(total) : result;",
  },
];

const approvalQuestions: ApprovalCardQuestion[] = [
  {
    id: "release",
    title: "How should the patch be released?",
    options: [
      { value: "focused", label: "Ship the focused checkout fix" },
      { value: "bundle", label: "Bundle it with the next release" },
    ],
    allowCustom: true,
    customPlaceholder: "Add another release instruction…",
  },
];

const reply =
  "I’ll keep the patch focused, preserve the current checkout layout, and run the same validation path before preparing the release.";

interface AddedMessage {
  id: string;
  from: "user" | "assistant";
  content: string;
  streaming?: boolean;
}
const reduce = useReducedMotion(),
  items = ref(resources),
  activeResource = ref("checkout"),
  input = ref("");
const pending = ref(false),
  activeReply = ref<string | null>(null),
  messages = ref<AddedMessage[]>([]);
const toolStatus = ref<ToolApprovalStatus>("pending"),
  approvalStatus = ref<ApprovalCardStatus>("pending");
const busy = computed(() => pending.value || activeReply.value !== null);
const actions = [
  { value: "attach", label: "Attach file", icon: () => h(Paperclip) },
  {
    value: "project",
    label: "Add project context",
    icon: () => h(FolderKanban),
  },
  { value: "skill", label: "Use a skill", icon: () => h(WandSparkles) },
];
const parameters = [
  {
    id: "command",
    label: "Command",
    value: () =>
      h(ToolApprovalCode, {
        code: "bun test checkout --coverage",
        language: "bash",
      }),
  },
  { id: "scope", label: "Scope", value: "Current workspace" },
];
const activity = [
  {
    id: "reason",
    type: "text" as const,
    content: "Tracing the checkout submission path and validation boundary.",
  },
  {
    id: "read",
    type: "tool" as const,
    action: "read",
    target: "checkout/submit.ts",
  },
  {
    id: "search",
    type: "search" as const,
    query: "order validation failures",
    results: [
      {
        id: "result-1",
        title: "Agent interface guide",
        domain: "example.com",
        url: "/docs/ai-agents",
      },
    ],
  },
];
const sources = [
  {
    id: "message",
    title: "Message composition",
    domain: "example.com",
    url: "/components/agents/message",
  },
  {
    id: "diff",
    title: "File Diff",
    domain: "example.com",
    url: "/components/agents/file-diff",
  },
  {
    id: "approval",
    title: "Tool Approval",
    domain: "example.com",
    url: "/components/agents/tool-approval",
  },
];
const validationCode =
  "export function validateOrder(order: Order) {\n  return schema.safeParse(order);\n}";

const plan = computed<TodoItem[]>(() => {
  const checks =
    toolStatus.value === "complete"
      ? "completed"
      : toolStatus.value === "running"
        ? "in-progress"
        : ["denied", "error"].includes(toolStatus.value)
          ? "cancelled"
          : "pending";
  return [
    { id: "inspect", title: "Inspect the checkout flow", status: "completed" },
    { id: "patch", title: "Prepare the validation patch", status: "completed" },
    { id: "checks", title: "Run focused checks", status: checks },
    {
      id: "review",
      title: "Collect release approval",
      status: toolStatus.value === "complete" ? "in-progress" : "pending",
    },
  ];
});
function createChannel() {
  let generation = 0;
  const handles = new Set<ReturnType<typeof setTimeout>>();
  return {
    cancel() {
      generation++;
      handles.forEach(clearTimeout);
      handles.clear();
    },
    after(delay: number, action: () => void) {
      const version = generation;
      const handle = setTimeout(() => {
        handles.delete(handle);
        if (version === generation) action();
      }, delay);
      handles.add(handle);
    },
  };
}
const tools = createChannel(),
  chat = createChannel(),
  approval = createChannel();
let turn = 0,
  frame: number | undefined;
function approveTool() {
  tools.cancel();
  toolStatus.value = "approving";
  (
    [
      ["approved", 450],
      ["running", 850],
      ["complete", 1650],
    ] as const
  ).forEach(([status, delay]) =>
    tools.after(delay, () => {
      toolStatus.value = status;
    }),
  );
}
function denyTool() {
  tools.cancel();
  toolStatus.value = "denied";
}
function cancelFrame() {
  if (frame !== undefined) cancelAnimationFrame(frame);
  frame = undefined;
}
function beginReply(id: string) {
  cancelFrame();
  const message = messages.value.find((candidate) => candidate.id === id);
  if (!message) return;
  if (reduce.value) {
    message.content = reply;
    message.streaming = false;
    activeReply.value = null;
    return;
  }
  const origin = performance.now();
  const render = (now: number) => {
    if (activeReply.value !== id) return;
    const count = Math.min(reply.length, Math.floor((now - origin) * 0.092));
    message.content = reply.substring(0, count);
    if (count < reply.length) frame = requestAnimationFrame(render);
    else {
      frame = undefined;
      message.streaming = false;
      activeReply.value = null;
    }
  };
  frame = requestAnimationFrame(render);
}
function submit(value: string) {
  if (!value.trim() || busy.value) return;
  const serial = turn++,
    assistant = `assistant-${serial}`;
  messages.value.push({ id: `user-${serial}`, from: "user", content: value });
  input.value = "";
  pending.value = true;
  chat.after(reduce.value ? 0 : 420, () => {
    messages.value.push({
      id: assistant,
      from: "assistant",
      content: "",
      streaming: true,
    });
    pending.value = false;
    activeReply.value = assistant;
    beginReply(assistant);
  });
}
function stop() {
  chat.cancel();
  cancelFrame();
  pending.value = false;
  activeReply.value = null;
  messages.value.forEach((message) => {
    message.streaming = false;
  });
}
watch(reduce, () => {
  if (activeReply.value) beginReply(activeReply.value);
});
function approveRelease() {
  approval.cancel();
  approvalStatus.value = "submitting";
  approval.after(650, () => {
    approvalStatus.value = "answered";
  });
}
onBeforeUnmount(() => {
  tools.cancel();
  approval.cancel();
  stop();
});
const expanded = ref(false),
  container = ref<HTMLElement | null>(null),
  toggle = ref<HTMLButtonElement | null>(null);
const overlay = useOverlay(
  expanded,
  container,
  () => {
    expanded.value = false;
  },
  () => toggle.value ?? undefined,
);
let revision = 0;
const isolated = new Map<
  HTMLElement,
  { inert: boolean; hidden: string | null }
>();
function restoreSiblings() {
  isolated.forEach((state, element) => {
    element.inert = state.inert;
    if (state.hidden === null) element.removeAttribute("aria-hidden");
    else element.setAttribute("aria-hidden", state.hidden);
  });
  isolated.clear();
}
watch(
  expanded,
  async (value) => {
    const version = ++revision;
    restoreSiblings();
    await nextTick();
    if (version !== revision) return;
    if (!value) {
      if (!expanded.value) toggle.value?.focus({ preventScroll: true });
      return;
    }
    let branch = container.value;
    while (branch?.parentElement) {
      const parent = branch.parentElement;
      Array.from(parent.children).forEach((element) => {
        if (
          !(element instanceof HTMLElement) ||
          element === branch ||
          overlay.containsOwnedPortal(element)
        )
          return;
        isolated.set(element, {
          inert: element.inert,
          hidden: element.getAttribute("aria-hidden"),
        });
        element.inert = true;
        element.setAttribute("aria-hidden", "true");
      });
      if (parent === document.body) break;
      branch = parent;
    }
  },
  { flush: "post" },
);
onBeforeUnmount(() => {
  revision++;
  restoreSiblings();
});
</script>
<template>
  <Teleport to="body" :disabled="!expanded"
    ><div
      ref="container"
      role="dialog"
      :aria-modal="expanded || undefined"
      aria-label="Chat app preview"
      :tabindex="expanded ? -1 : undefined"
      :class="
        cn(
          'relative w-full bg-background px-0 py-2 sm:p-3',
          expanded &&
            'fixed inset-0 z-[100] h-dvh overscroll-contain p-3 sm:p-4',
        )
      "
    >
      <button
        ref="toggle"
        type="button"
        @click="expanded = !expanded"
        :aria-label="expanded ? 'Exit expanded preview' : 'Expand preview'"
        :title="expanded ? 'Exit expanded preview' : 'Expand preview'"
        class="absolute top-5 right-24 z-50 grid size-10 place-items-center rounded-full border border-border/80 bg-background/90 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ActionSwapIcon
          :value="expanded ? 'minimize' : 'maximize'"
          animation="blur"
          ><Minimize2 v-if="expanded" class="size-4" /><Maximize2
            v-else
            class="size-4"
        /></ActionSwapIcon></button
      ><ChatApp
        sidebar-width="17rem"
        :class="cn('h-[760px]', expanded && 'h-full')"
        ><AnimatedSidebar
          aria-label="Agent workspace"
          collapsible="offcanvas"
          class="min-h-0"
          panel-class-name="h-full bg-background"
          ><AnimatedSidebarContent class="gap-4 overflow-hidden px-2 py-4"
            ><AnimatedSidebarGroup class="shrink-0 px-1 py-0"
              ><AnimatedSidebarGroupContent
                ><AnimatedSidebarMenu class="gap-1"
                  ><AnimatedSidebarMenuItem
                    v-for="action in [
                      { label: 'New task', icon: MessageSquarePlus },
                      { label: 'Search', icon: Search },
                      { label: 'Runs', icon: Clock3 },
                    ]"
                    :key="action.label"
                    ><AnimatedSidebarMenuButton class="font-normal"
                      ><template #icon
                        ><component
                          :is="action.icon"
                          class="size-4" /></template
                      >{{ action.label }}</AnimatedSidebarMenuButton
                    ></AnimatedSidebarMenuItem
                  ></AnimatedSidebarMenu
                ></AnimatedSidebarGroupContent
              ></AnimatedSidebarGroup
            ><AnimatedSidebarGroup class="min-h-0 flex-1 px-1 py-0"
              ><AnimatedSidebarGroupLabel
                class="mb-1 h-8 px-2 text-xs font-medium normal-case tracking-normal"
                >Projects</AnimatedSidebarGroupLabel
              ><AnimatedSidebarGroupContent
                class="relative min-h-0 flex-1 overflow-hidden"
                ><div
                  class="h-full overflow-y-auto overscroll-contain pb-8 [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  <AISidebar
                    v-model:items="items"
                    v-model:active-id="activeResource"
                    :default-expanded-ids="['release', 'design']"
                  />
                </div>
                <div
                  aria-hidden="true"
                  class="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent" /></AnimatedSidebarGroupContent></AnimatedSidebarGroup></AnimatedSidebarContent
          ><AnimatedSidebarRail
        /></AnimatedSidebar>
        <AnimatedSidebarInset class="min-h-0 bg-background"
          ><header
            class="flex h-14 shrink-0 items-center justify-between border-border border-b px-4"
          >
            <div class="flex min-w-0 items-center gap-2.5">
              <AnimatedSidebarTrigger
                class="text-muted-foreground hover:bg-muted hover:text-foreground"
                ><PanelLeft class="size-4"
              /></AnimatedSidebarTrigger>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-foreground">
                  Checkout release
                </p>
                <p class="truncate text-[11px] text-muted-foreground">
                  Agent workspace · focused patch
                </p>
              </div>
            </div>
            <span
              class="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
              >Connected</span
            >
          </header>
          <MessageScroller
            :busy="busy"
            navigation="rail"
            class="min-h-0 flex-1"
            viewport-class-name="px-3 py-5 sm:px-5"
            content-class-name="mx-auto min-h-full w-full max-w-3xl"
            ><MessageGroup spacing="default">
              <Message from="user"
                ><MessageAvatar><User /></MessageAvatar
                ><MessageContent
                  ><MessageHeader
                    ><span>You</span><span>10:24</span></MessageHeader
                  ><MessageBubble variant="solid"
                    ><MessageBubbleContent
                      >Audit the checkout flow, fix the validation gap, and
                      prepare a release-ready patch.</MessageBubbleContent
                    ></MessageBubble
                  ></MessageContent
                ></Message
              >
              <Message from="assistant"
                ><MessageAvatar><Bot /></MessageAvatar
                ><MessageContent class="gap-3"
                  ><MessageHeader
                    ><span>orvui Agent</span><span>10:24</span></MessageHeader
                  ><AgentActivity
                    status="complete"
                    :duration="6"
                    default-open
                    :collapse-on-complete="false"
                    :items="activity" /><TodoList
                    :items="plan"
                    title="Release plan"
                    :collapse-on-complete="false" /></MessageContent
              ></Message>
              <Message from="assistant"
                ><MessageAvatar placeholder /><MessageContent
                  ><ToolApproval
                    tool="terminal.run"
                    title="Run focused checkout checks?"
                    description="The agent needs permission to run the validation and accessibility suites."
                    :status="toolStatus"
                    default-open
                    :parameters="parameters"
                    @approve="approveTool"
                    @always-allow="approveTool"
                    @deny="denyTool" /></MessageContent
              ></Message>
              <Message
                v-if="toolStatus === 'running' || toolStatus === 'complete'"
                from="assistant"
                animate-in
                ><MessageAvatar placeholder /><MessageContent class="gap-3"
                  ><ToolResult
                    tool="terminal.run"
                    :title="
                      toolStatus === 'running'
                        ? 'Running checkout checks'
                        : 'Checkout checks passed'
                    "
                    :status="toolStatus === 'running' ? 'running' : 'success'"
                    kind="terminal"
                    :meta="toolStatus === 'running' ? 'Live' : '2.8s'"
                    default-open
                    :collapse-on-complete="false"
                    ><ToolResultOutput>{{
                      toolStatus === "running"
                        ? "✓ validation contract\n… checkout keyboard flow"
                        : "✓ validation contract\n✓ checkout keyboard flow\n✓ order submission recovery"
                    }}</ToolResultOutput></ToolResult
                  ><template v-if="toolStatus === 'complete'"
                    ><FileDiff
                      file="checkout/submit.ts"
                      :lines="diffLines"
                      status="complete"
                      default-open
                      :collapse-on-complete="false" /><CodeBlock
                      filename="validation.ts"
                      language="typescript"
                      status="complete"
                      :code="validationCode"
                      show-line-numbers /></template></MessageContent
              ></Message>
              <Message
                v-else-if="toolStatus === 'denied' || toolStatus === 'error'"
                from="assistant"
                animate-in
                ><MessageAvatar placeholder /><MessageContent
                  ><ToolResult
                    tool="terminal.run"
                    title="Checkout checks were not run"
                    :status="toolStatus === 'denied' ? 'cancelled' : 'error'"
                    kind="terminal"
                    default-open
                    :collapse-on-complete="false"
                    ><ToolResultOutput>{{
                      toolStatus === "denied"
                        ? "Permission was not granted. No command was run."
                        : "The command could not be completed."
                    }}</ToolResultOutput></ToolResult
                  ></MessageContent
                ></Message
              >
              <Message
                v-if="toolStatus === 'complete'"
                from="assistant"
                animate-in
                ><MessageAvatar placeholder /><MessageContent class="gap-3"
                  ><ImageGeneration
                    status="complete"
                    prompt="a clear checkout confirmation screen"
                    resolution="1280 × 840"
                    size="compact"
                    ><svg
                      viewBox="0 0 640 420"
                      aria-hidden="true"
                      class="size-full"
                    >
                      <rect
                        width="640"
                        height="420"
                        fill="currentColor"
                        class="text-muted"
                      />
                      <rect
                        x="64"
                        y="52"
                        width="512"
                        height="316"
                        rx="28"
                        fill="currentColor"
                        class="text-background"
                      />
                      <circle
                        cx="320"
                        cy="144"
                        r="38"
                        fill="currentColor"
                        class="text-emerald-500"
                      />
                      <Check
                        x="290"
                        y="115"
                        :width="60"
                        :height="60"
                        stroke="white"
                        :stroke-width="3.6"
                      />
                      <rect
                        x="204"
                        y="210"
                        width="232"
                        height="18"
                        rx="9"
                        fill="currentColor"
                        class="text-foreground/85"
                      />
                      <rect
                        x="238"
                        y="246"
                        width="164"
                        height="12"
                        rx="6"
                        fill="currentColor"
                        class="text-muted-foreground/35"
                      />
                      <rect
                        x="248"
                        y="298"
                        width="144"
                        height="34"
                        rx="17"
                        fill="currentColor"
                        class="text-foreground"
                      /></svg></ImageGeneration
                  ><MessageBubble variant="ghost" class="w-full"
                    ><MessageBubbleContent
                      ><StreamingResponse
                        status="complete"
                        copy-text="The checkout patch is ready for review."
                        :sources="sources"
                        ><p>The checkout patch is ready for review.</p>
                        <ul>
                          <li
                            v-for="line in [
                              'Validation now runs before submission.',
                              'Failure output stays inside the current flow.',
                              'Focused checks pass without changing the layout.',
                            ]"
                            :key="line"
                          >
                            {{ line }}
                          </li>
                        </ul></StreamingResponse
                      ></MessageBubbleContent
                    ></MessageBubble
                  ></MessageContent
                ></Message
              >
              <Message
                v-if="toolStatus === 'complete'"
                from="assistant"
                animate-in
                ><MessageAvatar placeholder /><MessageContent
                  ><ApprovalCard
                    :questions="approvalQuestions"
                    :status="approvalStatus"
                    @submit="approveRelease"
                    result="Release direction sent to the agent." /></MessageContent
              ></Message>
              <Message
                v-for="message in messages"
                :key="message.id"
                :from="message.from"
                animate-in
                ><MessageAvatar
                  ><Bot v-if="message.from === 'assistant'" /><User
                    v-else /></MessageAvatar
                ><MessageContent
                  ><MessageHeader v-if="message.from === 'assistant'"
                    ><span>orvui Agent</span><span>Now</span></MessageHeader
                  ><MessageBubble
                    :variant="message.from === 'user' ? 'solid' : 'soft'"
                    ><MessageBubbleContent
                      ><StreamingResponse
                        v-if="message.from === 'assistant'"
                        :status="message.streaming ? 'streaming' : 'complete'"
                        :show-actions="!message.streaming"
                        :copy-text="message.content"
                        >{{ message.content }}</StreamingResponse
                      ><template v-else>{{
                        message.content
                      }}</template></MessageBubbleContent
                    ></MessageBubble
                  ><MessageFooter v-if="message.from === 'user'"
                    >Sent</MessageFooter
                  ></MessageContent
                ></Message
              >
              <Message v-if="pending" from="assistant" animate-in
                ><MessageAvatar><Bot /></MessageAvatar
                ><MessageContent
                  ><ThinkingShimmer
                    >Reviewing your direction</ThinkingShimmer
                  ></MessageContent
                ></Message
              >
            </MessageGroup></MessageScroller
          >
          <div class="shrink-0 border-border border-t bg-background p-3">
            <div class="mx-auto max-w-3xl">
              <PromptInput
                v-model="input"
                :loading="busy"
                @stop="stop"
                @submit="submit"
                :min-rows="1"
                :max-rows="4"
                placeholder="Ask the agent to continue…"
                :models="[
                  { value: 'balanced', label: 'Balanced' },
                  { value: 'fast', label: 'Fast' },
                  { value: 'deep', label: 'Deep reasoning' },
                ]"
                default-model="balanced"
                :actions="actions"
              />
            </div>
          </div> </AnimatedSidebarInset
      ></ChatApp></div
  ></Teleport>
</template>

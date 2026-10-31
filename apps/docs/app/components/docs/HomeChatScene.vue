<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import {
  BookOpen,
  Bot,
  Compass,
  Copy,
  FileText,
  MessageSquare,
  MessageSquarePlus,
  Paperclip,
  Search,
  Share2,
  Sparkles,
} from "lucide-vue-next";
import { Button } from "../../../../../packages/vue/src/motion/button";
import { Input } from "../../../../../packages/vue/src/motion/input";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../../../../../packages/vue/src/motion/collapsible";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "../../../../../packages/vue/src/agents/message";
import {
  MessageBubble,
  MessageBubbleContent,
} from "../../../../../packages/vue/src/agents/message-bubble";
import { MessageScroller } from "../../../../../packages/vue/src/agents/message-scroller";
import { PromptInput } from "../../../../../packages/vue/src/agents/prompt-input";
import { StreamingResponse } from "../../../../../packages/vue/src/agents/streaming-response";
import {
  ToolApproval,
  ToolApprovalCode,
  type ToolApprovalStatus,
} from "../../../../../packages/vue/src/agents/tool-approval";
import {
  ToolResult,
  ToolResultOutput,
} from "../../../../../packages/vue/src/agents/tool-result";
import { CodeBlock } from "../../../../../packages/vue/src/agents/code-block";
import { ImageGeneration } from "../../../../../packages/vue/src/agents/image-generation";
import { ReasoningText } from "../../../../../packages/vue/src/agents/loading-states";
import { CitationList } from "../../../../../packages/vue/src/agents/citations";
import { useReducedMotion } from "../../../../../packages/vue/src/lib/composables";
import HomeAppFrame from "./HomeAppFrame.vue";
import { useSiteShell } from "../../composables/site-shell-state";
import { useSiteCopy } from "../../composables/use-site-copy";
const { t, routeTo } = useSiteShell();
const reduce = useReducedMotion(),
  frame = ref<InstanceType<typeof HomeAppFrame>>();
const active = ref("showcase"),
  prompt = ref(""),
  response = ref(""),
  submitted = ref(""),
  loading = ref(false),
  stopped = ref(false),
  search = ref(false),
  query = ref(""),
  attachment = ref("");
const approval = ref<ToolApprovalStatus>("pending");
const file = ref<HTMLInputElement>();
const code =
  "import { ref } from 'vue'\nimport { Button } from '@orvui/vue'\n\nconst ready = ref(false)";
const answer = t(
  "可以。将侧栏、消息、输入框与工具结果组合起来，就能构建完整的 AI 工作空间。\n\n消息状态由应用管理，orvui 负责清晰的层次、自然的过渡和及时的反馈。",
  "Absolutely. Compose a sidebar, messages, prompt input, and tool results into a complete AI workspace.\n\nYour application owns the conversation state. orvui brings clear hierarchy, natural transitions, and responsive feedback.",
);
const navigation = computed(() => [
  { id: "new", label: t("新对话", "New chat"), icon: MessageSquarePlus },
  { id: "library", label: t("资料库", "Library"), icon: BookOpen },
  { id: "explore", label: t("探索", "Explore"), icon: Compass },
  ...[
    { id: "showcase", label: t("AI 组件组合", "AI components showcase") },
    { id: "ideas", label: t("下一次产品迭代", "The next product iteration") },
    { id: "launch", label: t("季度发布计划", "Quarterly launch plan") },
    { id: "copy", label: t("首页文案探索", "Homepage copy ideas") },
    { id: "weekly", label: t("每周团队摘要", "Weekly team summary") },
  ]
    .filter((item) =>
      item.label.toLowerCase().includes(query.value.toLowerCase()),
    )
    .map((item) => ({
      ...item,
      icon: MessageSquare,
      group: t("最近", "Recent"),
    })),
]);
const sources = [
  {
    id: "components",
    title: t("组件目录", "Component catalog"),
    domain: "orvui",
    url: routeTo("agents"),
    icon: BookOpen,
  },
  {
    id: "input",
    title: "Prompt Input",
    domain: "orvui",
    url: routeTo("agents", "prompt-input"),
    icon: BookOpen,
  },
  {
    id: "messages",
    title: "Message",
    domain: "orvui",
    url: routeTo("agents", "message"),
    icon: BookOpen,
  },
];
const { copied, copyText } = useSiteCopy(2000);
let timer: ReturnType<typeof setTimeout> | undefined;
function cancel() {
  if (timer !== undefined) clearTimeout(timer);
  timer = undefined;
  loading.value = false;
}
function stop() {
  cancel();
  stopped.value = true;
}
function submit(value: string) {
  if (loading.value || !value.trim()) return;
  cancel();
  submitted.value = value.trim();
  prompt.value = "";
  response.value = "";
  stopped.value = false;
  loading.value = true;
  let index = 0;
  function tick() {
    index = reduce.value ? answer.length : Math.min(answer.length, index + 2);
    response.value = answer.slice(0, index);
    if (index < answer.length) timer = setTimeout(tick, 60);
    else {
      timer = undefined;
      loading.value = false;
    }
  }
  timer = setTimeout(tick, 160);
}
function choose(value: string) {
  cancel();
  active.value = value;
  submitted.value = "";
  response.value = "";
  prompt.value = "";
  attachment.value = "";
  approval.value = "pending";
}
function attach(event: Event) {
  attachment.value = (event.target as HTMLInputElement).files?.[0]?.name ?? "";
}
onBeforeUnmount(cancel);
</script>
<template>
  <div data-scene="chat">
    <HomeAppFrame
      ref="frame"
      :active="active"
      :items="navigation"
      :title="
        navigation.find((item) => item.id === active)?.label ||
        t('新对话', 'New chat')
      "
      :subtitle="t('本地演示', 'Local demo')"
      user="Alex Morgan"
      @update:active="choose"
    >
      <template #actions="{ notify }"
        ><Button
          size="sm"
          variant="secondary"
          :aria-pressed="search"
          @click="search = !search"
          ><Search :size="14" />{{ t("搜索", "Search") }}</Button
        ><Button
          size="sm"
          @click="
            copyText(t('orvui AI 组件组合演示', 'orvui AI composition demo'));
            notify(t('演示标题已复制', 'Demo title copied'));
          "
          ><Share2 :size="14" />{{
            copied ? t("已复制", "Copied") : t("分享", "Share")
          }}</Button
        ></template
      >
      <div class="home-chat-layout">
        <Input
          v-if="search"
          v-model="query"
          :placeholder="t('搜索最近对话…', 'Search recent chats…')"
          :aria-label="t('搜索最近对话', 'Search recent chats')"
          class="home-chat-search"
        />
        <MessageScroller
          :follow-output="!!submitted"
          :busy="loading"
          :label="t('示例会话', 'Demo conversation')"
          viewport-class-name="h-full"
          content-class-name="home-chat-transcript"
          class="home-chat-scroller"
        >
          <template v-if="active === 'showcase'">
            <Message from="user"
              ><MessageBubble
                ><MessageBubbleContent>{{
                  t(
                    "展示一下推理、Markdown 和代码。",
                    "Show me reasoning, Markdown, and code.",
                  )
                }}</MessageBubbleContent></MessageBubble
              ></Message
            >
            <Message from="assistant"
              ><MessageAvatar><Bot :size="15" /></MessageAvatar
              ><MessageContent
                ><Collapsible
                  ><CollapsibleTrigger>{{
                    t("思考过程", "Reasoning")
                  }}</CollapsibleTrigger
                  ><CollapsibleContent
                    ><p class="home-chat-reasoning">
                      {{
                        t(
                          "先梳理组件职责，再让数据和交互自然连接。",
                          "Start with component responsibilities, then connect data and interactions naturally.",
                        )
                      }}
                    </p></CollapsibleContent
                  ></Collapsible
                ><StreamingResponse status="complete" :copy-text="code"
                  ><p>
                    {{
                      t(
                        "把状态与界面组合起来：",
                        "Compose state and interface:",
                      )
                    }}
                  </p>
                  <CodeBlock
                    :code="code"
                    filename="studio.ts"
                    :show-line-numbers="false"
                  />
                  <ul>
                    <li>
                      {{
                        t(
                          "基于 Vue Composition API",
                          "Built with the Vue Composition API",
                        )
                      }}
                    </li>
                    <li>
                      {{
                        t(
                          "应用管理消息与工具状态",
                          "Your app owns messages and tool state",
                        )
                      }}
                    </li>
                    <li>
                      {{
                        t(
                          "自由组合，而非固定模板",
                          "Compose freely with your own structure",
                        )
                      }}
                    </li>
                  </ul></StreamingResponse
                ></MessageContent
              ></Message
            >
            <Message from="user"
              ><MessageBubble
                ><MessageBubbleContent>{{
                  t("工具调用也能组合吗？", "Can we compose tool calls too?")
                }}</MessageBubbleContent></MessageBubble
              ></Message
            >
            <Message from="assistant"
              ><MessageAvatar><Bot :size="15" /></MessageAvatar
              ><MessageContent
                ><Collapsible
                  ><CollapsibleTrigger>{{
                    t("2 次工具调用", "2 tool calls")
                  }}</CollapsibleTrigger
                  ><CollapsibleContent
                    ><ToolResult
                      tool="readComponents"
                      :title="t('读取组件目录', 'Read component catalog')"
                      status="success"
                      :collapse-on-complete="false"
                      ><ToolResultOutput>{{
                        t(
                          "找到 109 个组件，72 个注册示例。",
                          "Found 109 components and 72 registered examples.",
                        )
                      }}</ToolResultOutput></ToolResult
                    ><ToolResult
                      tool="buildPreview"
                      :title="t('组合预览', 'Compose preview')"
                      status="success"
                      :collapse-on-complete="false"
                      ><ToolResultOutput>{{
                        t("本地组合已准备好。", "Local composition is ready.")
                      }}</ToolResultOutput></ToolResult
                    ></CollapsibleContent
                  ></Collapsible
                ></MessageContent
              ></Message
            >
            <Message from="user"
              ><MessageBubble
                ><MessageBubbleContent>{{
                  t("如果操作需要批准呢？", "What if an action needs approval?")
                }}</MessageBubbleContent></MessageBubble
              ></Message
            >
            <Message from="assistant"
              ><MessageAvatar><Bot :size="15" /></MessageAvatar
              ><MessageContent
                ><ToolApproval
                  tool="createDemoPreview"
                  :title="t('创建一个演示预览？', 'Create a demo preview?')"
                  :description="
                    t('仅更新当前示例状态。', 'Updates this example only.')
                  "
                  :status="approval"
                  :default-open="true"
                  :parameters="[
                    {
                      id: 'name',
                      label: t('名称', 'Name'),
                      value: 'orvui-studio',
                    },
                  ]"
                  @approve="approval = 'approved'"
                  @deny="approval = 'denied'"
                  ><ToolApprovalCode
                    code='{ "name": "orvui-studio" }' /></ToolApproval></MessageContent
            ></Message>
            <Message from="user"
              ><MessageBubble
                ><MessageBubbleContent>{{
                  t(
                    "还有媒体、来源和附件。",
                    "And media, sources, and attachments?",
                  )
                }}</MessageBubbleContent></MessageBubble
              ></Message
            >
            <Message from="assistant"
              ><MessageAvatar><Bot :size="15" /></MessageAvatar
              ><MessageContent
                ><ImageGeneration
                  status="complete"
                  :label="t('orvui 品牌预览', 'orvui brand preview')"
                  aspect-ratio="1.91 / 1"
                  size="fluid"
                  :interactive="false"
                  :show-status="false"
                  ><img
                    src="/social/orvui-v2.png"
                    :alt="
                      t('orvui 品牌分享图', 'orvui brand sharing image')
                    " /></ImageGeneration
                ><StreamingResponse
                  status="complete"
                  :copy-text="answer"
                  :sources="sources"
                  ><p>
                    {{
                      t(
                        "将消息、媒体与来源放在同一个连贯的体验里。",
                        "Bring messages, media, and sources into one continuous experience.",
                      )
                    }}
                  </p></StreamingResponse
                ></MessageContent
              ></Message
            >
          </template>
          <template v-else-if="active === 'library' || active === 'explore'"
            ><div class="home-chat-welcome">
              <Sparkles :size="28" />
              <h3>
                {{ t("从组件开始探索", "Start exploring with components") }}
              </h3>
              <CitationList :citations="sources" /></div
          ></template>
          <div v-else-if="!submitted" class="home-chat-welcome">
            <Sparkles :size="30" />
            <h3>{{ t("有什么新想法？", "What is your next idea?") }}</h3>
            <p>
              {{ t("一起把它变成界面。", "Let’s turn it into an interface.") }}
            </p>
          </div>
          <template v-if="submitted"
            ><Message from="user"
              ><MessageBubble
                ><MessageBubbleContent>{{
                  submitted
                }}</MessageBubbleContent></MessageBubble
              ></Message
            ><Message from="assistant"
              ><MessageAvatar><Bot :size="15" /></MessageAvatar
              ><MessageContent
                ><ReasoningText
                  v-if="loading && !response"
                  :phrases="[
                    t('正在思考', 'Thinking'),
                    t('组合想法', 'Connecting ideas'),
                  ]"
                /><StreamingResponse
                  v-else
                  :status="loading ? 'streaming' : 'complete'"
                  :copy-text="response"
                  @retry="submit(submitted)"
                  ><p class="home-response">
                    {{ response }}
                  </p></StreamingResponse
                >
                <p v-if="stopped" role="status" class="home-chat-stopped">
                  {{ t("已停止生成", "Generation stopped") }}
                </p></MessageContent
              ></Message
            ></template
          >
        </MessageScroller>
        <div class="home-chat-composer">
          <p v-if="attachment" class="home-attachment">
            <FileText :size="13" />{{ attachment }}
          </p>
          <input ref="file" type="file" hidden @change="attach" /><PromptInput
            v-model="prompt"
            :loading="loading"
            :aria-label="t('聊天消息', 'Chat message')"
            :placeholder="t('输入一条消息…', 'Write a message…')"
            :models="[
              { value: 'demo', label: 'orvui AI' },
              { value: 'studio', label: 'Studio AI' },
            ]"
            default-model="demo"
            :actions="[
              {
                value: 'file',
                label: t('添加附件', 'Attach a file'),
                icon: Paperclip,
              },
            ]"
            @action="file?.click()"
            @submit="submit"
            @stop="stop"
            ><template #leading-action
              ><span class="home-prompt-caption">{{
                t("本地示例回复", "Scripted local response")
              }}</span></template
            ></PromptInput
          >
        </div>
      </div>
    </HomeAppFrame>
  </div>
</template>

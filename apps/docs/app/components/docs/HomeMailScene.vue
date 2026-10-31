<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Clock,
  FileText,
  Inbox,
  Mail,
  Pencil,
  Reply,
  Search,
  Send,
  ShieldAlert,
  Star,
  Trash2,
  X,
} from "lucide-vue-next";
import { Button } from "../../../../../packages/vue/src/motion/button";
import { Input } from "../../../../../packages/vue/src/motion/input";
import { Drawer } from "../../../../../packages/vue/src/motion/drawer";
import HomeAppFrame from "./HomeAppFrame.vue";
import { useTemplateContext } from "../../templates/context";
import { initials } from "../../utils/docs/home-demo-data";
const { t } = useTemplateContext();
const frame = ref<InstanceType<typeof HomeAppFrame>>();
const active = ref("inbox"),
  query = ref(""),
  selectedId = ref("launch"),
  reading = ref(false),
  composing = ref(false),
  recipient = ref(""),
  subject = ref(""),
  body = ref("");
const mails = ref([
  {
    id: "launch",
    from: "Alex Morgan",
    email: "alex@example.com",
    time: "10:21",
    subject: t("发布回顾与下一步", "Release review & next steps"),
    preview: t(
      "一起确认这次发布的最后几项细节。",
      "A few final details before our next release.",
    ),
    body: t(
      "大家好，\n\n今天的发布评审已经完成。新的组件组合、主题设置和响应式布局都已准备就绪。\n\n下一步，我们会一起检查键盘交互、移动端阅读体验与文档入口，让每个细节都保持一致。\n\n明天上午我们再快速同步一次。期待看到大家的新想法！\n\nAlex",
      "Hi team,\n\nToday's release review is complete. The new compositions, theme controls, and responsive layouts are ready.\n\nNext, let's review keyboard interactions, the mobile reading experience, and documentation links so every detail feels consistent.\n\nLet's catch up tomorrow morning. Looking forward to your next ideas!\n\nAlex",
    ),
    star: true,
    unread: true,
    folder: "inbox",
  },
  {
    id: "invoice",
    from: "Billing",
    email: "billing@example.com",
    time: t("昨天", "Yesterday"),
    subject: t("十月工作空间账单", "Your October workspace invoice"),
    preview: t(
      "本月账单已生成，可在工作空间查看。",
      "Your monthly invoice is ready in your workspace.",
    ),
    body: t(
      "十月的工作空间账单已生成。\n\n这是一封本地演示邮件，不包含真实账单或付款操作。",
      "Your October workspace invoice is ready.\n\nThis is a local sample email. There is no real invoice or payment action.",
    ),
    star: true,
    unread: true,
    folder: "inbox",
  },
  {
    id: "trip",
    from: "Travel",
    email: "travel@example.com",
    time: "Oct 22",
    subject: t("下一站：设计与技术", "Next stop: design & technology"),
    preview: t(
      "你的会议行程已经整理好了。",
      "Your conference itinerary is ready.",
    ),
    body: t(
      "行程已整理完毕。\n\n周四：设计系统交流。\n周五：Vue 社区工作坊。\n\n祝你旅途愉快！",
      "Your itinerary is ready.\n\nThursday: design systems meetup.\nFriday: Vue community workshop.\n\nEnjoy the trip!",
    ),
    star: false,
    unread: false,
    folder: "inbox",
  },
  {
    id: "review",
    from: "Source",
    email: "source@example.com",
    time: "09:02",
    subject: t("新的代码评审请求", "A new code review is ready"),
    preview: t(
      "组件无障碍与主题适配的改进等待评审。",
      "Accessibility and theme updates are ready to review.",
    ),
    body: t(
      "有一项新的评审等待查看。\n\n本次更新改善了焦点反馈与主题适配，请在本地工作空间查看详情。",
      "A new review is waiting.\n\nThis update improves focus feedback and theme adaptation. Review the details in your local workspace.",
    ),
    star: false,
    unread: true,
    folder: "inbox",
  },
  {
    id: "design",
    from: "Maya Chen",
    email: "maya@example.com",
    time: t("周一", "Mon"),
    subject: t("工作台设计评审", "Studio design review"),
    preview: t(
      "关于布局、色彩与交互节奏的一些想法。",
      "Some ideas on layout, color, and interaction rhythm.",
    ),
    body: t(
      "我整理了几个值得一起讨论的方向。\n\n保持清晰的层次，让组件之间的联系自然呈现。我们在下一次评审中一起看看。",
      "I've collected a few directions to discuss.\n\nLet's keep the hierarchy clear and let the connections between components come through naturally. We can review them together.",
    ),
    star: false,
    unread: false,
    folder: "inbox",
  },
  {
    id: "weekly",
    from: "Jordan Lee",
    email: "jordan@example.com",
    time: t("周一", "Mon"),
    subject: t("本周进展", "This week's progress"),
    preview: t(
      "8 项任务已完成，新的迭代正在进行。",
      "Eight tasks completed. The next iteration is underway.",
    ),
    body: t(
      "本周已完成 8 项任务。\n\n文档结构、组件组合与测试覆盖均有进展。接下来继续打磨细节。",
      "Eight tasks are complete this week.\n\nDocumentation, component compositions, and test coverage are moving forward. Next up: the details.",
    ),
    star: false,
    unread: false,
    folder: "inbox",
  },
  {
    id: "weekend",
    from: "Sam Rivera",
    email: "sam@example.com",
    time: t("周日", "Sun"),
    subject: t("周末见？", "See you this weekend?"),
    preview: t(
      "一起去看看新的设计展览吧。",
      "Let's visit that new design exhibition.",
    ),
    body: t(
      "周末有空吗？\n\n一起去看看新的设计展览，然后找个地方喝杯咖啡。",
      "Free this weekend?\n\nLet's visit the new design exhibition and find somewhere for coffee.",
    ),
    star: false,
    unread: false,
    folder: "inbox",
  },
]);
const navigation = computed(() => [
  {
    id: "inbox",
    label: t("收件箱", "Inbox"),
    icon: Inbox,
    badge: String(
      mails.value.filter((item) => item.folder === "inbox" && item.unread)
        .length,
    ),
  },
  {
    id: "starred",
    label: t("星标", "Starred"),
    icon: Star,
    badge: String(mails.value.filter((item) => item.star).length),
  },
  { id: "sent", label: t("已发送", "Sent"), icon: Send },
  { id: "drafts", label: t("草稿", "Drafts"), icon: FileText },
  { id: "snoozed", label: t("稍后处理", "Snoozed"), icon: Clock },
  { id: "archive", label: t("归档", "Archive"), icon: Archive },
  { id: "spam", label: t("垃圾邮件", "Spam"), icon: ShieldAlert },
  { id: "trash", label: t("回收站", "Trash"), icon: Trash2 },
]);
const filtered = computed(() =>
  mails.value.filter(
    (item) =>
      (active.value === "starred" ? item.star : item.folder === active.value) &&
      `${item.from} ${item.subject} ${item.preview}`
        .toLowerCase()
        .includes(query.value.toLowerCase()),
  ),
);
const current = computed(() =>
  mails.value.find((item) => item.id === selectedId.value),
);
function choose(id: string) {
  selectedId.value = id;
  reading.value = true;
  const mail = mails.value.find((item) => item.id === id);
  if (mail) mail.unread = false;
}
function folder(value: string) {
  active.value = value;
  query.value = "";
  selectedId.value = filtered.value[0]?.id ?? "";
  reading.value = false;
}
function move(value: string) {
  if (!current.value) return;
  current.value.folder = value;
  selectedId.value = filtered.value[0]?.id ?? "";
  frame.value?.notify(
    value === "trash"
      ? t("已移到演示回收站", "Moved to demo trash")
      : t("已归档", "Archived"),
  );
}
function next(delta: number) {
  const index = filtered.value.findIndex(
    (item) => item.id === selectedId.value,
  );
  const item =
    filtered.value[
      (index + delta + filtered.value.length) % filtered.value.length
    ];
  if (item) choose(item.id);
}
function compose(reply = false) {
  recipient.value = reply ? (current.value?.email ?? "") : "";
  subject.value = reply ? `Re: ${current.value?.subject ?? ""}` : "";
  body.value = "";
  composing.value = true;
}
function send() {
  if (!recipient.value.trim() || !subject.value.trim() || !body.value.trim())
    return;
  const id = `local-${mails.value.length}`;
  mails.value.unshift({
    id,
    from: t("我", "You"),
    email: recipient.value,
    time: t("刚刚", "Just now"),
    subject: subject.value,
    preview: body.value,
    body: body.value,
    star: false,
    unread: false,
    folder: "sent",
  });
  composing.value = false;
  folder("sent");
  choose(id);
  frame.value?.notify(
    t(
      "已保存到演示已发送，没有发送真实邮件",
      "Saved to demo Sent. No real email was sent.",
    ),
  );
}
</script>
<template>
  <div data-scene="mail">
    <HomeAppFrame
      ref="frame"
      :active="active"
      :items="navigation"
      :title="t('邮件', 'Mail')"
      user="Alex Morgan"
      @update:active="folder"
    >
      <template #sidebar
        ><div class="home-mail-labels">
          <p>{{ t("标签", "Labels") }}</p>
          <span
            v-for="label in [
              t('工作', 'Work'),
              t('个人', 'Personal'),
              t('账单', 'Billing'),
              t('旅行', 'Travel'),
              t('紧急', 'Urgent'),
            ]"
            :key="label"
            ><i />{{ label }}</span
          ><Button size="sm" class="w-full" @click="compose()"
            ><Pencil :size="14" />{{ t("新邮件", "New email") }}</Button
          >
        </div></template
      >
      <template #actions
        ><Button size="sm" @click="compose()"
          ><Pencil :size="14" />{{ t("撰写", "Compose") }}</Button
        ></template
      >
      <div class="home-mail-layout" :class="{ 'is-reading': reading }">
        <section
          class="home-mail-list"
          :aria-label="t('邮件列表', 'Message list')"
        >
          <div class="home-mail-search">
            <Input
              v-model="query"
              :left-icon="Search"
              :placeholder="t('搜索邮件…', 'Search mail…')"
              :aria-label="t('搜索邮件', 'Search mail')"
            />
          </div>
          <div class="home-mail-items">
            <article
              v-for="(mail, index) in filtered"
              :key="mail.id"
              class="home-mail-item"
              :class="{ selected: current?.id === mail.id }"
            >
              <button class="home-mail-select" @click="choose(mail.id)">
                <span
                  class="home-avatar"
                  :style="{ '--avatar-hue': `${index * 45}deg` }"
                  >{{ initials(mail.from) }}</span
                ><span class="home-mail-summary"
                  ><strong
                    >{{ mail.from
                    }}<small
                      >{{ mail.time }} <i v-if="mail.unread" /></small></strong
                  ><span>{{ mail.subject }}</span
                  ><small>{{ mail.preview }}</small></span
                ></button
              ><button
                class="home-mail-star"
                :class="{ selected: mail.star }"
                :aria-label="
                  mail.star
                    ? t('移除星标：', 'Unstar: ') + mail.subject
                    : t('添加星标：', 'Star: ') + mail.subject
                "
                :aria-pressed="mail.star"
                @click="mail.star = !mail.star"
              >
                <Star :size="15" :fill="mail.star ? 'currentColor' : 'none'" />
              </button>
            </article>
            <p v-if="!filtered.length" class="home-empty">
              {{ t("没有邮件", "No messages") }}
            </p>
          </div>
        </section>
        <section
          class="home-mail-reader"
          :aria-label="t('邮件阅读区', 'Message reader')"
        >
          <template v-if="current"
            ><div class="home-mail-reader-toolbar">
              <Button
                size="icon"
                variant="ghost"
                class="home-mail-back"
                :aria-label="t('返回邮件列表', 'Back to messages')"
                @click="reading = false"
                ><ArrowLeft :size="16" /></Button
              ><Button
                size="icon"
                variant="ghost"
                :aria-label="t('关闭邮件', 'Close message')"
                @click="
                  selectedId = '';
                  reading = false;
                "
                ><X :size="16" /></Button
              ><Button
                size="icon"
                variant="ghost"
                :aria-label="t('移到回收站', 'Move to trash')"
                @click="move('trash')"
                ><Trash2 :size="15" /></Button
              ><Button
                size="icon"
                variant="ghost"
                :aria-label="t('归档邮件', 'Archive message')"
                @click="move('archive')"
                ><Archive :size="15" /></Button
              ><Button
                size="icon"
                variant="ghost"
                :aria-pressed="current.star"
                :aria-label="t('切换当前邮件星标', 'Toggle message star')"
                @click="current.star = !current.star"
                ><Star
                  :size="15"
                  :fill="current.star ? 'currentColor' : 'none'" /></Button
              ><span>{{ filtered.length }} {{ t("封邮件", "messages") }}</span
              ><Button
                size="icon"
                variant="ghost"
                :aria-label="t('上一封', 'Previous message')"
                @click="next(-1)"
                ><ArrowLeft :size="14" /></Button
              ><Button
                size="icon"
                variant="ghost"
                :aria-label="t('下一封', 'Next message')"
                @click="next(1)"
                ><ArrowRight :size="14"
              /></Button>
            </div>
            <div class="home-mail-message">
              <h3>{{ current.subject }}</h3>
              <div class="home-message-sender">
                <span class="home-avatar">{{ initials(current.from) }}</span>
                <div>
                  <strong>{{ current.from }}</strong
                  ><small
                    >{{ current.email }}<br />{{
                      t("发送给我", "to me")
                    }}</small
                  >
                </div>
                <small>{{ current.time }}</small
                ><Button
                  size="icon"
                  variant="ghost"
                  :aria-label="t('回复邮件', 'Reply to message')"
                  @click="compose(true)"
                  ><Reply :size="16"
                /></Button>
              </div>
              <p>{{ current.body }}</p>
              <Button size="sm" variant="secondary" @click="compose(true)"
                ><Reply :size="14" />{{ t("回复", "Reply") }}</Button
              >
            </div></template
          >
          <div v-else class="home-empty">
            <Mail :size="28" />
            <p>{{ t("选择一封邮件", "Select a message") }}</p>
          </div>
        </section>
      </div> </HomeAppFrame
    ><Drawer
      v-model:open="composing"
      :aria-label="t('撰写演示邮件', 'Compose demo message')"
      class="w-[460px] max-w-[95vw]"
      ><form class="home-compose-form" @submit.prevent="send">
        <div class="home-widget-heading">
          <h3>{{ t("新邮件 · 本地演示", "New message · Local demo") }}</h3>
          <Button
            size="icon"
            variant="ghost"
            :aria-label="t('关闭撰写', 'Close composer')"
            @click="composing = false"
            ><X :size="16"
          /></Button>
        </div>
        <Input
          v-model="recipient"
          :label="t('收件人', 'To')"
          type="email"
          required
        /><Input
          v-model="subject"
          :label="t('主题', 'Subject')"
          required
        /><label class="home-field-label"
          >{{ t("内容", "Message")
          }}<textarea
            v-model="body"
            required
            rows="10"
            class="home-demo-textarea"
          /></label
        ><Button
          type="submit"
          :disabled="!recipient.trim() || !subject.trim() || !body.trim()"
          ><Send :size="14" />{{
            t("保存到演示已发送", "Save to demo Sent")
          }}</Button
        >
      </form></Drawer
    >
  </div>
</template>

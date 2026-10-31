<script setup lang="ts">
import { ref } from "vue";
import {
  BadgeCheck,
  Check,
  FilePlus,
  Mail,
  Pencil,
  Save,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-vue-next";
import { Input } from "../../../../../packages/vue/src/motion/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../../packages/vue/src/motion/select";
import { Switch } from "../../../../../packages/vue/src/motion/switch";
import { Checkbox } from "../../../../../packages/vue/src/motion/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../packages/vue/src/motion/radio";
import { Loader } from "../../../../../packages/vue/src/motion/loader";
import { RangeSlider } from "../../../../../packages/vue/src/motion/range-slider";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../../../packages/vue/src/motion/tabs";
import {
  Button,
  MetallicButton,
  MagneticButton,
} from "../../../../../packages/vue/src/motion/button";
import { Card } from "../../../../../packages/vue/src/motion/card";
import { OTPInput as OtpInput } from "../../../../../packages/vue/src/blocks/otp-input";
import {
  Alert,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "../../../../../packages/vue/src/motion/alert";
import {
  AnimatedToastStack,
  useAnimatedToastStack,
} from "../../../../../packages/vue/src/motion/animated-toast-stack";
import { useSiteShell } from "../../composables/site-shell-state";
import SiteLogo from "./SiteLogo.vue";
import { iconBodies } from "../../utils/docs/sourced-icons";
const { t } = useSiteShell();
const email = ref(""),
  region = ref(""),
  checked = ref(true),
  enabled = ref(true),
  radio = ref("studio"),
  price = ref(250),
  period = ref("1d"),
  channel = ref("chat"),
  otp = ref("4320"),
  notifications = ref(true),
  following = ref(false),
  signedUp = ref(false),
  saved = ref(false),
  signupOpen = ref(true),
  changesOpen = ref(true);
const { toasts, showToast, dismissToast } = useAnimatedToastStack({
  defaultDuration: 3000,
});
const notify = (title: string) =>
  showToast({
    title,
    status: "success",
    dismissible: false,
    action: {
      label: t("关闭", "Dismiss"),
      onClick: (toast) => dismissToast(toast.id),
    },
  });
const periods = ["1D", "7D", "1M", "1Y", "All"];
const actions = [
  {
    icon: FilePlus,
    zh: "新建文件",
    en: "New file",
    detailZh: "创建一个新文件",
    detailEn: "Create a new file",
    key: "⌘ N",
  },
  {
    icon: Pencil,
    zh: "编辑文件",
    en: "Edit file",
    detailZh: "修改内容",
    detailEn: "Make changes",
    key: "⌘ E",
  },
  {
    icon: Trash2,
    zh: "删除文件",
    en: "Delete file",
    detailZh: "移到回收站",
    detailEn: "Move to trash",
    key: "⌘ ⇧ D",
  },
];
</script>
<template>
  <div class="home-components-board" data-scene="components">
    <div class="home-components-column">
      <div class="home-component-fields">
        <Input
          v-model="email"
          :label="t('你的邮箱', 'Your email')"
          placeholder="you@example.com"
          type="email"
          :left-icon="Mail"
        /><small>{{
          t("邮箱仅用于本地演示", "Email stays in this local demo")
        }}</small>
        <div>
          <p class="home-field-label">{{ t("地区", "Region") }}</p>
          <Select v-model="region"
            ><SelectTrigger :aria-label="t('选择地区', 'Choose region')"
              ><SelectValue
                :placeholder="t('请选择', 'Select one')" /></SelectTrigger
            ><SelectContent
              ><SelectItem value="asia">{{ t("亚洲", "Asia") }}</SelectItem
              ><SelectItem value="europe">{{ t("欧洲", "Europe") }}</SelectItem
              ><SelectItem value="americas">{{
                t("美洲", "Americas")
              }}</SelectItem></SelectContent
            ></Select
          >
        </div>
      </div>
      <div class="home-control-samples">
        <Checkbox
          v-model="checked"
          :aria-label="t('示例复选框', 'Example checkbox')"
        /><Switch
          v-model="enabled"
          :aria-label="t('示例开关', 'Example switch')"
        /><RadioGroup
          v-model="radio"
          class="flex flex-row gap-3"
          :aria-label="t('示例单选', 'Example radio')"
          ><RadioGroupItem
            value="personal"
            :aria-label="t('个人', 'Personal')" /><RadioGroupItem
            value="studio"
            :aria-label="t('工作室', 'Studio')" /></RadioGroup
        ><Loader :size="24" :label="t('加载中', 'Loading')" />
      </div>
      <div>
        <div class="home-inline-label">
          <span>{{ t("价格", "Price") }}</span
          ><span>${{ price.toFixed(2) }}</span>
        </div>
        <RangeSlider
          v-model="price"
          :min="0"
          :max="500"
          :step="10"
          :show-ticks="false"
          :aria-label="t('价格', 'Price')"
        />
      </div>
      <Tabs v-model="period" variant="pill"
        ><TabsList
          :aria-label="t('时间范围', 'Time range')"
          class="w-full justify-between"
          ><TabsTrigger
            v-for="item in periods"
            :key="item"
            :value="item.toLowerCase()"
            >{{ item === "All" ? t("全部", "All") : item }}</TabsTrigger
          ></TabsList
        ></Tabs
      >
      <Tabs v-model="channel" variant="segment"
        ><TabsList
          :aria-label="t('消息类别', 'Message type')"
          class="w-full justify-around"
          ><TabsTrigger value="chat">{{ t("聊天", "Chats") }}</TabsTrigger
          ><TabsTrigger value="mail">{{
            t("邮件", "Emails")
          }}</TabsTrigger></TabsList
        ></Tabs
      >
      <Card class="home-action-list" size="compact"
        ><p>{{ t("操作", "Actions") }}</p>
        <template v-for="(action, index) in actions" :key="action.en"
          ><hr v-if="index === 2" />
          <Button
            variant="ghost"
            class="home-file-action"
            @click="notify(t(action.zh, action.en))"
            ><component :is="action.icon" :size="16" aria-hidden="true" /><span
              ><strong>{{ t(action.zh, action.en) }}</strong
              ><small>{{ t(action.detailZh, action.detailEn) }}</small></span
            ><kbd>{{ action.key }}</kbd></Button
          ></template
        ></Card
      >
    </div>
    <div class="home-components-column">
      <div class="home-avatar-stack" aria-label="orvui community">
        <span
          v-for="(initial, index) in ['A', 'L', 'M', 'J', 'K']"
          :key="initial"
          class="home-avatar"
          :style="{ '--avatar-hue': `${index * 55}deg` }"
          >{{ initial }}</span
        ><span class="home-avatar-more">+2</span>
      </div>
      <div class="home-otp">
        <h3>{{ t("验证账户", "Verify account") }}</h3>
        <p>
          {{
            t(
              "验证码已发送至 a****@example.com",
              "A code was sent to a****@example.com",
            )
          }}
        </p>
        <OtpInput
          v-model="otp"
          :length="6"
          class-name="home-otp-control"
          :status="otp.length === 6 ? 'success' : 'idle'"
          :aria-label="t('输入验证码', 'Enter verification code')"
          @complete="notify(t('验证完成', 'Verification complete'))"
        />
        <p>
          {{ t("没有收到验证码？", "No code yet?") }}
          <button
            class="home-text-action"
            @click="
              otp = '';
              notify(t('新的示例验证码已准备好', 'A new demo code is ready'));
            "
          >
            {{ t("重新发送", "Resend") }}
          </button>
        </p>
      </div>
      <div class="home-button-samples">
        <Button size="sm" @click="notify(t('已完成', 'Done'))">{{
          t("点击我", "Click me")
        }}</Button
        ><Button
          size="sm"
          variant="secondary"
          @click="notify(t('已完成', 'Done'))"
          >{{ t("点击我", "Click me") }}</Button
        ><MetallicButton size="sm" @click="notify(t('已完成', 'Done'))">{{
          t("点击我", "Click me")
        }}</MetallicButton
        ><Button
          size="sm"
          variant="outline"
          @click="notify(t('已完成', 'Done'))"
          >{{ t("点击我", "Click me") }}</Button
        ><MagneticButton
          size="sm"
          class="w-full"
          magnetic-class-name="w-full"
          @click="notify(t('已完成', 'Done'))"
          >{{ t("点击我", "Click me") }}</MagneticButton
        ><Button
          size="sm"
          variant="ghost"
          @click="notify(t('已完成', 'Done'))"
          >{{ t("点击我", "Click me") }}</Button
        >
      </div>
      <Card class="home-profile-card"
        ><div class="home-profile-heading">
          <SiteLogo class="home-profile-logo" />
          <div>
            <strong>orvui <BadgeCheck :size="14" aria-hidden="true" /></strong
            ><small>@orvui</small>
          </div>
          <Button size="sm" variant="ghost" @click="following = !following">{{
            following ? t("已关注", "Following") : t("关注", "Follow")
          }}</Button>
        </div>
        <p>
          {{
            t(
              "为 Vue 打造，给每一个想法生动的表达。",
              "Built for Vue. Bring every idea to life.",
            )
          }}
        </p>
        <small
          ><strong>109</strong> {{ t("组件", "components") }}
          <strong>{{ following ? "2.5k" : "2.4k" }}</strong>
          {{ t("创作者", "creators") }}</small
        ></Card
      >
      <Alert
        ><AlertContent
          ><AlertTitle>{{
            t("还剩 2 次体验额度", "You have 2 demo credits left")
          }}</AlertTitle
          ><AlertDescription>{{
            t("探索更多组件组合", "Explore more component combinations")
          }}</AlertDescription></AlertContent
        ><AlertAction
          ><Button
            size="sm"
            variant="secondary"
            @click="notify(t('已开启完整体验', 'Full demo enabled'))"
            >{{ t("升级", "Upgrade") }}</Button
          ></AlertAction
        ></Alert
      >
      <div class="home-notification-sample">
        <div>
          <strong>{{ t("允许通知", "Allow notifications") }}</strong
          ><small>{{
            t("接收工作空间的最新消息", "Updates from your workspace")
          }}</small>
        </div>
        <Switch
          v-model="notifications"
          :aria-label="t('允许通知', 'Allow notifications')"
        />
      </div>
    </div>
    <div class="home-components-column">
      <Card class="home-signup-card"
        ><button
          class="home-card-close"
          :aria-label="t('关闭账户卡片', 'Close account card')"
          @click="signupOpen = !signupOpen"
        >
          <X :size="15" /></button
        ><template v-if="signupOpen"
          ><span class="home-round-icon"><User :size="19" /></span>
          <h3>
            {{
              signedUp
                ? t("欢迎来到 orvui", "Welcome to orvui")
                : t("创建账户", "Create an account")
            }}
          </h3>
          <p>{{ t("从你的下一个想法开始。", "Start with your next idea.") }}</p>
          <Button @click="signedUp = !signedUp">{{
            signedUp
              ? t("重新体验", "Start again")
              : t("立即开始", "Get started")
          }}</Button>
          <div class="home-or-divider">{{ t("或", "or") }}</div>
          <Button
            variant="secondary"
            @click="notify(t('Google 登录演示', 'Google sign-in demo'))"
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden="true"
              class="shrink-0"
              v-html="iconBodies.GoogleIcon"
            />{{ t("使用 Google 继续", "Continue with Google") }}</Button
          ><Button
            variant="secondary"
            @click="notify(t('Apple 登录演示', 'Apple sign-in demo'))"
            ><svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden="true"
              class="shrink-0"
              v-html="iconBodies.AppleIcon"
            />{{ t("使用 Apple 继续", "Continue with Apple") }}</Button
          ></template
        ><Button v-else variant="ghost" @click="signupOpen = true">{{
          t("恢复账户卡片", "Restore account card")
        }}</Button></Card
      >
      <div class="home-community-cards">
        <Card
          v-for="(name, index) in ['Design makers', 'Vue builders']"
          :key="name"
          class="home-community-card"
          ><span class="home-community-art" :class="{ alternate: index === 1 }"
            ><Sparkles v-if="index === 0" :size="28" /><span
              v-else
              class="text-3xl"
              >V</span
            ></span
          >
          <h3>{{ name }}</h3>
          <small>{{ index ? "362" : "148" }} {{ t("位成员", "members") }}</small
          ><span class="home-community-owner"
            ><span class="home-avatar">{{ index ? "M" : "J" }}</span
            >{{ t("创建者 ", "By ") }}{{ index ? "Maya" : "Jordan" }}</span
          ></Card
        >
      </div>
      <Card class="home-unsaved-card"
        ><button
          class="home-card-close"
          :aria-label="t('关闭更改卡片', 'Close changes card')"
          @click="changesOpen = !changesOpen"
        >
          <X :size="15" /></button
        ><template v-if="changesOpen"
          ><span class="home-round-icon"
            ><Check v-if="saved" :size="18" /><Save v-else :size="18"
          /></span>
          <h3>
            {{
              saved
                ? t("更改已保存", "Changes saved")
                : t("未保存的更改", "Unsaved changes")
            }}
          </h3>
          <p>
            {{
              saved
                ? t("所有设置已更新。", "Your settings are up to date.")
                : t(
                    "保存你的设置，继续创作。",
                    "Save your settings and keep creating.",
                  )
            }}
          </p>
          <div class="home-two-buttons">
            <Button
              variant="secondary"
              @click="
                saved = false;
                notify(t('已放弃更改', 'Changes discarded'));
              "
              >{{ t("放弃", "Discard") }}</Button
            ><Button @click="saved = !saved">{{
              saved
                ? t("重新编辑", "Edit again")
                : t("保存更改", "Save changes")
            }}</Button>
          </div></template
        ><Button v-else variant="ghost" @click="changesOpen = true">{{
          t("恢复更改卡片", "Restore changes card")
        }}</Button></Card
      >
    </div>
    <AnimatedToastStack
      :toasts="toasts"
      placement="fixed"
      @dismiss="dismissToast"
    />
  </div>
</template>

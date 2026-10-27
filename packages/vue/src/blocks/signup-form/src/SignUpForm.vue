<script setup lang="ts">
import { ref, useId } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-vue-next";
import { StatefulButton } from "../../../motion/button";
import { Checkbox } from "../../../motion/checkbox";
import { Input } from "../../../motion/input";
import { useReducedMotion } from "../../../lib/composables";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { RenderNode, type Content } from "../../shared";
import type { SignUpValues, SignUpStatus, SignUpErrors } from "./types";
import type { SignUpFormClassNames } from "./source-types";
import { useSignup } from "./use-signup";
const props = withDefaults(
  defineProps<{
    modelValue?: SignUpValues;
    values?: SignUpValues;
    defaultValues?: Partial<SignUpValues>;
    validate?: (values: SignUpValues) => SignUpErrors;
    status?: SignUpStatus;
    errorMessage?: string;
    title?: Content;
    description?: Content;
    submitLabel?: string;
    footer?: Content;
    strengthMeter?: boolean;
    className?: string;
    classNames?: SignUpFormClassNames;
    onSubmit?: (values: SignUpValues) => void | Promise<void>;
  }>(),
  {
    title: "Create your account",
    description: "Start building in under a minute.",
    submitLabel: "Create account",
    strengthMeter: true,
  },
);
const emit = defineEmits<{
  "update:modelValue": [values: SignUpValues];
  valuesChange: [values: SignUpValues];
  success: [values: SignUpValues];
  error: [error: unknown];
}>();
const form = ref<HTMLFormElement>(),
  reveal = ref(false),
  id = useId(),
  reduce = useReducedMotion();
const { values, status, touched, strength, set, shownError, isValid, submit } =
  useSignup(
    props,
    form,
    (next) => {
      emit("update:modelValue", next);
      emit("valuesChange", next);
    },
    (next) => emit("success", next),
    (error) => emit("error", error),
  );
const fields = [
  {
    key: "name",
    label: "Name",
    autocomplete: "name",
    placeholder: "Ada Lovelace",
    icon: User,
    type: "text",
  },
  {
    key: "email",
    label: "Email",
    autocomplete: "email",
    placeholder: "you@example.com",
    icon: Mail,
    type: "email",
  },
] as const;
const strengthLabels = ["Too short", "Weak", "Fair", "Good", "Strong"],
  strengthColors = [
    "bg-destructive",
    "bg-destructive",
    "bg-amber-500",
    "bg-amber-400",
    "bg-(--color-success)",
  ];
</script>
<template>
  <form
    ref="form"
    novalidate
    @submit.prevent="submit"
    :class="
      cn(
        'flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-border p-6',
        className,
        classNames?.root,
      )
    "
  >
    <div
      v-if="title || description"
      :class="cn('flex flex-col gap-1', classNames?.header)"
    >
      <h2
        v-if="title"
        :class="
          cn(
            'text-xl font-semibold tracking-tight text-foreground',
            classNames?.title,
          )
        "
      >
        <RenderNode :node="title" />
      </h2>
      <p
        v-if="description"
        :class="cn('text-sm text-muted-foreground', classNames?.description)"
      >
        <RenderNode :node="description" />
      </p>
    </div>
    <div :class="cn('flex flex-col gap-1', classNames?.fields)">
      <Input
        v-for="field in fields"
        :key="field.key"
        :label="field.label"
        :type="field.type"
        :inputmode="field.key === 'email' ? 'email' : undefined"
        :autocomplete="field.autocomplete"
        :placeholder="field.placeholder"
        :left-icon="field.icon"
        :disabled="status === 'loading'"
        :model-value="values[field.key]"
        @update:model-value="set(field.key, $event)"
        @blur="touched[field.key] = true"
        :error="shownError(field.key)"
        reserve-error-line
        :success="isValid(field.key)"
      />
      <div class="flex flex-col gap-2">
        <Input
          label="Password"
          :type="reveal ? 'text' : 'password'"
          autocomplete="new-password"
          placeholder="At least 8 characters"
          :left-icon="Lock"
          :disabled="status === 'loading'"
          :model-value="values.password"
          @update:model-value="set('password', $event)"
          @blur="touched.password = true"
          :error="shownError('password')"
          reserve-error-line
          ><template #rightIcon
            ><button
              type="button"
              :disabled="status === 'loading'"
              @click="reveal = !reveal"
              :aria-label="reveal ? 'Hide password' : 'Show password'"
              class="text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <EyeOff v-if="reveal" /><Eye v-else /></button></template
        ></Input>
        <AnimatePresence :initial="false"
          ><motion.div
            v-if="strengthMeter && values.password.length > 0"
            :initial="reduce ? { opacity: 0 } : { opacity: 0, y: -4 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="reduce ? { opacity: 0 } : { opacity: 0, y: -4 }"
            :transition="{ duration: 0.18, ease: EASE_OUT }"
            :class="cn('flex flex-col gap-1.5 px-1', classNames?.strength)"
            ><div class="flex gap-1.5" aria-hidden="true">
              <span
                v-for="index in 4"
                :key="index"
                class="h-1 flex-1 overflow-hidden rounded-full bg-muted-foreground/20"
                ><motion.span
                  :initial="false"
                  :animate="{ scaleX: index <= strength ? 1 : 0 }"
                  :transition="reduce ? { duration: 0 } : SPRING_LAYOUT"
                  :class="
                    cn(
                      'block h-full w-full origin-left rounded-full',
                      strengthColors[strength],
                    )
                  "
              /></span>
            </div>
            <p aria-live="polite" class="text-xs text-muted-foreground">
              Password strength: {{ strengthLabels[strength] }}
            </p></motion.div
          ></AnimatePresence
        >
      </div>
      <Input
        label="Confirm password"
        :type="reveal ? 'text' : 'password'"
        autocomplete="new-password"
        placeholder="Re-enter your password"
        :left-icon="Lock"
        :disabled="status === 'loading'"
        :model-value="values.confirmPassword"
        @update:model-value="set('confirmPassword', $event)"
        @blur="touched.confirmPassword = true"
        :error="shownError('confirmPassword')"
        reserve-error-line
        :success="isValid('confirmPassword')"
      />
    </div>
    <div :class="cn('flex flex-col gap-1.5', classNames?.terms)">
      <Checkbox
        :model-value="values.terms"
        :disabled="status === 'loading'"
        @update:model-value="
          set('terms', $event);
          touched.terms = true;
        "
        label="I agree to the Terms and Privacy Policy"
        :aria-describedby="
          shownError('terms') ? id + '-terms-error' : undefined
        "
      /><AnimatePresence :initial="false"
        ><motion.p
          v-if="shownError('terms')"
          :id="id + '-terms-error'"
          role="alert"
          :initial="
            reduce ? { opacity: 0 } : { opacity: 0, y: -4, filter: 'blur(4px)' }
          "
          :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
          :exit="
            reduce ? { opacity: 0 } : { opacity: 0, y: -4, filter: 'blur(4px)' }
          "
          :transition="{ duration: 0.2 }"
          class="px-1 text-xs text-destructive"
          >{{ shownError("terms") }}</motion.p
        ></AnimatePresence
      >
    </div>
    <AnimatePresence :initial="false"
      ><motion.p
        v-if="errorMessage"
        :id="id + '-form-error'"
        role="alert"
        :initial="reduce ? { opacity: 0 } : { opacity: 0, y: -4 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="reduce ? { opacity: 0 } : { opacity: 0, y: -4 }"
        :transition="{ duration: 0.2 }"
        class="rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
        >{{ errorMessage }}</motion.p
      ></AnimatePresence
    >
    <StatefulButton
      type="submit"
      size="lg"
      :state="status"
      loading-text="Creating account"
      success-text="Account created"
      error-text="Try again"
      :aria-describedby="errorMessage ? id + '-form-error' : undefined"
      :class="cn('w-full', classNames?.submit)"
      >{{ submitLabel }}</StatefulButton
    >
    <div
      v-if="$slots.footer || footer"
      :class="
        cn('text-center text-sm text-muted-foreground', classNames?.footer)
      "
    >
      <slot name="footer"><RenderNode :node="footer" /></slot>
    </div>
  </form>
</template>

import { computed, nextTick, ref, type Ref } from "vue";
import {
  defaultValidate,
  passwordStrength,
  type SignUpErrors,
  type SignUpStatus,
  type SignUpValues,
} from "./types";
type Options = {
  modelValue?: SignUpValues;
  values?: SignUpValues;
  defaultValues?: Partial<SignUpValues>;
  validate?: (values: SignUpValues) => SignUpErrors;
  status?: SignUpStatus;
  onSubmit?: (values: SignUpValues) => void | Promise<void>;
};
export function useSignup(
  options: Options,
  form: Ref<HTMLFormElement | undefined>,
  changed: (values: SignUpValues) => void,
  success: (values: SignUpValues) => void,
  failed: (error: unknown) => void,
) {
  const local = ref<SignUpValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
    ...options.defaultValues,
  });
  const localStatus = ref<SignUpStatus>("idle"),
    touched = ref<Partial<Record<keyof SignUpValues, boolean>>>({});
  const values = computed(
      () => options.modelValue ?? options.values ?? local.value,
    ),
    status = computed(() => options.status ?? localStatus.value);
  const errors = computed(() =>
      (options.validate ?? defaultValidate)(values.value),
    ),
    strength = computed(() => passwordStrength(values.value.password));
  let pending = false;
  function set<K extends keyof SignUpValues>(key: K, value: SignUpValues[K]) {
    const next = { ...values.value, [key]: value };
    if (options.modelValue === undefined && options.values === undefined) {
      local.value = next;
      if (
        options.status === undefined &&
        (localStatus.value === "error" || localStatus.value === "success")
      )
        localStatus.value = "idle";
    }
    changed(next);
  }
  const shownError = (key: keyof SignUpValues) =>
    touched.value[key] ? errors.value[key] : undefined;
  const isValid = (key: keyof SignUpValues) =>
    !!touched.value[key] && !errors.value[key] && !!values.value[key];
  async function submit() {
    if (pending || status.value === "loading") return;
    touched.value = {
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    };
    if (Object.keys(errors.value).length) {
      await nextTick();
      form.value?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }
    if (!options.onSubmit) return;
    pending = true;
    if (options.status === undefined) localStatus.value = "loading";
    try {
      await options.onSubmit(values.value);
      if (options.status === undefined) localStatus.value = "success";
      success(values.value);
    } catch (error) {
      if (options.status === undefined) localStatus.value = "error";
      failed(error);
    } finally {
      pending = false;
    }
  }
  return {
    values,
    status,
    touched,
    strength,
    set,
    shownError,
    isValid,
    submit,
  };
}

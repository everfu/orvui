import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { animate, useMotionValue, useTransform } from "motion-v";
import { useControllable, useReduced } from "../../shared";
import { EASE_IN_OUT } from "../../../lib/ease";
export function useCardFolder(
  props: {
    open?: boolean;
    defaultOpen: boolean;
    detailsVisible?: boolean;
    defaultDetailsVisible: boolean;
    cardNumber: string;
    ariaLabel?: string;
    title: string;
    expiry: string;
    disabled?: boolean;
  },
  events: {
    open: (show: boolean) => void;
    details: (show: boolean) => void;
    click: () => void;
  },
) {
  const open = useControllable(
      () => props.open,
      props.defaultOpen,
      events.open,
    ),
    details = useControllable(
      () => props.detailsVisible,
      props.defaultDetailsVisible,
      events.details,
    ),
    reduce = useReduced();
  const progress = useMotionValue(open.value ? 1 : 0);
  const cardTransform = useTransform(progress, (value) => {
    const lift = Math.sin(Math.PI * Math.max(0, Math.min(1, value)));
    return `translateY(${-8 * lift}%) scale(${1 + 0.01 * lift})`;
  });
  const backTransform = useTransform(
    progress,
    [0, 1],
    ["translateY(0%) scaleY(1)", "translateY(18%) scaleY(.18)"],
  );
  const frontTransform = useTransform(
    progress,
    [0, 1],
    ["translateY(0%) rotateX(0deg)", "translateY(18%) rotateX(-72deg)"],
  );
  const purseOpacity = useTransform(progress, [0, 0.76, 1], [1, 1, 0]);
  let control: ReturnType<typeof animate> | undefined,
    ready = false;
  function sync() {
    if (!ready) return;
    control?.stop();
    control = animate(
      progress,
      open.value ? 1 : 0,
      reduce.value ? { duration: 0 } : { duration: 0.28, ease: EASE_IN_OUT },
    );
  }
  watch([open, reduce], sync);
  onMounted(() => {
    ready = true;
    sync();
  });
  onBeforeUnmount(() => {
    ready = false;
    control?.stop();
  });
  const digits = computed(() =>
    Array.from(props.cardNumber)
      .filter((char) => char >= "0" && char <= "9")
      .join(""),
  );
  const lastFour = computed(() => digits.value.slice(-4).padStart(4, "•"));
  const revealed = computed(() =>
    digits.value
      ? Array.from({ length: Math.ceil(digits.value.length / 4) }, (_, index) =>
          digits.value.slice(index * 4, index * 4 + 4),
        ).join(" ")
      : lastFour.value,
  );
  const ariaLabel = computed(
    () =>
      props.ariaLabel ??
      `${open.value ? "Close" : "Open"} ${props.title}, card ending in ${lastFour.value}, expires ${props.expiry}`,
  );
  function toggle() {
    if (props.disabled) return;
    open.value = !open.value;
    events.click();
  }
  return {
    open,
    details,
    reduce,
    cardTransform,
    backTransform,
    frontTransform,
    purseOpacity,
    lastFour,
    revealed,
    ariaLabel,
    toggle,
  };
}

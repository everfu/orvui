import { computed, ref, watch } from "vue";
import { useControllable, type Content } from "../../shared";
export interface Account {
  id: string;
  name: string;
  address: string;
  avatar?: Content;
}
export function useWallet(
  props: {
    accounts: Account[];
    accountId?: string;
    defaultAccountId?: string;
    balance: number;
    balancePrefix: string;
    defaultBalanceHidden: boolean;
    defaultChange?: number;
  },
  change: (id: string) => void,
) {
  const accountId = useControllable(
    () => props.accountId,
    props.defaultAccountId ?? props.accounts[0]?.id ?? "",
    change,
  );
  const account = computed(
    () =>
      props.accounts.find((item) => item.id === accountId.value) ??
      props.accounts[0],
  );
  const hidden = ref(props.defaultBalanceHidden),
    delta = ref(
      props.defaultChange ? { id: 0, amount: props.defaultChange } : null,
    );
  const shownBalance = computed(
    () => props.balancePrefix + money(props.balance),
  );
  let version = 0;
  watch(
    () => props.balance,
    (next, before) => {
      const amount = next - before;
      if (amount) delta.value = { id: ++version, amount };
    },
  );
  return { accountId, account, hidden, delta, shownBalance };
}
export function money(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

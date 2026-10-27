import type { Content } from "../../shared";

export type ApprovalCardStatus =
  | "pending"
  | "submitting"
  | "approved"
  | "rejected"
  | "changes-requested"
  | "answered";

export interface ApprovalCardOption {
  value: string;
  label: string;
  /** Plain supporting text rendered under the label. */
  description?: string;
  disabled?: boolean;
}

export interface ApprovalCardQuestion {
  id: string;
  title: Content;
  description?: Content;
  options?: ApprovalCardOption[];
  multiple?: boolean;
  autoAdvance?: boolean;
  allowCustom?: boolean;
  customPlaceholder?: string;
}

export interface ApprovalCardAnswer {
  selected: string[];
  custom?: string;
}

export type ApprovalCardAnswers = Record<string, ApprovalCardAnswer>;

/** Vue props, including the typed model and business-event listeners. Content is passed through slots. */
export type ApprovalCardProps = InstanceType<
  (typeof import("./ApprovalCard.vue"))["default"]
>["$props"];

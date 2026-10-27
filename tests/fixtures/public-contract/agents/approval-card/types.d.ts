import type { Content as ReactNode } from "../shared";
export type ApprovalCardStatus = "pending" | "submitting" | "approved" | "rejected" | "changes-requested" | "answered";
export interface ApprovalCardOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}
export interface ApprovalCardQuestion {
    id: string;
    title: ReactNode;
    description?: ReactNode;
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
export type ApprovalCardProps = InstanceType<(typeof import("./ApprovalCard.vue"))["default"]>["$props"];

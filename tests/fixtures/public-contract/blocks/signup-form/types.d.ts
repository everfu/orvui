export type SignUpStatus = "idle" | "loading" | "success" | "error";
export interface SignUpValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
}
export type SignUpErrors = Partial<Record<keyof SignUpValues, string>>;
export declare function passwordStrength(password: string): number;
export declare function defaultValidate(v: SignUpValues): SignUpErrors;

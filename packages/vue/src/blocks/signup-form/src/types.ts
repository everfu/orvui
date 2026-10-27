export type SignUpStatus = "idle" | "loading" | "success" | "error";
export interface SignUpValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}
export type SignUpErrors = Partial<Record<keyof SignUpValues, string>>;
export function passwordStrength(password: string) {
  const length = password.length;
  if (length < 8) return 0;
  let variety = 0;
  for (const test of [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/])
    if (test.test(password)) variety++;
  return Math.min(
    4,
    1 + Number(length >= 12) + Number(length >= 16) + Number(variety >= 3),
  );
}
export function defaultValidate(values: SignUpValues): SignUpErrors {
  const errors: SignUpErrors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!values.email.trim()) errors.email = "Enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "That doesn't look like an email address.";
  if (!values.password) errors.password = "Choose a password.";
  else if (values.password.length < 8)
    errors.password = "Use at least 8 characters.";
  if (!values.confirmPassword)
    errors.confirmPassword = "Confirm your password.";
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = "Passwords don't match.";
  if (!values.terms) errors.terms = "Accept the terms to continue.";
  return errors;
}

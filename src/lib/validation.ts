const PASSWORD_COMPLEXITY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

export const PASSWORD_REQUIREMENTS_MESSAGE =
  "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.";

export const isStrongPassword = (value: string): boolean => value.length >= 8 && PASSWORD_COMPLEXITY.test(value);

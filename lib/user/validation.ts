export function validateDisplayName(
  value: string,
  t: (key: string) => string
): string | null {
  const name = value.trim();

  if (name.length === 0) {
    return t("requiredDisplayName");
  }

  if (name.length > 30) {
    return t("displayNameTooLong");
  }

  return null;
}

export function properUsername(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9._]/g, "");
}

export function validateUsername(
  value: string,
  t: (key: string) => string
): string | null {
  if (value.length === 0) {
    return t("requiredUsername");
  }

  if (value.length < 3) {
    return t("usernameTooShort");
  }

  if (value.length > 20) {
    return t("usernameTooLong");
  }

  if (!/^[a-z0-9._]+$/.test(value)) {
    return t("usernameInvalidCharacters");
  }

  if (value.startsWith(".") || value.startsWith("_")) {
    return t("usernameInvalidStart");
  }

  if (value.endsWith(".") || value.endsWith("_")) {
    return t("usernameInvalidEnd");
  }

  return null;
}
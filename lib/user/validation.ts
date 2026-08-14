export function validateDisplayName(value: string): string | null {
  const name = value.trim();

  if (name.length === 0) {
    return "requiredDisplayName";
  }

  if (name.length > 30) {
    return "displayNameTooLong";
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

export function validateUsername(value: string): string | null {
  if (value.length === 0) {
    return "requiredUsername";
  }

  if (value.length < 3) {
    return "usernameTooShort";
  }

  if (value.length > 20) {
    return "usernameTooLong";
  }

  if (!/^[a-z0-9._]+$/.test(value)) {
    return "usernameInvalidCharacters";
  }

  if (value.startsWith(".") || value.startsWith("_")) {
    return "usernameInvalidStart";
  }

  if (value.endsWith(".") || value.endsWith("_")) {
    return "usernameInvalidEnd";
  }

  return null;
}
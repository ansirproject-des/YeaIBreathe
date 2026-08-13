export function validateDisplayName(value: string): string | null {
  const name = value.trim();

  if (name.length === 0) {
    return "Display name is required."
  }

  if (name.length > 30) {
    return "Display name must be 30 characters or less."
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
    return "Username is required.";
  }

  if (value.length < 3) {
    return "Username must be at least 3 characters.";
  }

  if (value.length > 20) {
    return "Username must be 20 characters or less.";
  }

  if (!/^[a-z0-9._]+$/.test(value)) {
    return "Only lowercase letters, numbers, dots and underscores are allowed.";
  }

  if (value.startsWith(".") || value.startsWith("_")) {
    return "Username can't start with a dot or underscore.";
  }

  if (value.endsWith(".") || value.endsWith("_")) {
    return "Username can't end with a dot or underscore.";
  }

  return null;
}
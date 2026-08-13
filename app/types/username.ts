export type AvailabilityStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken";

export type UsernameStatus =
  | AvailabilityStatus
  | "invalid";
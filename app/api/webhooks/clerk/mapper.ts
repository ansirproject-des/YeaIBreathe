export type UserData = {
  clerkId: string,
  email?: string,
  avatar: string,
  firstName?: string,
};

type ClerkUserPayload = {
  id: string,
  first_name: string | null,
  image_url: string,
  email_addresses: {
    email_address: string,

  }[];
};

export function mapClerkUser(data: ClerkUserPayload): UserData {
  return {
    clerkId: data.id,
    email: data.email_addresses[0]?.email_address,
    avatar: data.image_url,
    firstName: data.first_name ?? undefined,
  };
}
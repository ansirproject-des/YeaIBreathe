import { WelcomeModal } from "@/components /onboarding/WelcomeModal";
import { getCurrentDbUser } from "@/lib/user/user";


export default async function WelcomePage() {
  const user = await getCurrentDbUser();
  return (
    <WelcomeModal
    userEmail={user.email}
    avatarUrl={user.avatar}
    clerkFirstName={user.firstName}
    initialDisplayName={user.displayName}
    initialUsername={user.username}
    />
  );
}
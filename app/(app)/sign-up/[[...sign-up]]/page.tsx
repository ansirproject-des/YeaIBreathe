import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      forceRedirectUrl="/welcome"
      signInUrl="/sign-in"
    />
  );
}
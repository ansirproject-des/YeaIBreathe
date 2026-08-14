"use client";

import { useEffect, useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { EmailStep } from "./EmailStep";
import { VerifStep } from "./VerifStep";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { ArrowLeft } from "lucide-react";

export function EmailSignInForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [secondsLeft, setSecondsLeft] = useState(30);

  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  useEffect(() => {
    if (step !== "code") return;
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, secondsLeft]);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    await handleSendCode();
  }

 async function handleSendCode() {
  if (!signIn) {
    setError("Authentication is not ready.");
    return;
  }

  setError("");
  setIsSendingCode(true);

  try {
    await signIn.create({
      identifier: email.trim(),
      signUpIfMissing: true,
    });

    console.log("Sign-in status after create:", signIn.status);
    console.log("Sign-in object:", signIn);

    const { error: sendError } = await signIn.emailCode.sendCode({
      emailAddress: email.trim(),
    });

    if (sendError) {
      console.error("Send code error:", sendError);
      setError(sendError.longMessage ?? sendError.message);
      return;
    }

    setStep("code");
    setSecondsLeft(30);

    console.log("Code sent to:", email);
  } catch (err) {
    console.error("Could not send code:", err);
    setError("Could not send code.");
  } finally {
    setIsSendingCode(false);
  }
}

  async function handleVerify() {
  if (!code.trim()) {
    setError("Please enter the verification code.");
    return;
  }

  if (!signIn) {
    setError("Authentication is not ready.");
    return;
  }

  setError("");
  setIsVerifyingCode(true);

  try {
    const { error } = await signIn.emailCode.verifyCode({
      code: code.trim(),
    });

    if (error) {
      const errorCode = error.code;

      console.error("Verification error:", error);

      if (errorCode === "sign_up_if_missing_transfer") {
        await handleSignUpTransfer();
        return;
      }

      setError(error.longMessage ?? error.message);
      return;
    }

    console.log("Sign-in status after verification:", signIn.status);

    if (signIn.status === "complete") {
  console.log("✅ SIGN IN COMPLETE");
  console.log("Sign-in status:", signIn.status);

  await signIn.finalize();

  window.location.href = "/home";

  return;
}

    console.log("Sign-in is not complete:", signIn.status);
  } catch (err) {
    console.error("Verification failed:", err);
    setError("Verification failed.");
  } finally {
    setIsVerifyingCode(false);
  }
}

  async function handleSignUpTransfer() {
    if (!signUp) {
      setError("Sign-up is not ready.");
      return;
    }

    try {
      const { error } = await signUp.create({
        transfer: true,
      });

      if (error) {
        console.error("Sign-up transfer error:", error);
        setError(error.message);
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            window.location.href = decorateUrl("/home");
          },
        });

        return;
      }

      if (signUp.status === "missing_requirements") {
        console.log(
          "Missing sign-up requirements:",
          signUp.missingFields
        );

        setError("Additional information is required.");
        return;
      }

      console.log("Unexpected sign-up status:", signUp.status);
    } catch (err) {
      console.error("Could not create account:", err);
      setError("Could not create your account.");
    }
  }

  function handleBack() {
    setStep("email");
    setCode("");
    setError("");
    setSecondsLeft(0);
    setIsSendingCode(false);
    setIsVerifyingCode(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div id="clerk-captcha" />
      {step === "email" ? (
        <>
          <div className="w-full lg:max-w-120 flex flex-col p-2 lg:p-3 gap-10">
            <div className="w-full flex flex-col gap-2">
              <h1 className="text-5xl font-bold text-text">
                Welcome
              </h1>

              <p className="max-w-100 text-base text-primary/70">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod.
              </p>
            </div>

            <div className="w-full flex flex-col gap-5">
              <GoogleAuthButton />

              <EmailStep
                email={email}
                error={error}
                isSendingCode={isSendingCode}
                onEmailChange={(value) => {
                  setEmail(value);
                  setError("");
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full lg:max-w-120 flex flex-col p-2 lg:p-3 gap-10">
            <div className="w-full flex flex-col gap-2">
              <button
                className="w-full flex items-center gap-1.5 group cursor-pointer"
                type="button"
                onClick={handleBack}
              >
                <ArrowLeft className="w-7 h-7 group-hover:text-text-muted" />

                <h3 className="text-3xl font-bold text-text group-hover:text-text">
                  Verification
                </h3>
              </button>

              <p className="max-w-100 text-base text-primary/70">
                We&apos;ve sent a 6-digit code to{" "}
                <span className="text-text font-bold">
                  {email}.
                </span>
              </p>
            </div>

            <div className="w-full flex flex-col gap-5">
              <VerifStep
                code={code}
                error={error}
                isSendingCode={isSendingCode}
                isVerifyingCode={isVerifyingCode}
                onCodeChange={setCode}
                onVerify={handleVerify}
                onResend={handleSendCode}
                secondsLeft={secondsLeft}
              />
            </div>
          </div>
        </>
      )}
    </form>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { EmailStep } from "./EmailStep";
import { VerifStep } from "./VerifStep";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

interface ClerkAPIErrorItem {
  code?: string;
  message?: string;
  longMessage?: string;
}

interface ClerkAPIErrorResponse {
  errors: ClerkAPIErrorItem[];
}

function isClerkAPIError(err: unknown): err is ClerkAPIErrorResponse {
  return (
    typeof err === "object" &&
    err !== null &&
    "errors" in err &&
    Array.isArray((err as Record<string, unknown>).errors)
  );
}

function getClerkErrorMessage(err: unknown): string {
  if (isClerkAPIError(err)) {
    return (
      err.errors[0]?.longMessage ??
      err.errors[0]?.message ??
      "An error occurred."
    );
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "An unexpected error occurred.";
}

export function EmailSignInForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const hero = useTranslations("hero");

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) {
      setError(hero("error.enterEmail"));
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

    const cleanEmail = email.trim();

    try {
   
      const { error: createError } = await signIn.create({
        identifier: cleanEmail,
        signUpIfMissing: true,
      });

      if (createError) {
        setError(getClerkErrorMessage(createError));
        return;
      }


      const { error: sendError } = await signIn.emailCode.sendCode();

      if (sendError) {
        setError(getClerkErrorMessage(sendError));
        return;
      }

      setStep("code");
      setSecondsLeft(30);
      setCode("");
    } catch (err: unknown) {

      console.error("Could not send code:", err);
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSendingCode(false);
    }
  }

  async function handleVerify() {
    if (!code.trim()) {
      setError(hero("error.enterVerifCode"));
      return;
    }

    if (!signIn || !signUp) {
      setError("Authentication is not ready.");
      return;
    }

    setError("");
    setIsVerifyingCode(true);

    try {

      const { error: verifyError } = await signIn.emailCode.verifyCode({
        code: code.trim(),
      });

      if (verifyError) {

        if (
          isClerkAPIError(verifyError) &&
          verifyError.errors[0]?.code === "sign_up_if_missing_transfer"
        ) {
          await handleSignUpTransfer();
          return;
        }

        setError(getClerkErrorMessage(verifyError));
        return;
      }


      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize();

        if (finalizeError) {
          setError(getClerkErrorMessage(finalizeError));
          return;
        }

        window.location.href = "/home";
        return;
      }

      setError("Sign-in could not be completed.");
    } catch (err: unknown) {
      console.error("Verification failed:", err);
      setError(getClerkErrorMessage(err));
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

      const { error: createError } = await signUp.create({
        transfer: true,
      });

      if (createError) {
        setError(getClerkErrorMessage(createError));
        return;
      }

      if (signUp.status === "complete") {
        const { error: finalizeError } = await signUp.finalize();

        if (finalizeError) {
          setError(getClerkErrorMessage(finalizeError));
          return;
        }

        window.location.href = "/welcome";
        return;
      }

     if (signUp.status === "missing_requirements") {
  setError(
    `Missing: ${signUp.missingFields?.join(", ") || "unknown"}`
  );

  return;
}
      setError("Could not complete account creation.");
    } catch (err: unknown) {
      console.error("Could not create account:", err);
      setError(getClerkErrorMessage(err));
    }
  }

  function handleBack() {
    setStep("email");
    setCode("");
    setError("");
    setSecondsLeft(0);
    setIsSendingCode(false);
    setIsVerifyingCode(false);

    signIn?.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div id="clerk-captcha" />
      {step === "email" ? (
        <div className="w-full lg:max-w-120 flex flex-col p-2 lg:p-3 gap-10">
          <div className="w-full flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-text">{hero("title")}</h2>
            <p className="max-w-100 text-base text-primary/70">
              {hero("subtitle")}
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
      ) : (
        <div className="w-full lg:max-w-120 flex flex-col p-2 lg:p-3 gap-10">
          <div className="w-full flex flex-col gap-2">
            <button
              className="w-full flex items-center gap-1.5 group cursor-pointer"
              type="button"
              onClick={handleBack}
            >
              <ArrowLeft className="w-7 h-7 group-hover:text-text-muted" />
              <h3 className="text-3xl font-bold text-text group-hover:text-text">
                {hero("verifStep.title")}
              </h3>
            </button>

            <p className="max-w-100 text-base text-primary/70">
              {hero("verifStep.subtitle")}{" "}
              <span className="text-text font-bold">{email}.</span>
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
      )}
    </form>
  );
}
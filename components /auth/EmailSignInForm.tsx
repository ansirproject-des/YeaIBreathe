"use client";

import { useEffect, useState } from "react";
import { useSignIn } from "@clerk/nextjs";
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
  const [step, setStep] = useState<"email" | "code">("email")
  const [secondsLeft, setSecondsLeft] = useState(30)

  const { signIn } = useSignIn();

  useEffect(() => {
    if(step !== "code") return;

    if(secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, secondsLeft])

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    await handleSendCode();
  }

  async function handleSendCode() {

    setError("");
    setIsSendingCode(true);

    try {
      await signIn.emailCode.sendCode({
        emailAddress: email,
      });

      setStep("code");
      setSecondsLeft(30);

      console.log("Code sent to:", email);
    } catch {
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

    setError("");
    setIsVerifyingCode(true);

    try {
      const { error } = await signIn.emailCode.verifyCode({
        code,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            window.location.href = decorateUrl("/home");
          },
        });
      }
    } catch (err) {
      console.error(err);
      setError("Verification failed.");
    } finally {
      setIsVerifyingCode(false);
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
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {step === "email" ? (
        <>
          <div className="w-full lg:max-w-120 flex flex-col p-2 lg:p-3 gap-10">
            <div className="w-full flex flex-col gap-2">
              <h3 className="text-3xl font-bold text-text">Welcome</h3>
              <p className="max-w-100 text-base text-primary/70">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
              </p>
            </div>

            <div className="w-full flex flex-col gap-5">
              <GoogleAuthButton />

              <EmailStep
                email={email}
                error={error}
                isSendingCode={isSendingCode}
                onEmailChange={setEmail}
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
                <h3 className="text-3xl font-bold text-text group-hover:text-text">Verification</h3></button>
              <p className="max-w-100 text-base text-primary/70">
                We&apos;ve sent a 6-digit code to <span className="text-text font-bold">{email}.</span>
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
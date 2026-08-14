"use client"

import { RotateCcw } from "lucide-react";
import { Button } from "../ui/Button"
import { OtpInput } from "../ui/OtpInput";
import { useTranslations } from "next-intl";

type VerifStepProps = {
  code: string,
  error: string,
  isSendingCode: boolean;
  isVerifyingCode: boolean;
  onCodeChange: (value: string) => void,
  onVerify: () => void,
  onResend: () => void,
  secondsLeft: number,
};

export function VerifStep({
  code,
  error,
  isSendingCode,
  isVerifyingCode,
  onCodeChange,
  onVerify,
  onResend,
  secondsLeft
}: VerifStepProps) {

  const hero = useTranslations("hero");


  return (
    <>
      <div className="w-full flex flex-col gap-2">

        <OtpInput
          value={code}
          label={hero("verifStep.label")}
          onChange={onCodeChange}
          onSubmit={onVerify}
          disabled={isVerifyingCode}
        />

        {error && (
          <p className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>


      <div className="w-full flex gap-2">
        <Button
          type="button"
          className="shrink-0 gap-2 bg-surface-gray hover:bg-surface-gray-hover disabled:text-text-muted"
          variant="custom"
          onClick={onResend}
          disabled={isSendingCode || secondsLeft > 0}
        >
          <RotateCcw className="w-5 h-5" />
          {isSendingCode
            ? hero("verifStep.sending")
            : secondsLeft > 0
              ? (
                <>
                  {hero("verifStep.resendIn.1")} {secondsLeft}
                  {hero("verifStep.resendIn.2")}
                </>
              )
              : hero("verifStep.resendCode")}
        </Button>

        <Button
          type="button"
          onClick={onVerify}
          disabled={isVerifyingCode}
          className="w-full">
          {isVerifyingCode ? hero("verifStep.verifying") : hero("verifStep.verify")}
        </Button>
      </div>
    </>
  )
}
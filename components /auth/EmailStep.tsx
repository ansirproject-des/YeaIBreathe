"use client"

import { useTranslations } from "next-intl";
import { Button } from "../ui/Button"
import { Input } from "../ui/Input";

type EmailStepProps = {
  email: string,
  error: string,
  isSendingCode: boolean;
  onEmailChange: (value: string) => void,
}

export function EmailStep({ email, error, isSendingCode, onEmailChange }: EmailStepProps) {

  const hero = useTranslations("hero");
  return (
    <>
      <Input
        id="email"
        name="email"
        type="email"
        value={email}
        label={hero("emailStep.label")}
        onChange={(e) => onEmailChange(e.target.value)}
        helperText={error}
        helperVariant={error ? "error" : "default"}
        helperIcon={
          error ? <div className="size-2 rounded-full bg-danger" /> : undefined
        }
        placeholder={hero("emailStep.enterEmail")}
        className="w-full"
        autoFocus={false}
        autoComplete="email"
      />


      <Button type="submit" disabled={isSendingCode}>
        {isSendingCode ? hero("emailStep.sending") : hero("emailStep.login")}
      </Button>
    </>
  )
}
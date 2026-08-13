"use client"

import { Button } from "../ui/Button"
import { Input } from "../ui/Input";

type EmailStepProps = {
  email: string,
  error: string,
  isSendingCode: boolean;
  onEmailChange: (value: string) => void,
}

export function EmailStep({ email, error, isSendingCode, onEmailChange }: EmailStepProps) {
  return (
    <>
      <Input
        id="email"
        name="email"
        type="email"
        value={email}
        label="Email"
        onChange={(e) => onEmailChange(e.target.value)}
        helperText={error}
        helperVariant={error ? "error" : "default"}
        helperIcon={
          error ? <div className="size-2 rounded-full bg-danger" /> : undefined
        }
        placeholder="Enter your email"
        className="w-full"
        autoFocus={false}
        autoComplete="email"
      />


      <Button type="submit" disabled={isSendingCode}>
        {isSendingCode ? "Sending code..." : "Log in with email"}
      </Button>
    </>
  )
}
"use client"

import Image from "next/image";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useState, } from "react";
import { properUsername, validateDisplayName } from "@/lib/user/validation";
import { completeWelcomeModal } from "@/app/actions/user";
import { useUsernameAvailability } from "@/hooks/useUsernameAvailability";
import { UsernameSuggestions } from "./UsernameSuggestions";
import { Spinner } from "../ui/Spinner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type WelcomeModalProps = {
  userEmail: string,
  avatarUrl: string | null,
  clerkFirstName: string | null,

  initialDisplayName: string,
  initialUsername: string,
}

export function WelcomeModal({ userEmail, avatarUrl, clerkFirstName, initialDisplayName, initialUsername }: WelcomeModalProps) {

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [username, setUsername] = useState(initialUsername);

  const welcome = useTranslations("welcome");

  const [displayNameError, setDisplayNameError] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const {
    status,
    message,
    suggestions,
  } = useUsernameAvailability(username);


  const handleContinue = async () => {
    setIsSaving(true);

    try {
      const result = await completeWelcomeModal({
        displayName,
        username,
      });

      if (!result.success) {
        if (result.field === "displayName") {
          setDisplayNameError(result.message ?? "");
        }

        return;
      }

      router.replace("/home");
    } finally {
      setIsSaving(false);
    }
  };


  const canContinue =
    displayName.trim().length > 0 &&
    !displayNameError &&
    status === "available";


  return (
    <Modal
      isOpen
      onClose={() => { }}
      closeOnBackdrop={false}
      showCloseButton={false}
    >
      <div className="w-full flex flex-col gap-8">

        <div className="w-full flex flex-col gap-4">
          <div className="w-fit flex gap-2 justify-center items-center">
            <div className="p-0.5 bg-app-gray-hover rounded-full">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Your profile picture"
                  width={32}
                  height={32}
                  className="rounded-full object-cover border border-border"
                />
              ) : (
                <span className="text-2xl font-medium text-muted-foreground">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-sm text-text">{userEmail}</p>
          </div>


          <div className="w-full flex flex-col gap-2">
            <h3 className="text-3xl text-text font-bold">{welcome("title")} {clerkFirstName} </h3>
            <p className="text-text">{welcome("subtitle")}</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          <Input
            variant="app"
            maxLength={30}
            value={displayName}
            onChange={(e) => {
              const value = e.target.value;
              setDisplayName(value);
              setDisplayNameError(
                validateDisplayName(
                  value,
                  (key) => welcome(key)
                ) ?? ""
              );
            }}
            placeholder={welcome("displayNamePlaceholder")}
            label={welcome("displayNameInput")}

            helperText={displayNameError}
            helperVariant={displayNameError ? "error" : "default"}
            helperIndicator
          />


          <div className="w-full flex flex-col gap-3">
            <Input
              variant="app"
              maxLength={20}
              value={username}
              onChange={(e) => {
                const value = properUsername(e.target.value);
                setUsername(value);
              }}
              placeholder={welcome("usernameInputPlaceholder")}

              adornment="@"
              label={welcome("usernameInput")}

              helperText={message}
              helperVariant={
                status === "available"
                  ? "success"
                  : status === "taken" || status === "invalid"
                    ? "error"
                    : "default"
              }
              helperIndicator
              helperIcon={
                status === "checking"
                  ? <Spinner variant="dark" className="w-5" />
                  : undefined
              }

            />
            {status === "taken" && suggestions.length > 0 && (
              <UsernameSuggestions suggestions={suggestions} onSelect={setUsername} />
            )}

            <div className="w-full flex flex-col p-3 gap-0.5 rounded-xl bg-app-gray border border-app-gray-hover">
              <p className="text-sm text-text-muted">{welcome("profileLink")}</p>
              <p className="text-sm text-text">
                breathe.app/@
                {status === "taken" || status === "invalid"
                  ? (<span className="text-text-muted"> —</span>)
                  : (username || (<span className="text-text-muted">username</span>))}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end">
          <Button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-fit"
            disabled={!canContinue || isSaving}
          >
            {isSaving ? welcome("saving") : welcome("continue")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
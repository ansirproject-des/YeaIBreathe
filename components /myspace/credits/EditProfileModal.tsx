"use client";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { ModalTrigger } from "../../ui/ModalTrigger";
import { ProfileAvatar } from "./ProfileAvatar";

import { properUsername, validateDisplayName, } from "@/lib/user/validation";
import { useUsernameAvailability } from "@/hooks/useUsernameAvailability";
import { UsernameSuggestions } from "../../onboarding/UsernameSuggestions";
import { updateProfile } from "@/app/actions/user";
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Textbox } from "../../ui/Textbox";
import { SurfaceCard } from "@/components /ui/SurfaceCard";
import { ProfileLinksModal } from "./ProfileLinksModal";
import { uploadFile } from "@/lib/post/upload";
import { Spinner } from "@/components /ui/Spinner";

export const SaveStatus = {
  Idle: "idle",
  Saving: "saving",
  Saved: "saved",
  Error: "error",
} as const;

type SaveStatus =
  (typeof SaveStatus)[keyof typeof SaveStatus];

type Link = {
  id: string;
  title: string | null;
  url: string;
};

type EditProfileProps = {
  username: string,
  displayName: string,
  email: string,
  avatar?: string,
  description?: string,
  links?: Link[],
  bio?: string,
  trigger?: (open: () => void) => React.ReactNode,
  initialFocus?: "displayName" | "bio",
};

export function EditProfileModal({
  username,
  email,
  avatar,
  displayName,
  description = "",
  links,
  bio = "",
  trigger,
  initialFocus,
}: EditProfileProps) {
  const [avatarPreview, setAvatarPreview] = useState(avatar);
  const [displayNameValue, setDisplayNameValue] = useState(displayName);
  const [usernameValue, setUsernameValue] = useState(username);
  const [descriptionValue, setDescriptionValue] = useState(description);
  const [bioValue, setBioValue] = useState(bio)

  const [savedUsername, setSavedUsername] = useState(username);
  const [savedDisplayName, setSavedDisplayName] = useState(displayName);
  const [savedDescription, setDescriptionContent] = useState(description);
  const [savedBio, setSavedBio] = useState(bio);
  const [savedAvatar, setSavedAvatar] = useState(avatar);

  const [avatarKey, setAvatarKey] = useState(avatar);
  const [displayNameError, setDisplayNameError] = useState("");
  const [saveStatus, setSaveStatus] =
    useState<SaveStatus>(SaveStatus.Idle);

  const router = useRouter();

  const mySpace = useTranslations("mySpace");
  const common = useTranslations("common");

  const {
    status,
    message,
    suggestions,
  } = useUsernameAvailability(usernameValue, savedUsername);

  const usernameError =
    status === "taken" || status === "invalid"
      ? message
      : "";

  const usernameChanged =
    usernameValue !== savedUsername;

  const displayNameChanged =
    displayNameValue !== savedDisplayName;

  const contentChanged =
    descriptionValue !== savedDescription;

  const bioChanged =
    bioValue !== savedBio;

  const avatarChanged = avatarKey !== savedAvatar;

  const canSave =
    displayNameError === "" &&
    usernameError === "" &&
    (
      avatarChanged ||
      displayNameChanged ||
      contentChanged ||
      bioChanged ||
      (usernameChanged && status === "available")
    );

  useEffect(() => {
    if (!canSave) return;

    const timeout = setTimeout(async () => {
      setSaveStatus(SaveStatus.Saving)


      const result = await updateProfile({
        username: usernameValue,
        displayName: displayNameValue,
        description: descriptionValue,
        bio: bioValue,
        ...(avatarChanged && { avatar: avatarKey }),
      });

      if (result.success) {
        setSavedUsername(usernameValue);
        setSavedDisplayName(displayNameValue);
        setDescriptionContent(descriptionValue);
        setSavedBio(bioValue);
        setSavedAvatar(avatarKey);

        setSaveStatus(SaveStatus.Saved);
        router.refresh();
      } else {
        setSaveStatus(SaveStatus.Error);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [avatarPreview, usernameValue, displayNameValue, descriptionValue, avatarKey, avatarChanged, bioValue, canSave, router])

  useEffect(() => {
    if (saveStatus !== SaveStatus.Saved) {
      return;
    }

    const timeout = setTimeout(() => {
      setSaveStatus(SaveStatus.Idle);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [saveStatus]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click()
  };


  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);

    try {
      const uploadedKey = await uploadFile(file);

      setAvatarKey(uploadedKey);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalTrigger
      trigger={
        trigger ??
        ((open) => (
          <Button
            variant="secondaryGray"
            size="sm"
            onClick={open}
            className="w-full"
          >
            {mySpace("edit.button")}
          </Button>
        ))
      }
      footer={(close) => (
        <div className="w-full flex items-center justify-between">
          <div className="text-sm text-text-muted">
            {saveStatus === SaveStatus.Saving && common("statusDb.savePending")}
            {saveStatus === SaveStatus.Saved && (
              <div className="flex gap-0.5 items-center">
                <Check className="w-4 h-4 text-success" />
                <span className="text-success">{common("statusDb.saveSuccess")}</span>
              </div>
            )}
            {saveStatus === SaveStatus.Error && (
              <p className="text-danger">{common("statusDb.saveError")}</p>
            )}
          </div>

          <Button variant="text" size="smText" onClick={close}>
            {common("close")}
          </Button>
        </div>
      )}
    >

      {() => (
        <>
          <div className="w-full mb-6">
            <h3 className="text-xl font-bold text-text">
              {mySpace("edit.modalTitle")}
            </h3>
          </div>

          <div className="w-full flex justify-center my-8">
            <ProfileAvatar
              avatar={avatarPreview}
              displayName={displayNameValue}
              size={160}
              editable
              onEdit={handleClick}
            />
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex flex-col gap-4">
              <Input
                label={mySpace("edit.displayNameInput.label")}
                placeholder={mySpace("edit.displayNameInput.placeholder")}
                autoFocus={initialFocus === "displayName"}
                variant="app"
                value={displayNameValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setDisplayNameValue(value);
                  setDisplayNameError(validateDisplayName(value) ?? "");
                }}
                helperText={displayNameError}
                helperVariant={displayNameError ? "error" : "default"}
                helperIndicator
              />
              <Input
                label={mySpace("edit.usernameInput.label")}
                placeholder={mySpace("edit.usernameInput.placeholder")}
                variant="app"
                value={usernameValue}
                onChange={(e) => {
                  const value = properUsername(e.target.value);
                  setUsernameValue(value);
                }}
                adornment="@"
                helperText={
                  usernameError ||
                  (status === "available" ? message : "")
                }
                helperVariant={
                  usernameError
                    ? "error"
                    : status === "available"
                      ? "success"
                      : "default"
                }
                helperIndicator
                helperIcon={
                  status === "checking" ? (
                    <Spinner
                      variant="dark"
                      className="w-5"
                    />
                  ) : undefined
                }
              />
              {status === "taken" && suggestions.length > 0 && (
                <UsernameSuggestions
                  suggestions={suggestions}
                  onSelect={setUsernameValue}
                />
              )}

              <Textbox
                label={mySpace("edit.descriptionInput.label")}
                value={descriptionValue}
                placeholder={mySpace("edit.descriptionInput.placeholder")}
                onChange={(value) => {
                  setDescriptionValue(value);
                }}
                maxLength={120}
                helperIndicator
              />

              <Textbox
                label={mySpace("edit.bioInput.label")}
                value={bioValue}
                onChange={(value) => {
                  setBioValue(value);
                }}
                placeholder={mySpace("edit.bioInput.placeholder")}
                autoFocus={initialFocus === "bio"}
                helperIndicator
              />

              <SurfaceCard>
                <ProfileLinksModal
                  links={links ?? []} />
              </SurfaceCard>


              <Input
                readOnly
                label={mySpace("edit.emailInput.label")}
                variant="app"
                value={email}
                disabled
              />
            </div>

            <p className="text-sm text-text-muted">
              {mySpace("edit.emailHint")}
            </p>
          </div>
        </>
      )}
    </ModalTrigger>
  );
}
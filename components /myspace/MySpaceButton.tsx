"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, MoveRight } from "lucide-react";

import { Dropdown } from "../ui/Dropdown";
import { AvatarButton } from "../ui/AvatarButton";
import { ProfileAvatar } from "./credits/ProfileAvatar";
import { ProfileInfo } from "./credits/ProfileInfo";

import { useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { ConfirmationModal } from "../ui/ConfirmationModal";
import { SessionsHistoryModalContent } from "../settings/SessionsHistoryModalContent";
import { getCurrentDbUser } from "@/lib/user/user";
import { useTranslations } from "next-intl";

type MySpaceButtonProps = {
  user: Awaited<ReturnType<typeof getCurrentDbUser>>;
}

export function MySpaceButton({ user }: MySpaceButtonProps) {


  const router = useRouter();
  const mySpace = useTranslations("mySpace.menu");
  const common = useTranslations("common");

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);

  return (
    <>
      <Dropdown
        items={[
          {
            label: mySpace("mySpace"),
            variant: "default",
            leftIcon: (
              <ProfileAvatar
                avatar={user.avatar ?? undefined}
                displayName={user.displayName}
                size={20}
              />
            ),
            onClick: () => router.push("/my-space"),
          },
          {
            label: mySpace("lastSessions.label"),
            onClick: () => setShowSessionsModal(true),
            variant: "default",
            rightIcon: <ChevronRight className="w-5 h-5 text-text-muted" />,
          },
          {
            label: mySpace("explore"),
            variant: "default",
            onClick: () => router.push("/my-space"),
          },
          {
            label: mySpace("settings.label"),
            onClick: () => router.push("/my-space/settings"),
            variant: "default",
          },
          {
            label: mySpace("settings.support.help.label"),
            variant: "default",
          },
          {
            label: mySpace("settings.logout.label"),
            variant: "danger",
            onClick: () => setShowLogoutModal(true),
            hasBorder: true,
          },
        ]}
      >

        <div className="flex items-end gap-2.5 cursor-pointer">
          <AvatarButton className="h-12 w-12">
            <ProfileAvatar
              avatar={user.avatar ?? undefined}
              displayName={user.displayName}
              size={40}
            />
          </AvatarButton>

          <ProfileInfo
            name={user.displayName}
            username={`@${user.username}`}
          />
        </div>
      </Dropdown>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        footer={
          <div className="w-full flex justify-end gap-2">

            <SignOutButton>
              <Button className="w-full sm:w-fit" variant="dangerSecondary">
                {mySpace("settings.logout.logOut")}
              </Button>
            </SignOutButton>

            <Button className="w-full sm:w-fit" variant="primary" onClick={() => setShowLogoutModal(false)}>
              <span className="sm:hidden">{mySpace("settings.logout.stayMobile")}</span>
              <span className="hidden sm:inline">{mySpace("settings.logout.stay")}</span>
            </Button>
          </div>
        }
      >
        <ConfirmationModal
          title={mySpace("settings.logout.modalTitle")}
          content={mySpace("settings.logout.message")}
        />
      </Modal>

      <Modal
        isOpen={showSessionsModal}
        onClose={() => setShowSessionsModal(false)}
        footer={
          <div className="w-full flex justify-between items-center">
          <Button
          variant="text"
          size="smText"
          className="gap-2 group"
          onClick={() => router.push("/my-space/last-sessions")}
        >
          {mySpace("lastSessions.card.viewAll")}
          <MoveRight className="w-5 h-5 text-text-muted transition-colors group-hover:text-text" />
        </Button>

          <Button
            variant="text"
            size="smText"
            onClick={() => setShowSessionsModal(false)}
            type="button"
          >
            {common("close")}
          </Button>
          </div>
        }
      >

        <SessionsHistoryModalContent />
      </Modal>
    </>
  );
}
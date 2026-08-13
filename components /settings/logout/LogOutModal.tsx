"use client";

import { useTranslations } from "next-intl";
import { Button } from "../../ui/Button";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { ModalTrigger } from "../../ui/ModalTrigger";
import { SignOutButton } from "@clerk/nextjs";

type LogOutModalProps = {
  trigger: (open: () => void) => React.ReactNode,
}

export function LogOutModal({ trigger }: LogOutModalProps) {
  const mySpace = useTranslations("mySpace.menu.settings.logout");

  return (
    <ModalTrigger
      trigger={trigger}
      footer={(close) => (
        <div className="w-full flex justify-end gap-2">


          <SignOutButton>
            <Button className="shrink-0 whitespace-nowrap" variant="dangerSecondary">
              {mySpace("logOut")}
            </Button>
          </SignOutButton>

          <Button className="w-full sm:w-fit" variant="primary" onClick={close}>
            {mySpace("stay")}
          </Button>


        </div>
      )}
    >
      {() => (
        <ConfirmationModal
          title={mySpace("modalTitle")}
          content={mySpace("message")}
        />
      )}
    </ModalTrigger>
  );
}
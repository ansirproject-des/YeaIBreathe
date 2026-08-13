"use client"

import { ModalTrigger } from "../ui/ModalTrigger"
import { PreferredModeModalContent } from "./PreferredModeModalContent"

type PreferredModeModalProps = {
  trigger: (open: () => void) => React.ReactNode,
}

export function PreferredModeModal({trigger}: PreferredModeModalProps) {
  return (
    <ModalTrigger
      trigger={trigger}
    >
      {(close) => (
        <PreferredModeModalContent close={close}/>
      )}

    </ModalTrigger>

  )
}
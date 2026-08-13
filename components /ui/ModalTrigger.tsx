"use client";

import { useState } from "react";
import { Modal } from "@/components /ui/Modal";


type ModalTriggerProps = {
  trigger: (open: () => void) => React.ReactNode,
  children: (close: () => void) => React.ReactNode,
  footer?: (close: () => void) => React.ReactNode,
  zIndex?: string,
};


export function ModalTrigger({ trigger, children, footer, zIndex }: ModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false);

  return (
    <>

      {trigger(open)}

      <Modal 
      isOpen={isOpen} 
      onClose={close}
      footer={footer?.(close)}
      zIndex={zIndex}
      >
        {children(close)}
      </Modal>
    </>
  );
}


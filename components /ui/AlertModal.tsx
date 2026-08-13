"use client";

import {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

import { Button } from "@/components /ui/Button";
import { Modal } from "@/components /ui/Modal";


export type AlertModalRef = {
  open: (
    title: string,
    message: string
  ) => void;
};


export const AlertModal = forwardRef<
  AlertModalRef
>(function AlertModal(_, ref) {

  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");


  function open(
    newTitle: string,
    newMessage: string
  ) {
    setTitle(newTitle);
    setMessage(newMessage);
    setIsOpen(true);
  }


  function close() {
    setIsOpen(false);
  }


  useImperativeHandle(ref, () => ({
    open,
  }));


  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      footer={
        <Button
          className="w-full"
          onClick={close}
        >
          Got it
        </Button>
      }
    >
      <div className="w-full mb-4">
        <h3 className="text-xl text-danger font-bold">
          {title}
        </h3>
      </div>

      <p className="text-sm text-text-descr">
        {message}
      </p>
    </Modal>
  );
});
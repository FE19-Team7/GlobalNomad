"use client";

import Modal from "./Modal";
import CancelIcon from "@/src/assets/warning.svg";
import Button from "@/src/components/button/button";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export default function CancelModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: CancelModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contents={
        <div className="flex flex-col items-center text-center">
          <CancelIcon />

          <p className="mt-2 text-lg font-bold">{message}</p>
        </div>
      }
      footer={
        <div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" fullWidth onClick={onClose}>
              아니오
            </Button>

            <Button variant="primary" size="sm" fullWidth onClick={onConfirm}>
              취소하기
            </Button>
          </div>
        </div>
      }
    />
  );
}

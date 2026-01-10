"use client";

import Modal from '@/src/components/Modal/Modal';
import WarningIcon from '@/src/assets/warning.svg';
import Button from '@/src/components/Button/Button';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export default function DeleteModal({
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
        <div className="pt-4 flex flex-col items-center text-center">
          <WarningIcon />
          <p className="mt-[2px] text-lg font-bold">{message}</p>
        </div>
      }
      footer={
        <div className="pb-1">
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" fullWidth onClick={onClose}>
              아니오
            </Button>

            <Button variant="primary" size="sm" fullWidth onClick={onConfirm}>
              예
            </Button>
          </div>
        </div>
      }
    />
  );
}

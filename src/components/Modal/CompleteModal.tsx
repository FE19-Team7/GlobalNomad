"use client";

import Modal from "./Modal";

interface CompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function CompleteModal({
  isOpen,
  onClose,
  message,
}: CompleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contents={
        <div
          className="
            flex flex-col items-center text-center
            px-10 pt-10
          "
        >
          <p className="text-lg font-bold">{message}</p>
        </div>
      }
      footer={
        <div className="px-10 pb-7.5">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-blue-500 py-3 text-sm font-medium text-white"
          >
            확인
          </button>
        </div>
      }
    />
  );
}

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
            px-10 pt-10 gap-5 pb-7.5
          "
        >
          <p className="text-lg font-bold">{message}</p>

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

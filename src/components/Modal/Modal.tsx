"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  header?: ReactNode;
  contents: ReactNode;
  footer?: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  header,
  contents,
  footer,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* dim */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* modal */}
      <div className="relative z-10 w-100 rounded-2xl bg-white shadow-lg overflow-hidden">
        {/* Header */}
        {header && <div className="flex justify-end px-6 pt-5">{header}</div>}

        {/* Contents */}
        <div className="px-6 py-2">{contents}</div>

        {/* Footer */}
        {footer && <div className="px-6 py-5 ">{footer}</div>}
      </div>
    </div>
  );
}

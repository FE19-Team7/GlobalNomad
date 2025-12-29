"use client";

import { useState } from "react";
import CompleteModal from "@/src/components/Modal/CompleteModal";

export default function DonghyeonPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-10">
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white"
      >
        CompleteModal 열기
      </button>

      <CompleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        message="완료되었습니다"
      />
    </div>
  );
}

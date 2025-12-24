"use client";

import { useState, ReactNode } from "react";
import Modal from "@/src/components/Modal/Modal";
import DeleteIcon from "@/src/assets/icon_delete.svg";

/** 테스트 페이지 전용 버튼 */
function Button({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg bg-blue-500 py-2 text-white text-sm font-medium"
    >
      {children}
    </button>
  );
}

export default function DonghyeonPage() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-10">
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        header={
          <button
            aria-label="닫기"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center"
          >
            <DeleteIcon />
          </button>
        }
        contents={
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-lg font-bold">Modal 테스트</h2>
            <p className="text-sm text-gray-500">
              header / contents / footer 슬롯 구조를 검증하기 위한 테스트
              페이지입니다.
            </p>
          </div>
        }
        footer={<Button onClick={() => setOpen(false)}>닫기</Button>}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import Modal from "./Modal";
import Button from "@/src/components/Button/Button";
import EmptyStar from "@/src/assets/icon_empty_star.svg";
import FilledStar from "@/src/assets/icon_filled_star.svg";
import DeleteIcon from "@/src/assets/icon_delete.svg";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, content: string) => void;
  title: string;
  subtitle: string;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const resetState = () => {
    setRating(0);
    setContent("");
  };

  const handleClose = () => {
    onClose();

    setTimeout(() => {
      resetState();
    }, 300);
  };

  const handleSubmit = () => {
    onSubmit(rating, content);
    resetState();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header={
        <button
          aria-label="닫기"
          onClick={handleClose}
          className="flex items-center justify-center"
        >
          <DeleteIcon />
        </button>
      }
      contents={
        <div>
          <h2 className="text-base font-bold text-center">{title}</h2>

          <p className="mt-1 text-sm text-gray-500 text-center">{subtitle}</p>

          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => {
              const isActive = index < rating;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setRating(index + 1)}
                  className="p-1"
                  aria-label={`${index + 1}점`}
                >
                  {isActive ? <FilledStar /> : <EmptyStar />}
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-lg font-bold">소중한 경험을 들려주세요</p>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={100}
            placeholder="체험에서 느낀 경험을 자유롭게 남겨주세요"
            className="mt-2 flex w-full h-[179px] items-start gap-2 p-5 rounded-xl border border-[#E0E0E5] bg-whiteshadow-[0_4px_24px_rgba(156,180,202,0.2)]"
            rows={4}
          />

          <p className="mt-1 text-right text-xs text-gray-400">
            {content.length}/100
          </p>
        </div>
      }
      footer={
        <div className="px-[30px] pb-[24px]">
          <Button
            variant="primary"
            size="md"
            fullWidth
            disabled={rating === 0 || content.length === 0}
            onClick={handleSubmit}
          >
            작성하기
          </Button>
        </div>
      }
    />
  );
}

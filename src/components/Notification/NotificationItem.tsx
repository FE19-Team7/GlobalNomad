"use client";

import { NotificationUIItem } from "./types";

interface Props {
  item: NotificationUIItem;
  onDelete: (id: number) => void;
}

export default function NotificationItem({ item, onDelete }: Props) {
  const isApprove = item.content.includes("승인");
  const isReject = item.content.includes("거절");

  const highlightWord = isApprove ? "승인" : isReject ? "거절" : null;

  let before = item.content;
  let after = "";

  if (highlightWord) {
    [before, after] = item.content.split(highlightWord);
  }

  return (
    <div className={`px-4 py-3 ${isApprove ? "bg-blue-50" : "bg-white"}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">
          {isApprove ? "예약 승인" : "예약 거절"}
        </p>
        <button
          className="text-xs text-gray-400"
          onClick={() => onDelete(item.id)}
        >
          삭제
        </button>
      </div>

      <p className="mt-1 text-sm text-gray-900">{item.activityTitle}</p>
      <p className="text-xs text-gray-500">{item.scheduleText}</p>

      <p className="mt-1 text-sm text-gray-700">
        {before}
        {highlightWord && (
          <span
            className={`font-medium ${
              isApprove ? "text-blue-600" : "text-red-600"
            }`}
          >
            {highlightWord}
          </span>
        )}
        {after}
      </p>
    </div>
  );
}

function formatRelativeTime(dateString: string) {
  const diff = (Date.now() - new Date(dateString).getTime()) / 1000;

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

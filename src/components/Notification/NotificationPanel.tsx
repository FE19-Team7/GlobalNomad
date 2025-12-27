"use client";

import DeleteIcon from "@/assets/icon_delete.svg";
import NotificationItem from "./NotificationItem";
import { NotificationUIItem } from "./types";

interface Props {
  notifications: NotificationUIItem[];
  totalCount: number;
  onClose: () => void;
}

export default function NotificationPanel({
  notifications,
  totalCount,
  onClose,
}: Props) {
  return (
    <div
      className="
        absolute right-0 top-[40px] z-50
        w-[231px]
        rounded-xl bg-white
        shadow-[0_2px_8px_rgba(156,180,202,0.2)]
      "
    >
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm font-bold">알림 {totalCount}개</p>
        <button onClick={onClose} aria-label="닫기">
          <DeleteIcon />
        </button>
      </div>

      <div className="flex flex-col">
        {notifications.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            새로운 알림이 없습니다.
          </p>
        ) : (
          notifications.map((item) => (
            <NotificationItem key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

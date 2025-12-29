"use client";

import { useState } from "react";
import BellIcon from "@/assets/icon_bell.svg";
import DefaultProfile from "@/assets/default profile.svg";
import Link from "next/link";
import NotificationPanel from "@/src/components/Notification/NotificationPanel";
import { mockNotifications } from "@/src/components/Notification/mock";

type LoggedInMenuProps = {
  nickname: string;
};

export default function LoggedInMenu({ nickname }: LoggedInMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute flex items-center gap-2.5">
      <button
        type="button"
        aria-label="알림"
        onClick={() => setOpen((prev) => !prev)}
        className="hover:opacity-70 transition"
      >
        <BellIcon />
      </button>
      {open && (
        <NotificationPanel
          notifications={mockNotifications}
          totalCount={mockNotifications.length}
          onClose={() => setOpen(false)}
        />
      )}
      <Link
        href="/mypage"
        aria-label="마이페이지"
        className="flex items-center gap-2 hover:opacity-70 transition"
      >
        <DefaultProfile/>
        <span className="text-sm text-gray-950">{nickname}</span>
      </Link>
    </div>
  );
}

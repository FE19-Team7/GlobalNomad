"use client";

import { useState } from "react";
import BellIcon from "@/assets/icon_bell.svg";
import DefaultProfile from "@/assets/default profile.svg";
import Divider from "@/src/assets/divider.svg";
import Link from "next/link";
import NotificationPanel from "@/src/components/Notification/NotificationPanel";
import { mockNotifications } from "@/src/components/Notification/mock";
import UserMenuDropDown from "../Dropdown/UserMenuDropDown";

type LoggedInMenuProps = {
  nickname: string;
  onLogout: () => void;
};

export default function LoggedInMenu({
  nickname,
  onLogout,
}: LoggedInMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center">
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

      <Divider className="mx-5" />

      <Link
        href="/mypage"
        aria-label="마이페이지"
        className="flex items-centerhover:opacity-70 transition"
      >
        <DefaultProfile />
      </Link>
      <UserMenuDropDown
        userName={nickname}
        onLogout={onLogout}
        className="absolute  min-w-[120px]"
      />
    </div>
  );
}

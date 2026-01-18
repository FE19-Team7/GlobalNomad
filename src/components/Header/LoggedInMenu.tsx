"use client";

import { useState } from "react";
import BellIcon from "@/assets/icon_bell.svg";
import DefaultProfile from "@/assets/default profile.svg";
import Divider from "@/src/assets/divider.svg";
import Link from "next/link";
import Image from "next/image";
import NotificationPanel from "@/src/components/Notification/NotificationPanel";
import UserMenuDropDown from "../Dropdown/UserMenuDropDown";
import { useNotifications } from "@/src/features/notification/hooks/useNotifications";
import { authFetch } from "@/src/lib/api/authFetch";

type LoggedInMenuProps = {
  nickname: string;
  profileImageUrl?: string | null;
  onLogout: () => void;
};

export default function LoggedInMenu({
  nickname,
  profileImageUrl,
  onLogout,
}: LoggedInMenuProps) {
  const [open, setOpen] = useState(false);

  const {
    notifications,
    totalCount,
    loading,
    setNotifications,
    setTotalCount,
  } = useNotifications(open);

  const handleDelete = async (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setTotalCount((prev) => Math.max(prev - 1, 0));

    try {
      await authFetch(`/api/my-notifications/${id}`, {
        method: "DELETE",
      });
    } catch {}
  };

  return (
    <div className="flex items-center">
      <div className="relative">
        <button
          type="button"
          aria-label="알림"
          onClick={() => setOpen((prev) => !prev)}
          className="hover:opacity-70 transition"
        >
          <BellIcon />
        </button>

        {open && !loading && (
          <NotificationPanel
            notifications={notifications}
            totalCount={totalCount}
            onClose={() => setOpen(false)}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Divider className="mx-5" />

      <Link
        href="/mypage/my-profile"
        aria-label="마이페이지"
        className="flex items-center hover:opacity-70 transition"
      >
        {profileImageUrl ? (
          <div className="relative w-10 h-10 overflow-hidden rounded-full">
            <Image
              src={profileImageUrl}
              alt="프로필 이미지"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
        ) : (
          <DefaultProfile />
        )}
      </Link>

      <UserMenuDropDown userName={nickname} onLogout={onLogout} />
    </div>
  );
}

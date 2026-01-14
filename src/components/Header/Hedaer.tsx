"use client";

import { useEffect, useState } from "react";
import HeaderLayout from "./HeaderLayout";
import Logo from "@/assets/Logo.svg";
import LoggedInMenu from "./LoggedInMenu";
import LoggedOutMenu from "./LoggedOutMenu";
import Link from "next/link";
import { authFetch } from "@/src/lib/api/authFetch";

type User = {
  nickname: string;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/api/users/me")
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.reload();
  };

  if (loading) return null;

  return (
    <HeaderLayout>
      <div className="flex w-full items-center justify-between">
        {/* 왼쪽 */}
        <Link
          href="/"
          className="flex items-center justify-start cursor-pointer"
        >
          <Logo />
        </Link>

        {/* 오른쪽 */}
        <div className="flex items-center">
          {user ? (
            <LoggedInMenu nickname={user.nickname} onLogout={handleLogout} />
          ) : (
            <LoggedOutMenu />
          )}
        </div>
      </div>
    </HeaderLayout>
  );
}

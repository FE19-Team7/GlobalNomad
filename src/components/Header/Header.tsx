"use client";

import { useRouter } from "next/navigation";
import HeaderLayout from "./HeaderLayout";
import Logo from "@/assets/Logo.svg";
import LoggedInMenu from "./LoggedInMenu";
import LoggedOutMenu from "./LoggedOutMenu";
import Link from "next/link";
import type { User } from "@/src/lib/server/getUser";

type HeaderProps = {
  initialUser: User | null;
};

export default function Header({ initialUser }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <HeaderLayout>
      <div className="flex w-full items-center justify-between">
        {/* 왼쪽 */}
        <Link href="/" onClick={() => window.location.reload()}>
          <Logo />
        </Link>

        {/* 오른쪽 */}
        <div className="flex items-center">
          {initialUser ? (
            <LoggedInMenu
              nickname={initialUser.nickname}
              profileImageUrl={initialUser.profileImageUrl}
              onLogout={handleLogout}
            />
          ) : (
            <LoggedOutMenu />
          )}
        </div>
      </div>
    </HeaderLayout>
  );
}

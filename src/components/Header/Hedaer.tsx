"use client";

import { useState } from "react";
import HeaderLayout from "./HeaderLayout";
import Logo from "@/assets/Logo.svg";
import LoggedInMenu from "./LoggedInMenu";
import LoggedOutMenu from "./LoggedOutMenu";
import Link from "next/link";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const nickname = "조동현"; // 임시 데이터 -> 추후 로그인 회원가입 연동 시 수정

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

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
        <div className="flex justify-end items-center">
          {isLoggedIn ? (
            <LoggedInMenu nickname={nickname} onLogout={handleLogout} />
          ) : (
            <LoggedOutMenu />
          )}
        </div>
      </div>
    </HeaderLayout>
  );
}

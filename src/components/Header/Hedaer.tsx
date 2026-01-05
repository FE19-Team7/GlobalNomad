"use client";

import { useState } from "react";
import HeaderLayout from "@/src/components/Header/HeaderLayout";
import Logo from "@/assets/Logo.svg";
import EarthLogo from "@/assets/earth.svg";
import LoggedInMenu from "@/src/components/Header/LoggedInMenu";
import LoggedOutMenu from "@/src/components/Header/LoggedOutMenu";
import Link from "next/link";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const nickname = "조동현"; // 임시 데이터 -> 추후 로그인 회원가입 연동 시 수정

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <HeaderLayout>
      <div className="flex w-full items-center justify-between gap-2 h-full">
        {/* 왼쪽 */}
        <Link
          href="/"
          className="flex items-center justify-start cursor-pointer flex-shrink-0"
        >
          {/* 모바일버전 로고, 태블릿 이상 사이즈 로고 */}
          <div className="md:hidden w-10 h-10 overflow-hidden flex items-center justify-center">
            <div className="scale-[0.2] origin-center">
              <EarthLogo />
            </div>
          </div>
          <Logo className="h-auto object-contain hidden md:block" />
        </Link>

        {/* 오른쪽 */}
        <div className="flex justify-end items-center flex-shrink-0">
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
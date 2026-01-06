"use client";

import { useState, useEffect } from "react";
import SideMenu from "@/src/components/SideMenu/SideMenu";

let globalCancelHandler: (() => void) | null = null;

export const setGlobalCancelHandler = (handler: () => void) => {
  globalCancelHandler = handler;
};

export const getGlobalCancelHandler = (): (() => void) | null =>
  globalCancelHandler;

interface MyPageLayoutProps {
  children: React.ReactNode;
}

export default function MyPageLayout({ children }: MyPageLayoutProps) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [showMobileContent, setShowMobileContent] = useState(false);

  const handleProfileEdit = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleMenuClick = () => {
    setShowMobileContent(true);
  };

  const handleCancel = () => {
    setShowMobileContent(false);
  };

  useEffect(() => {
    setGlobalCancelHandler(handleCancel);
  }, []);

  return (
    <main className="flex-1">
      {/* 헤더/푸터 사이 영역 */}
      <div className="h-[calc(100vh-160px)]">
        <div className="w-full max-w-[980px] mx-auto px-6 h-full">
          <div className="flex gap-14 h-full">
            {/* 사이드 메뉴 */}
            <aside
              className={`w-[260px] flex-shrink-0 ${
                showMobileContent ? "hidden md:block" : "block"
              }`}
            >
              <SideMenu
                profileImageUrl={profileImageUrl}
                onProfileEdit={handleProfileEdit}
                onMenuClick={handleMenuClick}
                showMobileContent={showMobileContent}
              />
            </aside>

            {/* 메인 컨텐츠만 스크롤 */}
            <section
              className="
                flex-1 min-w-0
                overflow-y-auto
                [scrollbar-width:none]
                [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {children}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

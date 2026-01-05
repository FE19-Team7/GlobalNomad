'use client';

import { useState, useEffect } from 'react';
import SideMenu from '@/src/components/SideMenu/SideMenu';
import Header from '@/src/components/Header/Hedaer';
import { Footer } from '@/src/components/Footer/Footer';

// Global cancel handler
let globalCancelHandler: (() => void) | null = null;

export const setGlobalCancelHandler = (handler: () => void) => {
  globalCancelHandler = handler;
};

export const getGlobalCancelHandler = () => globalCancelHandler;

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [showMobileContent, setShowMobileContent] = useState(false);

  // 프로필 이미지 편집 버튼 클릭 핸들러
  const handleProfileEdit = () => {
    // 파일 선택 다이얼로그 열기
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // 모바일에서 메뉴 클릭 시 컨텐츠 표시
  const handleMenuClick = () => {
    setShowMobileContent(true);
  };

  // 취소하기 버튼 클릭 시 메뉴로 복귀
  const handleCancel = () => {
    setShowMobileContent(false);
  };

  // Set global cancel handler
  useEffect(() => {
    setGlobalCancelHandler(handleCancel);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="w-full max-w-[980px] md:max-w-none lg:max-w-[980px] mx-auto px-6 md:px-[30px] lg:px-6">
          <div className="flex gap-8 md:gap-[0px] lg:gap-14">
            {/* 사이드 메뉴 - 모바일: 조건부, 태블릿+: 항상 표시 */}
            <div className={`w-full max-w-[375px] mx-auto md:max-w-none md:w-[220px] lg:w-[260px] md:flex-shrink-0 md:mx-0 ${showMobileContent ? 'hidden md:block' : 'block'}`}>
              <SideMenu
                profileImageUrl={profileImageUrl}
                onProfileEdit={handleProfileEdit}
                onMenuClick={handleMenuClick}
                showMobileContent={showMobileContent}
              />
            </div>

            {/* 메인 컨텐츠 - 모바일: 조건부, 태블릿+: 항상 표시 */}
            <div className={`flex-1 min-w-0 ${showMobileContent ? 'block' : 'hidden md:block'}`}>
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
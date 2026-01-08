'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import SideMenu from '@/src/components/SideMenu/SideMenu';
import { getMyProfile, uploadProfileImage, updateMyProfile, UserProfile } from '@/src/apis/user';

// 컨텍스트 정의
interface UserContextType {
  userData: UserProfile | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser는 반드시 MyPageLayout 안에서 사용해야 합니다.');
  }
  return context;
};

// 전역 핸들러
let globalCancelHandler: (() => void) | null = null;

export const setGlobalCancelHandler = (handler: () => void) => {
  globalCancelHandler = handler;
};

export const getGlobalCancelHandler = (): (() => void) | null =>
  globalCancelHandler;

// 내부 콘텐츠 컴포넌트
function MyPageLayoutContent({ children }: { children: React.ReactNode }) {
  const { userData, refreshUser } = useUser();
  const [showMobileContent, setShowMobileContent] = useState(false);

  const handleCancel = () => {
    setShowMobileContent(false);
  };

  useEffect(() => {
    setGlobalCancelHandler(handleCancel);
  }, []);

  const handleProfileEdit = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const uploadRes = await uploadProfileImage(file);
        await updateMyProfile({ profileImageUrl: uploadRes.profileImageUrl });
        await refreshUser();
        alert('프로필 이미지가 변경되었습니다.');
      } catch (error) {
        console.error(error);
        alert('이미지 변경에 실패했습니다.');
      }
    };
    input.click();
  };

  const handleMenuClick = () => {
    setShowMobileContent(true);
  };

  return (
    <main className="flex-1">
      {/* 헤더/푸터 사이 영역 */}
      <div className="h-[calc(100vh-160px)] py-6">
        <div className="w-full max-w-[980px] mx-auto px-6 h-full">
          <div className="flex gap-14 h-full">
            {/* 사이드 메뉴 */}
            <aside
              className={`w-[260px] flex-shrink-0 ${
                showMobileContent ? "hidden md:block" : "block"
              }`}
            >
              <SideMenu
                profileImageUrl={userData?.profileImageUrl}
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
                pb-6
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

// 메인 레이아웃
interface MyPageLayoutProps {
  children: React.ReactNode;
}

export default function MyPageLayout({ children }: MyPageLayoutProps) {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await getMyProfile();
      if (data?.profileImageUrl) {
        data.profileImageUrl = `${data.profileImageUrl}?v=${new Date().getTime()}`;
      }
      setUserData(data);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ userData, refreshUser: fetchUser }}>
      <MyPageLayoutContent>{children}</MyPageLayoutContent>
    </UserContext.Provider>
  );
}
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import SideMenu from '@/src/components/SideMenu/SideMenu';
import { getMyProfile, uploadProfileImage, updateMyProfile, UserProfile } from '@/src/apis/user';

// [1] 컨텍스트 및 훅 정의
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

// [2] 전역 핸들러 정의 및 내보내기
let globalCancelHandler: (() => void) | null = null;
export const setGlobalCancelHandler = (handler: () => void) => { 
  globalCancelHandler = handler; 
};
export const getGlobalCancelHandler = () => globalCancelHandler;

// [3] 내부 실제 콘텐츠 (Provider 안에서 실행됨)
function MyPageLayoutContent({ children }: { children: React.ReactNode }) {
  const { userData, refreshUser } = useUser();
  const [showMobileContent, setShowMobileContent] = useState(false);

  useEffect(() => {
    setGlobalCancelHandler(() => setShowMobileContent(false));
  }, []);

  const handleProfileEdit = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const uploadRes = await uploadProfileImage(file);
          await updateMyProfile({ profileImageUrl: uploadRes.profileImageUrl });
          await refreshUser();
          alert('프로필 이미지가 변경되었습니다.');
        } catch (error) {
          console.error(error);
          alert('이미지 변경에 실패했습니다.');
        }
      }
    };
    input.click();
  };

  return (
    <main className="flex-1 py-6">
      <div className="w-full max-w-[980px] md:max-w-none lg:max-w-[980px] mx-auto px-6 md:px-[30px] lg:px-6">
        <div className="flex gap-8 md:gap-[30px] lg:gap-14">
          <div className={`w-full max-w-[375px] mx-auto md:max-w-none md:w-[220px] lg:w-[260px] md:flex-shrink-0 md:mx-0 ${showMobileContent ? 'hidden md:block' : 'block'}`}>
            <SideMenu
              profileImageUrl={userData?.profileImageUrl}
              onProfileEdit={handleProfileEdit}
              onMenuClick={() => setShowMobileContent(true)}
              showMobileContent={showMobileContent}
            />
          </div>
          <div className={`flex-1 min-w-0 ${showMobileContent ? 'block' : 'hidden md:block'}`}>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

// [4] 메인 레이아웃 Export
export default function MyPageLayout({ children }: { children: React.ReactNode }) {
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
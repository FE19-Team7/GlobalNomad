'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Input from '@/src/components/Input/Input';
import Button from '@/src/components/Button/Button';
import { useMyPageForm } from '@/src/features/public/hooks/useMyPageForm';
import { getGlobalCancelHandler } from '@/src/app/(auth)/mypage/MypageLayout';
import { updateMyProfile } from '@/src/apis/user';
import { useUser } from '@/src/app/(auth)/mypage/MypageLayout';

export default function MyProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const userContext = useUser();
  const userData = userContext?.userData;
  const refreshUser = userContext?.refreshUser;
  
  const handleMobileCancel = () => {
    const cancelHandler = getGlobalCancelHandler();
    if (cancelHandler) cancelHandler();
  };

  // 사용자 정보 불러오기
  useEffect(() => {
    if (userData) {
      setIsLoading(false);
    }
  }, [userData]);

  // 폼 상태 관리
  const {
    nickname,
    nicknameError,
    handleNicknameChange,
    handleNicknameBlur,
    email,
    emailError,
    handleEmailChange,
    handleEmailBlur,
    newPassword,
    newPasswordError,
    handleNewPasswordChange,
    handleNewPasswordBlur,
    confirmPassword,
    confirmPasswordError,
    handleConfirmPasswordChange,
    handleConfirmPasswordBlur,
    isModified,
    isFormValid,
    handleSubmit,
  } = useMyPageForm({
    initialNickname: userData?.nickname || '',
    initialEmail: userData?.email || '',
  });

  // 저장하기 버튼 클릭
const handleSaveClick = async () => {
  if (!isModified || !isFormValid || isSaving || !userData || !refreshUser) {
    return;
  }

  const success = handleSubmit();
  if (!success) return;

  setIsSaving(true);
  
  try {
    const updateData: {
      nickname?: string;
      newPassword?: string; 
    } = {};


    if (nickname !== userData?.nickname) {
      updateData.nickname = nickname;
    }

    if (newPassword) {
      updateData.newPassword = newPassword;
    }

    console.log('🔵 보내는 데이터:', updateData);

    await updateMyProfile(updateData);
    alert('정보가 수정되었습니다.');

    await refreshUser();
    
  } catch (error) {
    console.error('정보 수정 실패:', error);
    alert('정보 수정에 실패했습니다.');
  } finally {
    setIsSaving(false);
  }
};

  // 로딩 중
  if (isLoading || !userData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  // 데이터 로딩 실패
  if (!userData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">사용자 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="max-w-[640px] md:scale-[0.857] md:origin-top-left md:-mr-[90px] lg:scale-100 lg:mr-0">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-lg font-bold text-gray-900 mb-2">
            내 정보
          </h1>
          <p className="text-sm text-gray-600">
            내정보와 비밀번호를 수정하실 수 있습니다.
          </p>
        </div>

        {/* 폼 영역 */}
        <div className="space-y-6">
          {/* 닉네임 영역 */}
          <div>
            <Input
              label="닉네임"
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              onBlur={handleNicknameBlur}
              error={nicknameError}
              placeholder="닉네임을 입력해주세요"
              fullWidth
            />
          </div>

          {/* 이메일 영역 */}
          <div>
            <Input
              label="이메일"
              type="email"
              value={email}
              readOnly
              className="bg-gray-50 cursor-default"
              fullWidth
            />
          </div>

          {/* 새 비밀번호 영역 */}
          <div>
            <Input
              label="비밀번호"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              onBlur={handleNewPasswordBlur}
              error={newPasswordError}
              placeholder="8자 이상 입력해주세요"
              fullWidth
            />
          </div>
          
          {/* 새 비밀번호 확인 영역 */}
          <div>
            <Input
              label="비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              error={confirmPasswordError}
              placeholder="비밀번호를 한번 더 입력해주세요"
              fullWidth
            />
          </div>


          {/* 버튼 영역 */}
          <div className="flex justify-center gap-3 pt-6">
            {/* 취소하기 버튼 모바일에서만 */}
            <Button
              type="button"
              onClick={handleMobileCancel}
              variant="secondary"
              size="sm"
              className="md:hidden"
            >
              취소하기
            </Button>
            
            {/* 저장하기 버튼 */}
            <Button
              type="button"
              onClick={handleSaveClick}
              disabled={!isModified || !isFormValid || isSaving}
              variant="primary"
              size="sm"
            >
              {isSaving ? '저장 중...' : '저장하기'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

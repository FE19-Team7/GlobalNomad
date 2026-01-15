'use client';

import { useState } from 'react';
import Input from '@/src/components/Input/Input';
import Button from '@/src/components/Button/Button';
import { useMyPageForm } from '@/src/features/public/hooks/useMyPageForm';
import { updateMyProfile } from '@/src/features/mypage/services/userService';
import { useUser } from '@/src/app/(auth)/mypage/MypageLayout';

export default function MyProfilePage() {
  const [isSaving, setIsSaving] = useState(false);

  const { userData, refreshUser } = useUser();

  // 폼 상태 관리
  const {
    nickname,
    nicknameError,
    handleNicknameChange,
    handleNicknameBlur,
    email,
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
    if (!isModified || !isFormValid || isSaving || !userData) {
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

      if (nickname !== userData.nickname) {
        updateData.nickname = nickname;
      }

      if (newPassword) {
        updateData.newPassword = newPassword;
      }

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

  // 로딩 중 또는 데이터 없음
  if (!userData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="max-w-[640px]">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-lg font-bold text-gray-900 mb-2">내 정보</h1>
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
          <div className="flex justify-center pt-6">
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
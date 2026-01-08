'use client';

import Input from '@/src/components/Input/Input';
import { useUser } from '@/src/app/(auth)/mypage/MypageLayout';

export default function MyProfilePage() {
  const userContext = useUser();
  const userData = userContext?.userData;

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
              value={userData.nickname}
              readOnly
              className="bg-gray-50 cursor-default"
              fullWidth
            />
          </div>

          {/* 이메일 영역 */}
          <div>
            <Input
              label="이메일"
              type="email"
              value={userData.email}
              readOnly
              className="bg-gray-50 cursor-default"
              fullWidth
            />
          </div>

          {/* 비밀번호 영역 */}
          <div>
            <Input
              label="비밀번호"
              type="password"
              value="********"
              readOnly
              className="bg-gray-50 cursor-default"
              fullWidth
            />
          </div>

          {/* 비밀번호 확인 영역 */}
          <div>
            <Input
              label="비밀번호 확인"
              type="password"
              value="********"
              readOnly
              className="bg-gray-50 cursor-default"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
}
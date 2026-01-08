export interface UserProfile {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// GET - 내 정보 조회
export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await fetch('/api/users/me', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('사용자 정보를 불러오는데 실패했습니다.');
  }

  return response.json();
};
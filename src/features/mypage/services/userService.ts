import { authFetch } from '@/src/lib/api/authFetch';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 공통 타입으로 사용시 import 해서 뽑아 갈 것. 
export interface UserProfile {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  nickname?: string;
  profileImageUrl?: string;
  newPassword?: string;
}

// GET - 내 정보 조회
export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await authFetch('/api/users/me', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('사용자 정보를 불러오는데 실패했습니다.');
  }

  return response.json();
};

// PATCH - 내 정보 수정
export const updateMyProfile = async (data: UpdateUserData): Promise<UserProfile> => {
  const response = await authFetch('/api/users/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('정보 수정에 실패했습니다.');
  }

  return response.json();
};

// POST - 프로필 이미지 업로드
export const uploadProfileImage = async (file: File): Promise<{ profileImageUrl: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await authFetch('/api/users/me/image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('이미지 업로드에 실패했습니다.');
  }

  return response.json();
};
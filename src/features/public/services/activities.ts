import { ActivityData } from '@/src/types/activityType';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 체험 상세 정보 조회
 */
export const getActivityDetail = async (activityId: string): Promise<ActivityData> => {
  const response = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('체험 상세 정보를 가져오는데 실패했습니다.');
  }

  const data = await response.json();
  return data;
};
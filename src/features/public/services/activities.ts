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

/**
 * 예약 가능 일정 조회
 */
export interface AvailableTime {
  id: number;
  startTime: string;
  endTime: string;
}

export interface AvailableSchedule {
  date: string;
  times: AvailableTime[];
}

export const getAvailableSchedule = async (
  activityId: string,
  year: string,
  month: string
): Promise<AvailableSchedule[]> => {
  const response = await fetch(
    `${API_BASE_URL}/activities/${activityId}/available-schedule?year=${year}&month=${month}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('예약 가능 일정을 가져오는데 실패했습니다.');
  }

  const data = await response.json();
  return data;
};

/**
 * 예약 신청 요청 타입
 */
export interface CreateReservationRequest {
  scheduleId: number;
  headCount: number;
}

/**
 * 예약 신청 응답 타입
 */
export interface ReservationResponse {
  id: number;
  teamId: string;
  userId: number;
  activityId: number;
  scheduleId: number;
  status: 'pending' | 'confirmed' | 'declined' | 'canceled';
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 예약 신청
 */
export const createReservation = async (
  activityId: string,
  data: CreateReservationRequest
): Promise<ReservationResponse> => {
  const response = await fetch(`/api/activities/${activityId}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '예약 신청에 실패했습니다.');
  }

  const result = await response.json();
  return result;
};

/**
 * 내 체험 삭제
 */
export const deleteMyActivity = async (activityId: string): Promise<void> => {
  const response = await fetch(`/api/my-activities/${activityId}/delete-activities`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '체험 삭제에 실패했습니다.');
  }
};
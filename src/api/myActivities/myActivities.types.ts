// 예약 상태
export type ReservationStatus =
    | 'pending'
    | 'confirmed'
    | 'declined'
    | 'completed';

// 체험 기본 정보 (판매자)
export interface MyActivity {
    id: number;
    userId: number;
    title: string;
    description: string;
    category: string;
    price: number;
    address: string;
    bannerImageUrl: string;
    rating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
}

// 내 체험 리스트 응답
export interface MyActivitiesResponse {
    cursorId: number;
    totalCount: number;
    activities: MyActivity[];
}

// 월별 예약 현황
export interface ReservationDashboardItem {
    date: string;
    reservations: {
        pending: number;
        confirmed: number;
        completed: number;
    };
}

// 날짜별 예약 스케줄
export interface ReservedScheduleItem {
    scheduleId: number;
    startTime: string;
    endTime: string;
    count: {
        pending: number;
        confirmed: number;
        declined: number;
    };
}

// 예약자 정보 포함 예약
export interface MyActivityReservation {
    id: number;
    nickname: string;
    userId: number;
    teamId: string;
    activityId: number;
    scheduleId: number;
    status: ReservationStatus;
    reviewSubmitted: boolean;
    totalPrice: number;
    headCount: number;
    date: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
}

// 예약 리스트 응답
export interface MyActivityReservationsResponse {
    cursorId: number;
    totalCount: number;
    reservations: MyActivityReservation[];
}

// 예약 상태 변경 요청
export interface UpdateMyActivityReservationBody {
    status: 'confirmed' | 'declined';
}

// 체험 수정 요청
export interface UpdateMyActivityBody {
    title?: string;
    category?: string;
    description?: string;
    price?: number;
    address?: string;
    bannerImageUrl?: string;

    subImageIdsToRemove?: number[];
    subImageUrlsToAdd?: string[];

    scheduleIdsToRemove?: number[];
    schedulesToAdd?: {
        date: string;
        startTime: string;
        endTime: string;
    }[];
}
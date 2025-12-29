// 예약 상태
export type ReservationStatus =
    | 'pending'
    | 'confirmed'
    | 'declined'
    | 'canceled'
    | 'completed';

// 내 예약 (구매자 기준)
export interface MyReservation {
    id: number;
    teamId: string;
    userId: number;
    activityId: number;

    activityTitle: string;
    activityBannerImageUrl: string;

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

// 내 예약 리스트 응답
export interface MyReservationsResponse {
    cursorId: number;
    totalCount: number;
    reservations: MyReservation[];
}

// 예약 취소 응답
export interface CancelMyReservationResponse {
    reservationId: number;
    status: 'canceled';
}
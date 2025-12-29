import { http } from '../http';
import {
    MyReservationsResponse,
    MyReservation,
    CancelMyReservationResponse,
} from './myReservations.types';

/**
 * 내 예약 리스트 조회 (구매자)
 * GET /my-reservations
 */
export const getMyReservations = (
    cursorId?: number,
    size: number = 10
) => {
    return http.get<MyReservationsResponse>('/my-reservations', {
        params: { cursorId, size },
    });
};

/**
 * 내 예약 취소
 * PATCH /my-reservations/{reservationId}/cancel
 */
export const cancelMyReservation = (reservationId: number) => {
    return http.patch<CancelMyReservationResponse>(
        `/my-reservations/${reservationId}/cancel`
    );
};
import { http } from '../http';
import {
    MyActivitiesResponse,
    MyActivity,
    ReservationDashboardItem,
    ReservedScheduleItem,
    MyActivityReservationsResponse,
    UpdateMyActivityReservationBody,
    UpdateMyActivityBody,
} from './myActivities.types';

/**
 * 내 체험 리스트 조회 (판매자)
 * GET /my-activities
 */
export const getMyActivities = (
    cursorId?: number,
    size: number = 20
) => {
    return http.get<MyActivitiesResponse>('/my-activities', {
        params: { cursorId, size },
    });
};

/**
 * 내 체험 월별 예약 현황 조회
 * GET /my-activities/{activityId}/reservation-dashboard
 */
export const getMyActivityReservationDashboard = (
    activityId: number,
    year: string,
    month: string
) => {
    return http.get<ReservationDashboardItem[]>(
        `/my-activities/${activityId}/reservation-dashboard`,
        {
            params: { year, month },
        }
    );
};

/**
 * 내 체험 날짜별 예약 스케줄 조회
 * GET /my-activities/{activityId}/reserved-schedule
 */
export const getMyActivityReservedSchedule = (
    activityId: number,
    date: string
) => {
    return http.get<ReservedScheduleItem[]>(
        `/my-activities/${activityId}/reserved-schedule`,
        {
            params: { date },
        }
    );
};

/**
 * 내 체험 예약 리스트 조회 (시간대별)
 * GET /my-activities/{activityId}/reservations
 */
export const getMyActivityReservations = (
    activityId: number,
    scheduleId: number,
    status: 'pending' | 'confirmed' | 'declined',
    cursorId?: number,
    size: number = 10
) => {
    return http.get<MyActivityReservationsResponse>(
        `/my-activities/${activityId}/reservations`,
        {
            params: { scheduleId, status, cursorId, size },
        }
    );
};

/**
 * 내 체험 예약 상태 변경 (승인 / 거절)
 * PATCH /my-activities/{activityId}/reservations/{reservationId}
 */
export const updateMyActivityReservationStatus = (
    activityId: number,
    reservationId: number,
    body: UpdateMyActivityReservationBody
) => {
    return http.patch(
        `/my-activities/${activityId}/reservations/${reservationId}`,
        body
    );
};

/**
 * 내 체험 삭제
 * DELETE /my-activities/{activityId}
 */
export const deleteMyActivity = (activityId: number) => {
    return http.delete(`/my-activities/${activityId}`);
};

/**
 * 내 체험 수정
 * PATCH /my-activities/{activityId}
 */
export const updateMyActivity = (
    activityId: number,
    body: UpdateMyActivityBody
) => {
    return http.patch<MyActivity>(
        `/my-activities/${activityId}`,
        body
    );
};
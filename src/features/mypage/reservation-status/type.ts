/* ======================
 * 공통 예약 상태 
 ====================== */
export type ReservationStatus = "pending" | "confirmed" | "declined";

/* ======================
 * GET /my-activities/{activityId}/reservations
 ====================== */
export interface ReservationApi {
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

/* ======================
 *  예약자 리스트 응답
 ====================== */
export interface ReservationsResponse {
  cursorId: number | null;
  totalCount: number;
  reservations: ReservationApi[];
}

/* ======================
 * GET /reserved-schedule
 ====================== */
export interface ReservedScheduleApi {
  scheduleId: number;
  startTime: string;
  endTime: string;
  count: {
    pending: number;
    confirmed: number;
    declined: number;
  };
}

/* ======================
 * GET /reservation-dashboard
 ====================== */
export interface ReservationDashboardApi {
  date: string;
  reservations: {
    pending: number;
    confirmed: number;
    completed: number;
  };
}
/* ======================
 * 팝오버에서 쓰는 예약자
 ====================== */
export interface Reservation {
  id: number;
  nickname: string;
  headCount: number;
  status: "pending" | "confirmed" | "declined";
  scheduleId: number;
  startTime: string;
  endTime: string;
}

/* ======================
 * 캘린더 하루 요약
 ====================== */
export interface CalendarDaySummary {
  reserved: number;
  approved: number;
  completed: number;
}

/* ======================
 * 날짜 + scheduleId 메타
 ====================== */
export interface DayScheduleMeta {
  date: string;
  scheduleId: number;
}

// 예약 상태 타입
export type ReservationStatus =
  | "pending"
  | "canceled"
  | "confirmed"
  | "declined"
  | "completed";

// 체험 정보
export interface ReservationActivity {
  id: number;
  title: string;
  bannerImageUrl: string;
}

// 예약
export interface Reservation {
  id: number;
  teamId: string;
  userId: number;
  activity: ReservationActivity;
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
export interface ReservationResponse {
  reservations: Reservation[];
  cursorId: number | null;
  totalCount: number;
}

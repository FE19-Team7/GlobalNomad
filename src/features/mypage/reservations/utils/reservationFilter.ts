import { ReservationStatus } from "@/src/components/Card/StatusBadge";

export type ReservationFilter = "all" | ReservationStatus;

export const RESERVATION_FILTERS: {
  key: ReservationFilter;
  label: string;
}[] = [
  { key: "all", label: "전체" },
  { key: "confirmed", label: "진행중" },
  { key: "completed", label: "완료" },
  { key: "canceled", label: "취소" },
];

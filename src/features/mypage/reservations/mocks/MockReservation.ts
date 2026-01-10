import { ReservationStatus } from "@/src/components/Card/StatusBadge";

export interface Reservation {
  id: number;
  activity: {
    id: number;
    title: string;
    bannerImageUrl?: string;
  };
  status: ReservationStatus;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
}

const statuses: ReservationStatus[] = ["confirmed", "completed", "canceled"];

export const generateMockReservations = (count = 60): Reservation[] => {
  return Array.from({ length: count }, (_, i) => {
    const status = statuses[i % statuses.length];

    return {
      id: i + 1,
      activity: {
        id: 1000 + i,
        title: `체험 상품 ${i + 1}`,
      },
      status,
      totalPrice: 50000 + (i % 5) * 20000,
      headCount: (i % 4) + 1,
      date: `2026-01-${String((i % 28) + 1).padStart(2, "0")}`,
      startTime: "10:00",
      endTime: "12:00",
    };
  });
};

"use client";

import { authFetch } from "@/src/lib/api/authFetch";
import { Reservation } from "../type";

type UseReservationActionsParams = {
  setItems: React.Dispatch<React.SetStateAction<Reservation[]>>;
};

export function useReservationActions({
  setItems,
}: UseReservationActionsParams) {
  /**
   * 리뷰 작성
   */
  const submitReview = async (
    reservationId: number,
    rating: number,
    content: string
  ) => {
    const res = await authFetch(`/api/my-reservations/${reservationId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, content }),
    });

    if (!res.ok) {
      throw new Error("REVIEW_FAILED");
    }

    // ✅ 리뷰 작성 완료 상태 반영
    setItems((prev) =>
      prev.map((item) =>
        item.id === reservationId ? { ...item, reviewSubmitted: true } : item
      )
    );
  };

  /**
   * 예약 취소
   */
  const cancelReservation = async (reservationId: number) => {
    const res = await authFetch(`/api/my-reservations/${reservationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "canceled" }),
    });

    if (!res.ok) {
      throw new Error("CANCEL_FAILED");
    }

    // ✅ 취소 → 리스트에서 제거
    setItems((prev) => prev.filter((item) => item.id !== reservationId));
  };

  return {
    submitReview,
    cancelReservation,
  };
}

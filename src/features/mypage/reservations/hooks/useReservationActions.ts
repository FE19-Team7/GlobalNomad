"use client";

import { authFetch } from "@/src/lib/api/authFetch";

type UseReservationActionsParams = {
  onSubmitReview?: (reservationId: number) => void;
  onCancelReservation?: (reservationId: number) => void;
};

export function useReservationActions({
  onSubmitReview,
  onCancelReservation,
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

    // 리뷰 작성 성공 시 콜백 알림
    onSubmitReview?.(reservationId);
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

    // 예약 취소 성공 시 콜백 알림
    onCancelReservation?.(reservationId);
  };

  return {
    submitReview,
    cancelReservation,
  };
}

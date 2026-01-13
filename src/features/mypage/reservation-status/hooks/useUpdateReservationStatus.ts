"use client";

export function useUpdateReservationStatus() {
  const updateStatus = async (
    activityId: number,
    reservationId: number,
    status: "pending" | "confirmed" | "declined"
  ) => {
    const res = await fetch(
      `/api/my-activities/${activityId}/reservations/${reservationId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      throw new Error(error?.message ?? "예약 상태 변경 실패");
    }

    return res.json();
  };

  return { updateStatus };
}

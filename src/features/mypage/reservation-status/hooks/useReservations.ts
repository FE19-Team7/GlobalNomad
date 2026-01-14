"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/src/lib/api/authFetch";
import {
  Reservation,
  ReservationStatus,
} from "@/src/features/mypage/reservation-status/type";

interface UseReservationsResult {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseReservationsParams {
  activityId?: number;
  scheduleId?: number;
  status?: ReservationStatus;
}

export function useReservations({
  activityId,
  scheduleId,
  status,
}: UseReservationsParams): UseReservationsResult {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    if (!activityId || !scheduleId || !status) {
      setReservations([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("scheduleId", String(scheduleId));
      params.append("status", status);

      const res = await authFetch(
        `/api/my-activities/${activityId}/reservations?${params.toString()}`
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "예약자 목록 조회 실패");
      }

      const data = await res.json();

      setReservations(data.reservations ?? []);
    } catch (e) {
      setReservations([]);
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }, [activityId, scheduleId, status]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations,
  };
}

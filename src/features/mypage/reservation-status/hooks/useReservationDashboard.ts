"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/src/lib/api/authFetch";
import {
  ReservationDashboardApi,
  CalendarDaySummary,
} from "@/src/features/mypage/reservation-status/type";

export function useReservationDashboard(
  activityId?: number,
  year?: number,
  month?: number
) {
  const [summaryMap, setSummaryMap] = useState<
    Record<string, CalendarDaySummary>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!activityId || !year || !month) {
      setSummaryMap({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authFetch(
        `/api/my-activities/${activityId}/reservation-dashboard?year=${year}&month=${String(
          month
        ).padStart(2, "0")}`
      );

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "예약 현황 조회 실패");
      }

      const data: ReservationDashboardApi[] = await res.json();

      const mapped: Record<string, CalendarDaySummary> = {};

      data.forEach((item) => {
        mapped[item.date] = {
          reserved: item.reservations.pending,
          approved: item.reservations.confirmed,
          completed: item.reservations.completed,
        };
      });

      setSummaryMap(mapped);
    } catch (e) {
      setSummaryMap({});
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }, [activityId, year, month]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    summaryMap,
    loading,
    error,
    refetch: fetchDashboard,
  };
}

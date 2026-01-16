"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/src/lib/api/authFetch";

export interface ReservedSchedule {
  scheduleId: number;
  startTime: string;
  endTime: string;
  count: {
    pending: number;
    confirmed: number;
    declined: number;
  };
}

export interface UseReservedScheduleResult {
  schedules: ReservedSchedule[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useReservedSchedule(
  activityId?: number,
  date?: string
): UseReservedScheduleResult {
  const [schedules, setSchedules] = useState<ReservedSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    if (!activityId || !date) {
      setSchedules([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authFetch(
        `/api/my-activities/${activityId}/reserved-schedule?date=${date}`
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "예약 스케줄 조회 실패");
      }

      const data: ReservedSchedule[] = await res.json();
      setSchedules(data);
    } catch (err) {
      setSchedules([]);
      setError(err instanceof Error ? err.message : "알 수 없는 에러");
    } finally {
      setLoading(false);
    }
  }, [activityId, date]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return {
    schedules,
    loading,
    error,
    refetch: fetchSchedules,
  };
}

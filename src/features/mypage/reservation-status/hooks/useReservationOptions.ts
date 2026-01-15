"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/src/lib/api/authFetch";
import { ReservationItem } from "@/src/components/Dropdown/ReservationsDropdown";

interface MyActivity {
  id: number;
  title: string;
  createdAt: string;
}

interface MyActivitiesResponse {
  activities: MyActivity[];
}

export function useReservationOptions() {
  const [items, setItems] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await authFetch("/api/my-activities");

        if (!res.ok) {
          throw new Error("체험 목록 조회 실패");
        }

        const data: MyActivitiesResponse = await res.json();

        setItems(
          data.activities.map((activity) => ({
            value: String(activity.id),
            label: activity.title,
            reservedAt: activity.createdAt,
          }))
        );
      } catch (e) {
        setItems([]);
        setError(e instanceof Error ? e.message : "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { items, loading, error };
}

"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/src/lib/api/authFetch";
import { NotificationUIItem } from "@/src/components/Notification/types";

export function useNotifications(isOpen: boolean) {
  const [notifications, setNotifications] = useState<NotificationUIItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let alive = true;

    authFetch("/api/my-notifications?size=10")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || !alive) return;

        setLoading(true);
        setNotifications(data.notifications);
        setTotalCount(data.totalCount);
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [isOpen]);

  return {
    notifications,
    totalCount,
    loading,
    setNotifications,
    setTotalCount,
  };
}

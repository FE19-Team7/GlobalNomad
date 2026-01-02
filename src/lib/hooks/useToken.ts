"use client";

import { useEffect, useState } from "react";

export function useToken() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/token", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("unauthorized");
        return res.json();
      })
      .then((data) => setToken(data.token))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  return { token, loading };
}

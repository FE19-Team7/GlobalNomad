import { apiFetch } from "@/src/lib/api/fetcher";
import type { MyActivitiesResponse } from "../type";

export async function getMyActivities(params: { cursorId?: number; size?: number }) {
  const { cursorId, size = 20 } = params;

  return apiFetch<MyActivitiesResponse>("/api/my-activities", {
    method: "GET",
    params: { cursorId, size },
  });
}

export async function deleteMyActivity(activityId: number) {
  return apiFetch<void>(`/api/my-activities/${activityId}`, {
    method: "DELETE",
  });
}
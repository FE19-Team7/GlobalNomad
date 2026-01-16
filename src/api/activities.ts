const BASE = '/api';

async function parseErrorMessage(res: Response, fallback: string) {
  try {
    const data = await res.json();
    return data?.message ?? fallback;
  } catch {
    return fallback;
  }
}

/** 이미지 업로드 */
export async function uploadActivityImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${BASE}/activities/image`, {
    method: 'POST',
    body: formData,
    // credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, '이미지 업로드 실패'));
  }

  const data: { activityImageUrl: string } = await res.json();
  return data.activityImageUrl;
}

/** 체험 등록 */
export async function createActivity(payload: {
  title: string;
  category: string;
  description: string;
  address: string;
  price: number;
  schedules: { date: string; startTime: string; endTime: string }[];
  bannerImageUrl: string;
  subImageUrls: string[];
}) {
  const res = await fetch(`${BASE}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    // credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, '체험 등록 실패'));
  }

  return res.json();
}

/** 체험 상세 조회 */
export async function getActivityDetail(activityId: number) {
  const res = await fetch(`${BASE}/activities/${activityId}`, {
    method: 'GET',
    // credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, '체험 상세 조회 실패'));
  }

  return res.json();
}

/** 내 체험 수정 */
export async function updateActivity(
  activityId: number,
  payload: {
    title: string;
    category: string;
    description: string;
    price: number;
    address: string;
    bannerImageUrl: string;
    subImageIdsToRemove: number[];
    subImageUrlsToAdd: string[];
    scheduleIdsToRemove: number[];
    schedulesToAdd: { date: string; startTime: string; endTime: string }[];
  }
) {
  const res = await fetch(`${BASE}/my-activities/${activityId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    // credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, '체험 수정 실패'));
  }

  return res.json();
}
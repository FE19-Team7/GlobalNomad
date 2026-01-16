export type ActivityDetailResponse = {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImages?: { id: number; imageUrl: string }[];
  schedules?: { id: number; date: string; startTime: string; endTime: string }[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object';
}

async function readErrorMessage(res: Response, fallback: string) {
  try {
    const data: unknown = await res.json();

    if (isRecord(data) && 'message' in data) {
      const msg = data.message;
      return typeof msg === 'string' ? msg : fallback;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

function isUploadImageResponse(data: unknown): data is { activityImageUrl: string } {
  return isRecord(data) && typeof data.activityImageUrl === 'string';
}

// “필수 필드만” 검증(가벼운 런타임 가드)
function isActivityDetailResponse(data: unknown): data is ActivityDetailResponse {
  if (!isRecord(data)) return false;

  return (
    typeof data.id === 'number' &&
    typeof data.title === 'string' &&
    typeof data.category === 'string' &&
    typeof data.description === 'string' &&
    typeof data.price === 'number' &&
    typeof data.address === 'string' &&
    typeof data.bannerImageUrl === 'string'
  );
}

/** 이미지 업로드: POST /api/activities/image */
export async function uploadActivityImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/activities/image', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res, '이미지 업로드 실패'));
  }

  const data: unknown = await res.json();

  if (!isUploadImageResponse(data)) {
    throw new Error('이미지 업로드 응답 형식이 올바르지 않습니다.');
  }

  return data.activityImageUrl;
}

/** 등록: POST /api/activities */
export async function createActivity(payload: {
  title: string;
  category: string;
  description: string;
  address: string;
  price: number;
  schedules: { date: string; startTime: string; endTime: string }[];
  bannerImageUrl: string;
  subImageUrls: string[];
}): Promise<unknown> {
  const res = await fetch('/api/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res, '체험 등록 실패'));
  }

  return res.json();
}

/** 상세: GET /api/activities/:activityId */
export async function getActivityDetail(activityId: number): Promise<ActivityDetailResponse> {
  const res = await fetch(`/api/activities/${activityId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res, '체험 상세 조회 실패'));
  }

  const data: unknown = await res.json();

  if (!isActivityDetailResponse(data)) {
    throw new Error('체험 상세 응답 형식이 올바르지 않습니다.');
  }
  return data;
}

/** 수정: PATCH /api/my-activities/:activityId */
export async function updateMyActivity(
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
): Promise<unknown> {
  const res = await fetch(`/api/my-activities/${activityId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res, '체험 수정 실패'));
  }

  return res.json();
}
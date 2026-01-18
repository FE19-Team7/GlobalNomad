import type { MyActivity, MyActivitiesResponse } from '../type';

let MOCK_MY_ACTIVITIES: MyActivity[] = Array.from({ length: 27 }).map((_, i) => ({
  id: 1000 + i,
  title: `체험 ${i + 1}`,
  price: 10000 + i * 1000,
  rating: 4.5,
  reviewCount: 12 + i,
  bannerImageUrl: undefined,
}));

export function getMyActivitiesMock(params: { cursorId?: number; size?: number }): MyActivitiesResponse {
  const { cursorId, size = 20 } = params;

  // cursorId를 배열 index처럼 사용
  const start = cursorId ?? 0;
  const slice = MOCK_MY_ACTIVITIES.slice(start, start + size);

  const next = start + slice.length;
  const nextCursor = next >= MOCK_MY_ACTIVITIES.length ? null : next;

  return {
    cursorId: nextCursor,
    totalCount: MOCK_MY_ACTIVITIES.length,
    activities: slice,
  };
}

export function deleteMyActivityMock(id: number) {
  MOCK_MY_ACTIVITIES = MOCK_MY_ACTIVITIES.filter((x) => x.id !== id);
}
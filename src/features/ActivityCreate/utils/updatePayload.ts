import { Schedule, ActivityDetail } from '../type';

const same = (a: Schedule, b: Schedule) =>
  a.date === b.date && a.startTime === b.startTime && a.endTime === b.endTime;

export function buildUpdatePayload(params: {
  currentSchedules: Schedule[];
  original: ActivityDetail;
  subImageIdsToRemove: number[];
  subImageUrlsToAdd: string[];
  bannerImageUrl: string;
  title: string;
  category: string;
  description: string;
  price: number;
  address: string;
}) {
  const { currentSchedules, original } = params;

  const scheduleIdsToRemove: number[] = [];
  const schedulesToAdd: Array<{ date: string; startTime: string; endTime: string }> = [];

  const originalById = new Map(original.schedules.map((s) => [s.id!, s]));

  // 1) 원본 id 기준: 삭제/변경 감지
  for (const orig of original.schedules) {
    const cur = currentSchedules.find((s) => s.id === orig.id);
    if (!cur) {
      scheduleIdsToRemove.push(orig.id!);
      continue;
    }
    if (!same(cur, orig)) {
      scheduleIdsToRemove.push(orig.id!);
      schedulesToAdd.push({ date: cur.date, startTime: cur.startTime, endTime: cur.endTime });
    }
  }

  // 2) 신규(id 없음) 추가 감지
  for (const cur of currentSchedules) {
    if (!cur.id) {
      schedulesToAdd.push({ date: cur.date, startTime: cur.startTime, endTime: cur.endTime });
      continue;
    }
    // 방어: id 있는데 원본에 없으면 신규 취급
    if (!originalById.has(cur.id)) {
      schedulesToAdd.push({ date: cur.date, startTime: cur.startTime, endTime: cur.endTime });
    }
  }

  return {
    title: params.title,
    category: params.category,
    description: params.description,
    price: params.price,
    address: params.address,
    bannerImageUrl: params.bannerImageUrl,
    subImageIdsToRemove: params.subImageIdsToRemove,
    subImageUrlsToAdd: params.subImageUrlsToAdd,
    scheduleIdsToRemove,
    schedulesToAdd,
  };
}
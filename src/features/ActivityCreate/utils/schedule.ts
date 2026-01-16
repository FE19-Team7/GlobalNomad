import { Schedule } from '../type';

/** HH:mm -> minutes */
export function timeToMinutes(time: string) {
  const [hh, mm] = time.split(':').map(Number);
  return hh * 60 + mm;
}

/** 스케줄 단건 유효성(비어있음/시간역전) */
export function isInvalidSchedule(s: Schedule) {
  if (!s.date || !s.startTime || !s.endTime) return true;
  if (timeToMinutes(s.endTime) <= timeToMinutes(s.startTime)) return true;
  return false;
}

/** 같은 날짜 내 시간 겹침 여부 체크 */
export function hasOverlappedSchedules(schedules: Schedule[]) {
  const byDate = new Map<string, Schedule[]>();

  schedules.forEach((s) => {
    if (!byDate.has(s.date)) byDate.set(s.date, []);
    byDate.get(s.date)!.push(s);
  });

  for (const [, list] of byDate) {
    const sorted = [...list].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

    for (let i = 0; i < sorted.length - 1; i++) {
      if (timeToMinutes(sorted[i + 1].startTime) < timeToMinutes(sorted[i].endTime)) {
        return true;
      }
    }
  }

  return false;
}

/** 시간 옵션 (00:00 ~ 23:00) */
export const TIME_OPTIONS = Array.from({ length: 24 }, (_, h) => {
  const hh = String(h).padStart(2, '0');
  return `${hh}:00`;
});
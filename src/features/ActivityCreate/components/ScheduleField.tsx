'use client';

import Input from '@/src/components/Input/Input';
import { Schedule } from '../type';
import { hasOverlappedSchedules, isInvalidSchedule, TIME_OPTIONS } from '../utils/schedule';

type ScheduleFieldProps = {
  draft: Schedule;
  onChangeDraft: (next: Schedule) => void;

  schedules: Schedule[];
  onChangeSchedules: (next: Schedule[]) => void;

  // UX 정책:
  // - “+” 실패 시 draft row만 빨간 테두리
  // - 제출(submitted) 때에만 전체 스케줄 검증
  submitted: boolean;
};

export default function ScheduleField({
  draft,
  onChangeDraft,
  schedules,
  onChangeSchedules,
  submitted,
}: ScheduleFieldProps) {
  // “+” 클릭 시도에만 draft row 에러 표시
  const [addAttempted, setAddAttempted] = (function () {
    // 컴포넌트 내부 간단 state (훅 분리 안 함: 요청사항)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const React = require('react') as typeof import('react');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return React.useState(false) as [boolean, (v: boolean) => void];
  })();

  // 제출 기준: schedules 전체 유효(최소1개/단건유효/겹침없음)
  const scheduleSubmitError =
    submitted &&
    (schedules.length === 0 ||
      schedules.some(isInvalidSchedule) ||
      hasOverlappedSchedules(schedules));

  // draft 기준: addAttempted일 때만 체크
  const draftBaseInvalid = addAttempted && isInvalidSchedule(draft);
  const draftOverlapInvalid =
    addAttempted && !isInvalidSchedule(draft) && hasOverlappedSchedules([...schedules, draft]);
  const draftError = draftBaseInvalid || draftOverlapInvalid;

  const addSchedule = () => {
    setAddAttempted(true);

    if (isInvalidSchedule(draft)) return;
    const next = [...schedules, draft];
    if (hasOverlappedSchedules(next)) return;

    onChangeSchedules(next);
    onChangeDraft({ date: '', startTime: '', endTime: '' });
    setAddAttempted(false);
  };

  const removeSchedule = (idx: number) => {
    onChangeSchedules(schedules.filter((_, i) => i !== idx));
  };

  const updateScheduleAt = (idx: number, patch: Partial<Schedule>) => {
    onChangeSchedules(
      schedules.map((s, i) => (i === idx ? { ...s, ...patch } : s))
    );
  };

  // rowError: 제출 시에만(과한 UX 방지)
  // - 겹침이 하나라도 있으면 전체 row가 빨갛게(텍스트 없음)
  const overlapped = scheduleSubmitError && hasOverlappedSchedules(schedules);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-body-lg font-bold">예약 가능한 시간대</p>

      {/* 컬럼 헤더 */}
      <div className="flex items-center gap-2">
        <p className="flex-1 text-body-lg">날짜</p>
        <p className="w-[140px] text-body-lg">시작 시간</p>
        <p className="w-[140px] text-body-lg">종료 시간</p>
        <div className="w-[42px]" />
      </div>

      <datalist id="time-options">
        {TIME_OPTIONS.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>

      {/* 추가용 row */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            type="date"
            value={draft.date}
            onChange={(e) => onChangeDraft({ ...draft, date: e.target.value })}
            className={`cursor-pointer ${
              !draft.date
                ? '[&::-webkit-datetime-edit]:text-gray-400'
                : '[&::-webkit-datetime-edit]:text-gray-950'
            }`}
            error={draftError ? ' ' : undefined}
          />
        </div>

        <div className="w-[140px]">
          <Input
            type="text"
            placeholder="0:00"
            value={draft.startTime}
            onChange={(e) => onChangeDraft({ ...draft, startTime: e.target.value })}
            list="time-options"
            className="cursor-pointer"
            error={draftError ? ' ' : undefined}
          />
        </div>

        <div className="w-[140px]">
          <Input
            type="text"
            placeholder="0:00"
            value={draft.endTime}
            onChange={(e) => onChangeDraft({ ...draft, endTime: e.target.value })}
            list="time-options"
            className="cursor-pointer"
            error={draftError ? ' ' : undefined}
          />
        </div>

        <button
          type="button"
          onClick={addSchedule}
          className="
            h-[42px] w-[42px] rounded-full
            bg-primary-500 text-white text-xl
            flex items-center justify-center
            cursor-pointer
            hover:opacity-90
          "
          aria-label="예약 가능한 시간 추가"
        >
          +
        </button>
      </div>

      {schedules.length > 0 && <div className="h-px w-full bg-gray-100" />}

      {/* 등록된 리스트 */}
      <div className="flex flex-col gap-4">
        {schedules.map((s, idx) => {
          const rowInvalid = scheduleSubmitError && (isInvalidSchedule(s) || overlapped);
          return (
            <div key={`${s.date}-${s.startTime}-${s.endTime}-${idx}`} className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="date"
                  value={s.date}
                  onChange={(e) => updateScheduleAt(idx, { date: e.target.value })}
                  className="cursor-pointer"
                  error={rowInvalid ? ' ' : undefined}
                />
              </div>

              <div className="w-[140px]">
                <Input
                  type="text"
                  value={s.startTime}
                  onChange={(e) => updateScheduleAt(idx, { startTime: e.target.value })}
                  list="time-options"
                  className="cursor-pointer"
                  error={rowInvalid ? ' ' : undefined}
                />
              </div>

              <div className="w-[140px]">
                <Input
                  type="text"
                  value={s.endTime}
                  onChange={(e) => updateScheduleAt(idx, { endTime: e.target.value })}
                  list="time-options"
                  className="cursor-pointer"
                  error={rowInvalid ? ' ' : undefined}
                />
              </div>

              <button
                type="button"
                onClick={() => removeSchedule(idx)}
                className="
                  h-[42px] w-[42px] rounded-full
                  bg-gray-50 text-gray-950 text-xl
                  flex items-center justify-center
                  cursor-pointer
                  hover:bg-gray-100
                "
                aria-label="예약 가능한 시간 삭제"
              >
                −
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
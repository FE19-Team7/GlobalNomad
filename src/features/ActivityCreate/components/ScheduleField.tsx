'use client';

import { useState } from 'react';
import Input from '@/src/components/Input/Input';
import type { Schedule } from '../type';
import { hasOverlappedSchedules, isInvalidSchedule, TIME_OPTIONS } from '../utils/schedule';

type Props = {
  draft: Schedule;
  onChangeDraft: (next: Schedule) => void;

  schedules: Schedule[];
  onChangeSchedules: (next: Schedule[]) => void;

  submitted: boolean;
};

export default function ScheduleField({
  draft,
  onChangeDraft,
  schedules,
  onChangeSchedules,
  submitted,
}: Props) {
  const [addAttempted, setAddAttempted] = useState(false);

  const scheduleSubmitError =
    submitted &&
    (schedules.length === 0 ||
      schedules.some(isInvalidSchedule) ||
      hasOverlappedSchedules(schedules));

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
    onChangeSchedules(schedules.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const overlapped = scheduleSubmitError && hasOverlappedSchedules(schedules);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-body-lg font-bold">예약 가능한 시간대</p>

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

      {/* 추가 row */}
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
          className="h-[42px] w-[42px] rounded-full bg-primary-500 text-white text-xl flex items-center justify-center cursor-pointer hover:opacity-90"
          aria-label="예약 가능한 시간 추가"
        >
          +
        </button>
      </div>

      {schedules.length > 0 && <div className="h-px w-full bg-gray-100" />}

      {/* 리스트 */}
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
                className="h-[42px] w-[42px] rounded-full bg-gray-50 text-gray-950 text-xl flex items-center justify-center cursor-pointer hover:bg-gray-100"
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

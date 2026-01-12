"use client";

import {
  addMonths,
  subMonths,
  startOfMonth,
  getDay,
  getDaysInMonth,
  format,
} from "date-fns";
import { useState } from "react";
import { CalendarDayCell } from "./CalendarDayCell";

export interface DaySummary {
  reserved: number;
  approved: number;
  completed: number;
}

const EMPTY_SUMMARY: DaySummary = {
  reserved: 0,
  approved: 0,
  completed: 0,
};

interface CalendarProps {
  summaryMap?: Record<string, DaySummary>;
}

export default function Calendar({ summaryMap = {} }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  /** ===== 날짜 계산 ===== */
  const startDayOfWeek = getDay(startOfMonth(currentDate));
  const daysInMonth = getDaysInMonth(currentDate);

  const totalCells = Math.ceil((startDayOfWeek + daysInMonth) / 7) * 7;

  const prevMonth = subMonths(currentDate, 1);
  const prevMonthDays = getDaysInMonth(prevMonth);

  const prevDays = Array.from(
    { length: startDayOfWeek },
    (_, i) => prevMonthDays - startDayOfWeek + i + 1
  );

  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const nextDays = Array.from(
    { length: totalCells - (prevDays.length + currentDays.length) },
    (_, i) => i + 1
  );

  /** ===== 렌더링용 통합 배열 ===== */
  const calendarCells = [
    ...prevDays.map((day) => ({
      day,
      isOutsideMonth: true,
      dateKey: null,
    })),
    ...currentDays.map((day) => ({
      day,
      isOutsideMonth: false,
      dateKey: format(new Date(year, month, day), "yyyy-MM-dd"),
    })),
    ...nextDays.map((day) => ({
      day,
      isOutsideMonth: true,
      dateKey: null,
    })),
  ];

  return (
    <div className="rounded-2xl bg-white border border-gray-50 shadow-sm pt-5">
      {/* Header */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
          ◀
        </button>

        <h2 className="text-body-lg font-semibold">
          {format(currentDate, "yyyy년 M월")}
        </h2>

        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
          ▶
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-gray-400 text-body border-b border-gray-100">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarCells.map(({ day, isOutsideMonth, dateKey }, index) => (
          <div key={`${day}-${index}`} className="h-31 border-t border-gray-50">
            <CalendarDayCell
              day={day}
              isOutsideMonth={isOutsideMonth}
              summary={
                dateKey ? (summaryMap[dateKey] ?? EMPTY_SUMMARY) : EMPTY_SUMMARY
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

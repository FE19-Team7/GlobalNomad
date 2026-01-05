"use client";

import { useRef, useState } from "react";
import { format } from "date-fns";

import ReservationPopover from "@/src/components/Popover/Popover";
import { CalendarDayCell } from "@/src/components/Calendar/CalendarDayCell";

export default function DonghyeonPage() {
  const anchorRef = useRef<HTMLElement | null>(null);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  /* 날짜 클릭 */
  const handleDayClick = (e: React.MouseEvent<HTMLDivElement>, date: Date) => {
    anchorRef.current = e.currentTarget;
    setSelectedDate(date);
    setPopoverOpen(true);
  };

  return (
    <div className="p-10 space-y-10">
      {/* ===============================
          Calendar 영역
      =============================== */}
      <div className="grid grid-cols-5 gap-4 h-[124px]">
        {/* 1일 */}
        <div
          onClick={(e) => handleDayClick(e, new Date(2025, 12, 1))}
          className="cursor-pointer"
        >
          <CalendarDayCell
            day={1}
            summary={{
              reserved: 0,
              approved: 0,
              completed: 0,
            }}
          />
        </div>

        {/* 2일 - 예약 있음 */}
        <div
          onClick={(e) => handleDayClick(e, new Date(2025, 12, 2))}
          className="cursor-pointer"
        >
          <CalendarDayCell
            day={2}
            summary={{
              reserved: 2,
              approved: 0,
              completed: 0,
            }}
          />
        </div>

        {/* 3일 - 예약 + 승인 */}
        <div
          onClick={(e) => handleDayClick(e, new Date(2025, 12, 3))}
          className="cursor-pointer"
        >
          <CalendarDayCell
            day={3}
            summary={{
              reserved: 1,
              approved: 3,
              completed: 0,
            }}
          />
        </div>

        {/* 4일 - 예약 + 승인 + 완료 */}
        <div
          onClick={(e) => handleDayClick(e, new Date(2025, 12, 4))}
          className="cursor-pointer"
        >
          <CalendarDayCell
            day={4}
            summary={{
              reserved: 1,
              approved: 1,
              completed: 1,
            }}
          />
        </div>

        {/* 5일 - 완료만 */}
        <div
          onClick={(e) => handleDayClick(e, new Date(2025, 12, 5))}
          className="cursor-pointer"
        >
          <CalendarDayCell
            day={5}
            summary={{
              reserved: 0,
              approved: 0,
              completed: 4,
            }}
          />
        </div>
      </div>

      {/* ===============================
          Popover
      =============================== */}
      {selectedDate && (
        <ReservationPopover
          isOpen={popoverOpen}
          onClose={() => setPopoverOpen(false)}
          dateLabel={format(selectedDate, "yyyy년 M월 d일")}
          anchorRef={anchorRef}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import ReservationsDropdown from "@/src/components/Dropdown/ReservationsDropdown";
import Calendar from "@/src/components/Calendar/Calendar";
import { useReservationOptions } from "@/src/features/mypage/reservation-status/hooks/useReservationOptions";
import { MOCK_SUMMARY } from "@/src/app/dev/donghyeon/page";

export default function Page() {
  const [selectedReservation, setSelectedReservation] = useState<
    string | undefined
  >(undefined);

  const { items } = useReservationOptions();

  return (
    <section className="w-full flex justify-center">
      {/* 가운데 컨텐츠 영역 */}
      <div className="w-full max-w-[640px] flex flex-col gap-6">
        {/* 상단 텍스트 */}
        <div>
          <h1 className="text-h4 font-bold">예약 현황</h1>
          <p className="text-body text-gray-500">
            내 체험에 예약된 내역을 한 눈에 확인할 수 있습니다.
          </p>
        </div>

        {/* 체험 선택 드롭다운 */}
        <div>
          <ReservationsDropdown
            items={items}
            value={selectedReservation}
            onChange={setSelectedReservation}
          />
        </div>

        {/* 캘린더 */}

        <Calendar summaryMap={MOCK_SUMMARY} />
      </div>
    </section>
  );
}

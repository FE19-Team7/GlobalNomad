"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import FilterButton from "@/src/components/Button/FilterButton";
import ReservationList from "@/src/features/mypage/reservations/components/ReservationList";
import { ReservationStatus } from "@/src/components/Card/StatusBadge";
import { generateMockReservations } from "@/src/features/mypage/reservations/mocks/MockReservation";
import ReservationEmpty from "@/src/features/mypage/reservations/components/ReservationEmpty";

const PAGE_SIZE = 10;

type FilterType = ReservationStatus | null;

const FILTER_OPTIONS: {
  label: string;
  value: ReservationStatus;
}[] = [
  { label: "예약 신청", value: "pending" },
  { label: "예약 취소", value: "canceled" },
  { label: "예약 승인", value: "confirmed" },
  { label: "예약 거절", value: "declined" },
  { label: "체험 완료", value: "completed" },
];

export default function PageClient() {
  const searchParams = useSearchParams();
  const isEmptyTest = searchParams.get("empty") === "true";

  const ALL_ITEMS = useMemo(
    () => (isEmptyTest ? [] : generateMockReservations(80)),
    [isEmptyTest]
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [filter, setFilter] = useState<FilterType>(null);
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(() => {
    if (filter === null) return ALL_ITEMS;
    return ALL_ITEMS.filter((item) => item.status === filter);
  }, [filter, ALL_ITEMS]);

  const items = filteredItems.slice(0, page * PAGE_SIZE);
  const hasNext = items.length < filteredItems.length;

  const handleFilterClick = (value: ReservationStatus) => {
    setFilter((prev) => (prev === value ? null : value));
    setPage(1);
    scrollContainerRef.current?.scrollTo({ top: 0 });
  };

  return (
    <section ref={scrollContainerRef} className="flex flex-col gap-6">
      {/* 상단 텍스트 영역 (항상 유지) */}
      <div>
        <h1 className="text-xl font-bold">예약 내역</h1>
        <p className="text-sm text-gray-500">
          예약 내역 변경 및 취소할 수 있습니다.
        </p>
      </div>

      {/* 전체 예약 Empty */}
      {ALL_ITEMS.length === 0 ? (
        <ReservationEmpty />
      ) : (
        <>
          {/* 필터 버튼 */}
          <div className="flex gap-2 flex-wrap">
            {FILTER_OPTIONS.map(({ label, value }) => (
              <FilterButton
                key={value}
                label={label}
                selected={filter === value}
                onClick={() => handleFilterClick(value)}
              />
            ))}
          </div>

          {/* 리스트 / 필터 결과 Empty */}
          {items.length === 0 ? (
            <div className="py-16 text-sm text-gray-500 text-center">
              해당 조건의 예약 내역이 없습니다.
            </div>
          ) : (
            <ReservationList
              items={items}
              hasNext={hasNext}
              onLoadMore={() => setPage((prev) => prev + 1)}
              scrollContainerRef={scrollContainerRef}
            />
          )}
        </>
      )}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import FilterButton from "@/src/components/Button/FilterButton";
import ReservationList from "@/src/features/mypage/reservations/components/ReservationList";
import ReservationEmpty from "@/src/features/mypage/reservations/components/ReservationEmpty";
import {
  Reservation,
  ReservationResponse,
  ReservationStatus,
} from "@/src/features/mypage/reservations/type";

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
  const [items, setItems] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<FilterType>(null);
  const [cursorId, setCursorId] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  /**
   * 예약 목록 요청
   * - reset: 필터 변경 / 최초 로딩 여부
   * - retried: refresh 후 재시도 여부 (무한 루프 방지)
   */
  const requestReservations = async (
    params: URLSearchParams,
    reset: boolean,
    retried = false
  ) => {
    const res = await fetch(`/api/my-reservations?${params.toString()}`, {
      credentials: "include",
    });

    if (res.status === 401 && !retried) {
      const refreshRes = await fetch("/api/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        return requestReservations(params, reset, true);
      }

      setItems([]);
      setHasNext(false);
      setInitialized(true);
      return;
    }

    if (!res.ok) {
      setHasNext(false);
      setInitialized(true);
      return;
    }

    const data: ReservationResponse = await res.json();

    setItems((prev) =>
      reset ? data.reservations : [...prev, ...data.reservations]
    );
    setCursorId(data.cursorId);
    setHasNext(data.cursorId !== null);
    setInitialized(true);
  };

  /**
   * 최초 로딩 & 필터 변경
   */
  useEffect(() => {
    let cancelled = false;

    const fetchOnFilterChange = async () => {
      if (cancelled) return;

      setLoading(true);
      setItems([]);
      setCursorId(null);
      setHasNext(true);

      const params = new URLSearchParams({
        size: String(PAGE_SIZE),
        ...(filter && { status: filter }),
      });

      try {
        await requestReservations(params, true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOnFilterChange();

    return () => {
      cancelled = true;
    };
  }, [filter]);

  /**
   * 무한 스크롤 추가 로딩
   */
  const fetchMore = async () => {
    if (loading || !hasNext) return;

    setLoading(true);

    const params = new URLSearchParams({
      size: String(PAGE_SIZE),
      ...(filter && { status: filter }),
      ...(cursorId && { cursorId: String(cursorId) }),
    });

    try {
      await requestReservations(params, false);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (value: ReservationStatus) => {
    setFilter((prev) => (prev === value ? null : value));
  };

  return (
    <section className="flex flex-col gap-6">
      {/* 상단 텍스트 영역 (항상 유지) */}
      <div>
        <h1 className="text-xl font-bold">예약 내역</h1>
        <p className="text-sm text-gray-500">
          예약 내역 변경 및 취소할 수 있습니다.
        </p>
      </div>

      {/* 전체 예약 Empty */}
      {initialized && items.length === 0 && !filter ? (
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
              onLoadMore={fetchMore}
            />
          )}
        </>
      )}
    </section>
  );
}

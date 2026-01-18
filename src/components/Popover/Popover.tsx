"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import StatusBadge from "@/src/components/Card/StatusBadge";
import DeleteIcon from "@/src/assets/icon_delete.svg";
import ReservationsTimeDropdown from "@/src/components/Dropdown/ReservationsTimeDropdown";
import { Reservation } from "@/src/features/mypage/reservation-status/type";

export type TabKey = "requested" | "approved" | "declined";

export interface TimeOption {
  id: number;
  startTime: string;
  endTime: string;
  fullTime: string;
}

interface ReservationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  dateLabel: string;
  anchorEl: HTMLElement;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  timeOptions: TimeOption[];
  selectedTimeId: number;
  onTimeChange: (scheduleId: number) => void;
  reservations: Reservation[];
  loading?: boolean;
  onApprove: (id: number) => void;
  onDecline: (id: number) => void;
}

const TAB_LABEL: Record<TabKey, string> = {
  requested: "신청",
  approved: "승인",
  declined: "거절",
};

export default function ReservationPopover({
  isOpen,
  onClose,
  dateLabel,
  anchorEl,
  activeTab,
  onTabChange,
  timeOptions,
  selectedTimeId,
  onTimeChange,
  reservations,
  loading = false,
  onApprove,
  onDecline,
}: ReservationPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  /* ======================
   * 예약 목록 필터링
   ====================== */
  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      if (selectedTimeId && r.scheduleId !== selectedTimeId) return false;

      if (activeTab === "requested") return r.status === "pending";
      if (activeTab === "approved") return r.status === "confirmed";
      if (activeTab === "declined") return r.status === "declined";
      return false;
    });
  }, [reservations, selectedTimeId, activeTab]);

  /* ======================
   * 팝오버 위치 계산 (DOM 직접 제어)
   ====================== */
  useLayoutEffect(() => {
    if (!isOpen || !anchorEl || !popoverRef.current) return;

    const margin = 12;
    const gap = 8;
    const rect = anchorEl.getBoundingClientRect();
    const el = popoverRef.current;
    const popoverHeight = el.offsetHeight;
    const popoverWidth = el.offsetWidth;

    let top = rect.bottom + margin;
    let left = rect.right + gap;

    if (top + popoverHeight > window.innerHeight - margin) {
      top = rect.top - popoverHeight - margin;
    }

    if (top < margin) top = margin;

    if (left + popoverWidth > window.innerWidth - margin) {
      left = window.innerWidth - popoverWidth - margin;
    }

    if (left < margin) left = margin;

    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
  }, [isOpen, anchorEl, activeTab, selectedTimeId, filtered.length]);

  if (!isOpen) return null;

  return (
    <aside
      ref={popoverRef}
      style={{ position: "fixed", zIndex: 9999 }}
      className="w-85 rounded-xl bg-white shadow-lg max-h-[70vh] overflow-y-auto"
    >
      <div className="flex flex-col p-6 gap-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{dateLabel}</h2>
          <button
            aria-label="닫기"
            onClick={onClose}
            className="flex items-center justify-center"
          >
            <DeleteIcon />
          </button>
        </header>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-100 text-sm">
          {(Object.keys(TAB_LABEL) as TabKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-primary-500 text-primary-500 font-semibold"
                  : "text-gray-400"
              }`}
            >
              {TAB_LABEL[tab]}
            </button>
          ))}
        </div>

        {/* 예약 시간 */}
        <section>
          <h3 className="text-m font-bold mb-2">예약 시간</h3>
          <ReservationsTimeDropdown
            times={timeOptions}
            value={selectedTimeId}
            onChange={onTimeChange}
          />
        </section>

        {/* 예약 내역 */}
        <section className="flex flex-col gap-3">
          <h3 className="text-m font-bold mb-2">예약 내역</h3>

          {loading && <p className="text-sm text-gray-400">불러오는 중…</p>}

          {!loading && filtered.length === 0 && (
            <p className="text-sm text-gray-400">예약 내역이 없습니다.</p>
          )}

          {!loading &&
            filtered.map((r) => (
              <div
                key={r.id}
                className="flex justify-between items-center border border-gray-100 rounded-xl p-3"
              >
                <div>
                  <p className="text-sm">
                    <span className="text-gray-500 font-bold">닉네임 </span>
                    <span className="text-black">{r.nickname}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500 font-bold">인원 </span>
                    <span className="text-black">{r.headCount}명</span>
                  </p>
                </div>

                {activeTab === "requested" ? (
                  <div className="flex flex-col text-sm gap-1">
                    <button
                      onClick={() => onApprove(r.id)}
                      className="px-3 py-1 rounded-full bg-white border border-gray-50 text-gray-600 text-xs font-semibold"
                    >
                      승인하기
                    </button>

                    <button
                      onClick={() => onDecline(r.id)}
                      className="px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-semibold"
                    >
                      거절하기
                    </button>
                  </div>
                ) : (
                  <StatusBadge status={r.status} />
                )}
              </div>
            ))}
        </section>
      </div>
    </aside>
  );
}

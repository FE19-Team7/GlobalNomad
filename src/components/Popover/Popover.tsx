"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import StatusBadge from "@/src/components/StatusBadge/StatusBadge";
import DeleteIcon from "@/src/assets/icon_delete.svg";

type TabKey = "requested" | "approved" | "declined";

interface Reservation {
  id: number;
  name: string;
  people: number;
  time: string;
  status?: "pending" | "declined";
}

interface ReservationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  dateLabel: string;
  anchorRef: RefObject<HTMLElement | null>;
}

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 1,
    name: "정만철",
    people: 10,
    time: "14:00 - 15:00",
  },
  {
    id: 2,
    name: "정만철",
    people: 12,
    time: "14:00 - 15:00",
  },
];

const TAB_LABEL: Record<TabKey, string> = {
  requested: "신청",
  approved: "승인",
  declined: "거절",
};

export default function ReservationPopover({
  isOpen,
  onClose,
  dateLabel,
  anchorRef,
}: ReservationPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const [activeTab, setActiveTab] = useState<TabKey>("requested");
  const [reservations, setReservations] =
    useState<Reservation[]>(INITIAL_RESERVATIONS);

  const timeOptions = Array.from(new Set(reservations.map((r) => r.time)));

  const [selectedTime, setSelectedTime] = useState(timeOptions[0] ?? "");

  useEffect(() => {
    if (!isOpen || !anchorRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    setStyle({
      position: "fixed",
      top: rect.top,
      left: rect.right + 8,
      zIndex: 50,
    });
  }, [isOpen, anchorRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const approve = (id: number) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "pending" } : r))
    );
    setActiveTab("approved");
  };

  const decline = (id: number) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "declined" } : r))
    );
    setActiveTab("declined");
  };

  const filtered = reservations.filter((r) => {
    if (r.time !== selectedTime) return false;

    if (activeTab === "requested") return r.status === undefined;
    if (activeTab === "approved") return r.status === "pending";
    if (activeTab === "declined") return r.status === "declined";
  });

  return (
    <aside
      ref={popoverRef}
      style={style}
      className="w-85 rounded-xl bg-white shadow-lg"
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
              onClick={() => setActiveTab(tab)}
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
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full rounded-lg border border-gray-100 px-3 py-2 text-sm"
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </section>

        {/* 예약 내역 */}
        <section className="flex flex-col gap-3">
          <h3 className="text-m font-bold mb-2">예약 내역</h3>
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400">예약 내역이 없습니다.</p>
          )}

          {filtered.map((r) => (
            <div
              key={r.id}
              className="flex justify-between items-center border border-gray-100 rounded-xl p-3"
            >
              <div>
                <p className="text-sm">
                  <span className="text-gray-500 font-bold">닉네임 </span>
                  <span className="text-black">{r.name}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500 font-bold">인원 </span>
                  <span className="text-black">{r.people}명</span>
                </p>
              </div>

              {activeTab === "requested" ? (
                <div className="flex flex-col text-sm gap-1">
                  <button
                    onClick={() => approve(r.id)}
                    className="px-3 py-1 rounded-full bg-white border border-gray-50 text-gray-600 text-xs font-semibold"
                  >
                    승인하기
                  </button>

                  <button
                    onClick={() => decline(r.id)}
                    className=" px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-semibold"
                  >
                    거절하기
                  </button>
                </div>
              ) : (
                <StatusBadge status={r.status!} />
              )}
            </div>
          ))}
        </section>
      </div>
    </aside>
  );
}

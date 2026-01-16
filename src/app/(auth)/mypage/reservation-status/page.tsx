"use client";

import { useMemo, useState } from "react";
import ReservationsDropdown from "@/src/components/Dropdown/ReservationsDropdown";
import Calendar from "@/src/components/Calendar/Calendar";
import ReservationPopover, {
  TabKey,
  TimeOption,
} from "@/src/components/Popover/Popover";

import { useReservationOptions } from "@/src/features/mypage/reservation-status/hooks/useReservationOptions";
import { useReservationDashboard } from "@/src/features/mypage/reservation-status/hooks/useReservationDashboard";
import { useReservedSchedule } from "@/src/features/mypage/reservation-status/hooks/useReservationSchedule";
import { useReservations } from "@/src/features/mypage/reservation-status/hooks/useReservations";

import { ReservationStatus } from "@/src/features/mypage/reservation-status/type";

interface PopoverInfo {
  dateLabel: string;
  anchorEl: HTMLElement;
}

export default function Page() {
  const [selectedActivityId, setSelectedActivityId] = useState<number>();
  const [popoverInfo, setPopoverInfo] = useState<PopoverInfo | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("requested");

  const [userSelectedScheduleId, setUserSelectedScheduleId] = useState<
    number | null
  >(null);

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const { items } = useReservationOptions();

  const { summaryMap, refetch: refetchDashboard } = useReservationDashboard(
    selectedActivityId,
    year,
    month
  );

  const {
    schedules,
    loading: scheduleLoading,
    error: scheduleError,
  } = useReservedSchedule(selectedActivityId, popoverInfo?.dateLabel);

  const timeOptions: TimeOption[] = useMemo(() => {
    return schedules.map((s) => ({
      id: s.scheduleId,
      startTime: s.startTime,
      endTime: s.endTime,
      fullTime: `${s.startTime} - ${s.endTime}`,
    }));
  }, [schedules]);

  const selectedScheduleId = useMemo(() => {
    if (userSelectedScheduleId !== null) return userSelectedScheduleId;
    if (timeOptions.length === 0) return undefined;
    return timeOptions[0].id;
  }, [userSelectedScheduleId, timeOptions]);

  const reservationStatus: ReservationStatus | undefined = useMemo(() => {
    switch (activeTab) {
      case "requested":
        return "pending";
      case "approved":
        return "confirmed";
      case "declined":
        return "declined";
      default:
        return undefined;
    }
  }, [activeTab]);

  const {
    reservations,
    loading: reservationsLoading,
    error: reservationsError,
    refetch,
  } = useReservations({
    activityId: selectedActivityId,
    scheduleId: selectedScheduleId,
    status: reservationStatus,
  });

  const updateReservationStatus = async (
    reservationId: number,
    status: ReservationStatus
  ) => {
    if (!selectedActivityId) return;

    const res = await fetch(
      `/api/my-activities/${selectedActivityId}/reservations/${reservationId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    refetch();
    refetchDashboard();
  };

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
            value={selectedActivityId?.toString()}
            onChange={(value) => {
              setSelectedActivityId(Number(value));
              setPopoverInfo(null);
              setUserSelectedScheduleId(null);
            }}
          />
        </div>

        {/* 캘린더 */}
        <Calendar
          summaryMap={summaryMap}
          onBadgeClick={({ dateKey, anchorEl }) => {
            setPopoverInfo({ dateLabel: dateKey, anchorEl });
            setActiveTab("requested");
            setUserSelectedScheduleId(null);
          }}
        />

        {popoverInfo && selectedActivityId && (
          <ReservationPopover
            isOpen
            onClose={() => setPopoverInfo(null)}
            dateLabel={popoverInfo.dateLabel}
            anchorEl={popoverInfo.anchorEl}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            timeOptions={timeOptions}
            selectedTimeId={selectedScheduleId ?? 0}
            onTimeChange={setUserSelectedScheduleId}
            reservations={reservations}
            loading={reservationsLoading}
            onApprove={(id) => updateReservationStatus(id, "confirmed")}
            onDecline={(id) => updateReservationStatus(id, "declined")}
          />
        )}

        {(scheduleError || reservationsError) && (
          <p className="text-red-500 text-center">
            {scheduleError || reservationsError}
          </p>
        )}
      </div>
    </section>
  );
}

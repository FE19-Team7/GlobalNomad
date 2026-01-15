import { EventBadge, EventStatus } from "./EventBadge";

interface DaySummary {
  reserved: number;
  approved: number;
  completed: number;
}

interface CalendarDayCellProps {
  day: number;
  summary: DaySummary;
  className?: string;
  isOutsideMonth?: boolean;
  onBadgeClick?: (payload: {
    status: EventStatus;
    anchorEl: HTMLElement;
  }) => void;
}

const TRACKING_FIELDS: (keyof DaySummary)[] = [
  "reserved",
  "approved",
  "completed",
];

export const CalendarDayCell = ({
  day,
  summary,
  className = "",
  isOutsideMonth = false,
  onBadgeClick,
}: CalendarDayCellProps) => {
  // 뱃지가 하나라도 있을 경우 알림 빨간 점 표시
  const hasEvent = TRACKING_FIELDS.some((field) => summary[field] > 0);

  return (
    <div
      className={`flex flex-col gap-[5px] 
        px-3 pt-[18px] pb-[10px] 
        bg-white  
        ${className}`}
    >
      {/* 날짜 + 뱃지가 있을 시 알림 빨간 점 */}
      <div className="relative flex items-center justify-center">
        <span
          className={`
    text-body-lg
    ${isOutsideMonth ? "text-gray-300" : "text-gray-800"}
  `}
        >
          {day}
        </span>

        {hasEvent && (
          <span className="absolute top-0 right-3 w-[6px] h-[6px] rounded-full bg-red-500" />
        )}
      </div>

      {/* 뱃지 */}
      {summary.reserved > 0 && (
        <EventBadge
          status="RESERVED"
          count={summary.reserved}
          onClick={(e) =>
            onBadgeClick?.({
              status: "RESERVED",
              anchorEl: e.currentTarget,
            })
          }
        />
      )}

      {summary.approved > 0 && (
        <EventBadge
          status="APPROVED"
          count={summary.approved}
          onClick={(e) =>
            onBadgeClick?.({
              status: "APPROVED",
              anchorEl: e.currentTarget,
            })
          }
        />
      )}

      {summary.completed > 0 && (
        <EventBadge
          status="COMPLETED"
          count={summary.completed}
          onClick={(e) =>
            onBadgeClick?.({
              status: "COMPLETED",
              anchorEl: e.currentTarget,
            })
          }
        />
      )}
    </div>
  );
};

import { EventBadge } from "./EventBadge";

interface DaySummary {
    reserved: number;
    approved: number;
    completed: number;
}

interface CalendarDayCellProps {
    day: number;
    summary: DaySummary;
    className?: string;
}

export const CalendarDayCell = ({
    day,
    summary,
    className = '',
}: CalendarDayCellProps) => {
    // 뱃지가 하나라도 있을 경우 알림 빨간 점 표시
    const hasEvent =
        summary.reserved > 0 ||
        summary.approved > 0 ||
        summary.completed > 0;

    return (
        <div className={`flex flex-col gap-[5px] 
                        px-3 pt-[18px] pb-[10px] 
                        bg-white border border-gray-50
                        ${className}`}>

            {/* 날짜 + 뱃지가 있을 시 알림 빨간 점 */}
            <div className="relative flex items-center justify-center">
                <span className="text-gray-800 text-body-lg">
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
                />
            )}

            {summary.approved > 0 && (
                <EventBadge
                    status="APPROVED"
                    count={summary.approved}
                />
            )}

            {summary.completed > 0 && (
                <EventBadge
                    status="COMPLETED"
                    count={summary.completed}
                />
            )}
        </div>
    )
}
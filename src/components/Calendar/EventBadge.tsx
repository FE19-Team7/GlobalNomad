export type EventStatus = 'RESERVED' | 'APPROVED' | 'COMPLETED';

interface EventBadgeProps {
    status: EventStatus;
    count: number;
}

const BADGE_STYLE = {
    RESERVED: {
        label: '예약',
        bg: 'bg-primary-100',
        text: 'text-primary-500',
    },
    APPROVED: {
        label: '승인',
        bg: 'bg-[#FFF8DD]',
        text: 'text-[#FFB051]',
    },
    COMPLETED: {
        label: '완료',
        bg: 'bg-gray-50',
        text: 'text-gray-500',
    },
} as const;

export const EventBadge = ({ status, count }: EventBadgeProps) => {
    const { label, bg, text } = BADGE_STYLE[status];

    return (
        <div className={`inline-flex items-center justify-center px-2 py-0.5 gap-0.5 text-body rounded-[4px] ${bg} ${text}`}>
            {label} {count}
        </div>
    );
};
export type ReservationStatus = 'pending' | 'confirmed' | 'canceled' | 'declined' | 'completed';

type StatusConfig = {
  label: string;
  bgColor: string;
  textColor: string;
};

const STATUS_CONFIG = {
  pending: {
    label: '예약 승인',
    bgColor: 'bg-sky-100',
    textColor: 'text-cyan-600',
  },
  confirmed: {
    label: '예약 완료',
    bgColor: 'bg-green-100',
    textColor: 'text-lime-700',
  },
  canceled: {
    label: '예약 취소',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
  },
  declined: {
    label: '예약 거절',
    bgColor: 'bg-rose-50',
    textColor: 'text-red-400',
  },
  completed: {
    label: '체험 완료',
    bgColor: 'bg-blue-100',
    textColor: 'text-sky-600',
  }
} as const satisfies Record<ReservationStatus, StatusConfig>;

interface StatusBadgeProps { status: ReservationStatus; }

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className={`inline-flex items-center justify-center px-2 py-1 gap-2 rounded-full ${config.bgColor}`}>
      <span className={`${config.textColor} text-xs font-bold`}>{config.label}</span>
    </div>
  );
}

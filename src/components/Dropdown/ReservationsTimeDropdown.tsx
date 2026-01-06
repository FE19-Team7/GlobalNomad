'use client'

import Dropdown, { DropdownItem } from '@/src/components/Dropdown/Base/Dropdown'

interface TimeOption {
    id: number;
    startTime: string;
    endTime: string;
}

interface ReservationsTimeDropdownProps {
    times: TimeOption[];
    value?: number;
    onChange: (id: number) => void;
    disabled?: boolean;
    className?: string;
}

export default function ReservationsTimeDropdown({
    times,
    value,
    onChange,
    disabled = false,
    className = '',
}: ReservationsTimeDropdownProps) {

    const items: DropdownItem[] = times.map((time) => ({
        type: 'option',
        label: `${time.startTime} - ${time.endTime}`,
        value: String(time.id),
    }));

    return (
        <Dropdown
            placeholder="예약 시간 선택"
            items={items}
            value={value !== undefined ? String(value) : undefined}
            onChange={(v) => onChange(Number(v))}
            disabled={disabled || items.length === 0}
            fullWidth
            showArrow
            className={className}
            buttonClassName="h-[54px] px-4 rounded-[12px] border border-gray-100 bg-white"
            menuClassName="mt-0.5 w-full rounded-[12px] border border-gray-100 overflow-hidden"
            itemClassName="h-[48px] text-left"
        />
    )
}
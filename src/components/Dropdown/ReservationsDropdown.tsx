'use client';

import Dropdown from '@/src/components/Dropdown/Base/Dropdown';

export type ReservationItem = {
  label: string;
  value: string;
  reservedAt: string;
};

type ReservationsDropdownProps = {
  items: ReservationItem[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function ReservationsDropdown({
  items,
  value,
  onChange,
  className = '',
}: ReservationsDropdownProps) {
  return (
    <Dropdown
      placeholder="체험을 선택해 주세요"
      items={items}
      value={value}
      onChange={onChange}
      fullWidth
      className={`border border-gray-100 rounded-[16px] ${className}`}
      menuClassName="w-full mt-0.5 top-full"
      itemClassName="text-left"
      buttonClassName="p-[10px]"
    />
  );
}

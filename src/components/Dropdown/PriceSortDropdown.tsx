'use client';

import Dropdown, { DropdownItem } from "@/src/components/Dropdown/Dropdown";

export type PriceSortValue = 'price_asc' | 'price_desc';

type PriceSortDropdownProps = {
    value: PriceSortValue;
    onChange: (value: PriceSortValue) => void;
    className?: string;
};

export default function PriceSortDropdown({
    value,
    onChange,
    className = '',
}: PriceSortDropdownProps) {
    const items: DropdownItem[] = [
        { label: '낮은 순', value: 'price_asc' },
        { label: '높은 순', value: 'price_desc' },
    ];

    return (
        <Dropdown
            label="가격 정렬"
            items={items}
            value={value}
            onChange={(v) => onChange(v as PriceSortValue)}
            className={`w-fit [&>button>span]:hover:text-gray-700 ${className}`}
            renderLabel={() => '가격'}
            fullWidth={false}
            align="center"
            menuClassName="min-w-[80px]"
            buttonClassName="p-[10px]"
        />
    );
}
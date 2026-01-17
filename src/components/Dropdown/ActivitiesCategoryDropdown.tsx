'use client';

import Dropdown, { DropdownItem } from '@/src/components/Dropdown/base/Dropdown';

export type ActivityCategory =
    | 'culture'
    | 'food'
    | 'sports'
    | 'tour'
    | 'sightseeing'
    | 'wellbeing';

type ActivitiesCategoryDropdownProps = {
    value?: ActivityCategory;
    onChange: (value: ActivityCategory) => void;
    className?: string;
    error?: boolean;
};

const CATEGORY_ITEMS: DropdownItem[] = [
    { label: '문화 예술', value: 'culture' },
    { label: '식음료', value: 'food' },
    { label: '스포츠', value: 'sports' },
    { label: '투어', value: 'tour' },
    { label: '관광', value: 'sightseeing' },
    { label: '웰빙', value: 'wellbeing' },
];

export default function ActivitiesCategoryDropdown({
    value,
    onChange,
    className = '',
    error = false,
}: ActivitiesCategoryDropdownProps) {
    return (
        <Dropdown
            placeholder="카테고리를 선택해 주세요"
            items={CATEGORY_ITEMS}
            value={value}
            onChange={(v) => onChange(v as ActivityCategory)}
            fullWidth
            className={`min-h-[54px] rounded-[16px] border ${error ? 'border-red-500' : 'border-gray-100'} ${className}`}
            buttonClassName="flex items-center px-5 w-full min-h-[54px] p-[10px] rounded-[16px]"
            menuClassName="w-full mt-3 rounded-[8px] p-2"
            itemClassName="text-left rounded-[12px]"
        />
    );
}

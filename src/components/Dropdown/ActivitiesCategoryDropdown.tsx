'use client';

import Dropdown, { DropdownItem } from '@/src/components/Dropdown/Dropdown';

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
}: ActivitiesCategoryDropdownProps) {
    return (
        <Dropdown
            placeholder="카테고리를 선택해 주세요"
            items={CATEGORY_ITEMS}
            value={value}
            onChange={(v) => onChange(v as ActivityCategory)}
            fullWidth
            className={`border border-gray-100 rounded-[16px] ${className}`}
            buttonClassName="p-[10px]"
            menuClassName="w-full mt-0.5 top-full"
            itemClassName="text-left"
        />
    );
}

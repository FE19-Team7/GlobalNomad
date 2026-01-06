'use client';

import Dropdown, { DropdownItem } from '@/src/components/Dropdown/base/Dropdown';

type UserMenuDropDownProps = {
    userName: string;
    onLogout: () => void;
    className?: string;
};

export default function UserMenuDropDownProps({
    userName,
    onLogout,
    className = '',
}: UserMenuDropDownProps) {
    const items: DropdownItem[] = [
        {
            type: 'link',
            label: '마이페이지',
            href: '/mypage',
        },
        {
            type: 'action',
            label: '로그아웃',
            onSelect: onLogout,
        },
    ];

    return (
        <Dropdown
            label={userName}
            items={items}
            align="center"
            showArrow={false}
            fullWidth={false}
            className={`[&>button>span]:hover:text-gray-700 ${className}`}
            menuClassName="min-w-[100px] mt-1"
        />
    );
}

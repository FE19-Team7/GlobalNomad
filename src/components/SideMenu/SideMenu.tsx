'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import DefaultProfile from '@/assets/default profile-lg.svg'
import EditButtonIcon from '@/assets/edit_button.svg'

import IconUser from '@/assets/icon_user.svg'
import IconList from '@/assets/icon_list.svg'
import IconSetting from '@/assets/icon_setting.svg'
import IconCalendar from '@/assets/icon_calendar.svg'

type SideMenuProps = {
    className?: string
    profileImageUrl?: string | null
    onProfileEdit?: () => void
}

export default function SideMenu({
    className,
    profileImageUrl,
    onProfileEdit,
}: SideMenuProps) {
    const pathname = usePathname()

    // active 분기
    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + '/')

    // 메뉴 아이템 스타일
    const menuItemClass = (active: boolean) =>
        `flex items-center gap-3 h-[54px] px-4 transition-colors rounded-[16px] text-body-lg
    ${active
            ? 'bg-primary-100 text-gray-950'
            : 'text-primary-600'
        }`

    const iconClass = (active: boolean) =>
        `w-6 h-6 ${active ? 'text-primary-500' : 'text-gray-600'}`

    return (
        <div
            className={`flex flex-col gap-6 px-[14px] py-6 border border-gray-50 bg-white rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.05)]
            ${className ?? ''}`}
        >

            {/* 프로필 영역 */}
            <div className="flex justify-center">
                <div className="relative w-[120px] h-[120px] bg-primary-100 rounded-full flex items-center justify-center">
                    {/* 유저 프로필 이미지가 있을 때 */}
                    {profileImageUrl ? (
                        <img
                            src={profileImageUrl}
                            alt="프로필 이미지"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        /* 없을 때 기본 프로필 */
                        <div className="flex items-center justify-center">
                            <DefaultProfile className="w-full h-full object-contain" />
                        </div>
                    )}
                    {/* 프로필 편집 버튼 */}
                    <button
                        type="button"
                        aria-label="프로필 이미지 변경"
                        onClick={onProfileEdit}
                        className="absolute bottom-2 right-2 w-[30px] h-[30px] cursor-pointer">
                        <EditButtonIcon className="w-full h-full" />
                    </button>
                </div>
            </div>

            {/* 메뉴 영역 */}
            <nav className="flex flex-col gap-[14px]">

                {/* 내 정보 */}
                <Link
                    href="/mypage"
                    className={menuItemClass(isActive('/mypage'))}>
                    <IconUser className={iconClass(isActive('/mypage'))} />
                    <span className="text-body-lg">
                        내 정보
                    </span>
                </Link>

                {/* 예약내역 */}
                <Link
                    href="/mypage/reservations"
                    className={menuItemClass(isActive('/mypage/reservations'))}>
                    <IconList className={iconClass(isActive('/mypage/reservations'))} />
                    <span className="text-body-lg">
                        예약내역
                    </span>
                </Link>

                {/* 내 체험 관리 */}
                <Link
                    href="/mypage/activities"
                    className={menuItemClass(isActive('/mypage/activities'))}>
                    <IconSetting className={iconClass(isActive('/mypage/activities'))} />
                    <span className="text-body-lg">
                        내 체험 관리
                    </span>
                </Link>

                {/* 예약 현황 */}
                <Link
                    href="/mypage/reservation-status"
                    className={menuItemClass(isActive('/mypage/reservation-status'))}>
                    <IconCalendar className={iconClass(isActive('/mypage/reservation-status'))} />
                    <span className="text-body-lg">
                        예약 현황
                    </span>
                </Link>

            </nav>
        </div>
    )
}
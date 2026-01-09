"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

import DefaultProfile from "@/assets/default profile-lg.svg";
import EditButtonIcon from "@/assets/edit_button.svg";

import IconUser from "@/assets/icon_user.svg";
import IconList from "@/assets/icon_list.svg";
import IconSetting from "@/assets/icon_setting.svg";
import IconCalendar from "@/assets/icon_calendar.svg";

type SideMenuProps = {
  className?: string;
  profileImageUrl?: string | null;
  onProfileEdit?: () => void;
  onMenuClick?: () => void;
  showMobileContent?: boolean;
};

export default function SideMenu({
  className,
  profileImageUrl,
  onProfileEdit,
  onMenuClick,
  showMobileContent = true,
}: SideMenuProps) {
  const pathname = usePathname();

  // 메뉴 아이템 스타일
  const menuItemClass = (active: boolean) => {
    // 모바일에선 showMobileContent에 따라 active 제어
    const isActiveOnMobile = showMobileContent ? active : false;

    return `flex items-center gap-3 h-[54px] px-4 transition-colors rounded-[16px] text-body-lg
    ${isActiveOnMobile ? "bg-primary-100 text-gray-950" : "text-primary-600"}
    ${
      active // 태블릿/데스크톱에서 항상 active
        ? "md:bg-primary-100 md:text-gray-950"
        : "md:text-primary-600"
    }`;
  };

  const iconClass = (active: boolean) => {
    const isActiveOnMobile = showMobileContent ? active : false;
    return `w-6 h-6 flex-shrink-0 
        ${isActiveOnMobile ? "text-primary-500" : "text-gray-600"}
        ${active ? "md:text-primary-500" : "md:text-gray-600"}`;
  };

  return (
    <div
      className={`flex flex-col gap-6 px-[14px] py-6 border border-gray-50 bg-white rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.05)] md:scale-[0.685] md:origin-top-left lg:scale-100
            ${className ?? ""}`}
    >
      {/* 프로필 영역 */}
      <div className="flex justify-center">
        <div className="relative w-[120px] h-[120px] bg-primary-100 rounded-full flex items-center justify-center overflow-visible">
          {/* 유저 프로필 이미지가 있을 때 */}
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt="프로필 이미지"
              fill
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            /* 없을 때 기본 프로필 */
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[100%] h-[100%]">
                <DefaultProfile className="w-full h-full" />
              </div>
            </div>
          )}
          {/* 프로필 편집 버튼 */}
          <button
            type="button"
            aria-label="프로필 이미지 변경"
            onClick={onProfileEdit}
            className="absolute bottom-0 right-0 w-[32px] h-[32px] cursor-pointer"
          >
            <EditButtonIcon className="w-full h-full" />
          </button>
        </div>
      </div>

      {/* 메뉴 영역 */}
      <nav className="flex flex-col gap-[14px]">
        {/* 내 정보 */}
        <Link
          href="/mypage/my-profile"
          onClick={onMenuClick}
          className={menuItemClass(pathname === "/mypage/my-profile")}
        >
          <IconUser className={iconClass(pathname === "/mypage/my-profile")} />
          <span className="text-body-lg md:text-lg lg:text-body-lg">
            내 정보
          </span>
        </Link>

        {/* 예약내역 */}
        <Link
          href="/mypage/reservations"
          onClick={onMenuClick}
          className={menuItemClass(pathname === "/mypage/reservations")}
        >
          <IconList
            className={iconClass(pathname === "/mypage/reservations")}
          />
          <span className="text-body-lg md:text-lg lg:text-body-lg">
            예약내역
          </span>
        </Link>

        {/* 내 체험 관리 */}
        <Link
          href="/mypage/activities"
          onClick={onMenuClick}
          className={menuItemClass(pathname === "/mypage/activities")}
        >
          <IconSetting
            className={iconClass(pathname === "/mypage/activities")}
          />
          <span className="text-body-lg md:text-lg lg:text-body-lg">
            내 체험 관리
          </span>
        </Link>

        {/* 예약 현황 */}
        <Link
          href="/mypage/reservation-status"
          onClick={onMenuClick}
          className={menuItemClass(pathname === "/mypage/reservation-status")}
        >
          <IconCalendar
            className={iconClass(pathname === "/mypage/reservation-status")}
          />
          <span className="text-body-lg md:text-lg lg:text-body-lg">
            예약 현황
          </span>
        </Link>
      </nav>
    </div>
  );
}

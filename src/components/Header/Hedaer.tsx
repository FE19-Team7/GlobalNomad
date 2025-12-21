import HeaderLayout from "./HeaderLayout";
import Logo from "@/assets/Logo.svg";
import BellIcon from "@/assets/icon_bell.svg";
import DefaultProfile from "@/assets/default profile.svg";

type HeaderProps = {
  isLoggedIn?: boolean;
};

export default function Header({ isLoggedIn = false }: HeaderProps) {
  return (
    <HeaderLayout>
      <div className="grid w-full grid-cols-2 items-center">
        {/* 왼쪽 */}
        <div className="flex items-center gap-2 justify-start cursor-pointer">
          <Logo />
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex items-center gap-4 justify-end">
          {!isLoggedIn ? (
            <>
              <button className="text-gray-950">로그인</button>
              <button className="text-gray-950">회원가입</button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5 cursor-pointer">
                <BellIcon />
                <div className="h-3.5 w-px bg-gray-100" />
                <DefaultProfile />
                <span className="text-sm text-gray-950">조동현</span>
              </div>
            </>
          )}
        </div>
      </div>
    </HeaderLayout>
  );
}

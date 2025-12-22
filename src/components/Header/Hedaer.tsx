import HeaderLayout from "./HeaderLayout";
import Logo from "@/assets/Logo.svg";
import LoggedInMenu from "./LoggedInMenu";
import LoggedOutMenu from "./LoggedOutMenu";
import Link from "next/link";

type HeaderProps = {
  isLoggedIn?: boolean;
};

export default function Header({ isLoggedIn = false }: HeaderProps) {
  const nickname = "조동현"; // 임시 데이터 -> 추후 로그인 회원가입 연동 시 수정
  return (
    <HeaderLayout>
      <div className="grid w-full grid-cols-2 items-center">
        {/* 왼쪽 */}
        <Link
          href="/"
          className="flex items-center justify-start cursor-pointer"
        >
          <Logo />
        </Link>

        {/* 오른쪽 */}
        <div className="flex justify-end">
          {isLoggedIn ? (
            <LoggedInMenu nickname={nickname} />
          ) : (
            <LoggedOutMenu />
          )}
        </div>
      </div>
    </HeaderLayout>
  );
}

import HeaderLayout from "./HeaderLayout";
import Logo from "@/assets/Logo.svg";
import LoggedInMenu from "./LoggedInMenu";
import LoggedOutMenu from "./LoggedOutMenu";
import Link from "next/link";

type HeaderProps = {
  isLoggedIn?: boolean;
};

export default function Header({ isLoggedIn = false }: HeaderProps) {
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
          {isLoggedIn ? <LoggedInMenu /> : <LoggedOutMenu />}
        </div>
      </div>
    </HeaderLayout>
  );
}

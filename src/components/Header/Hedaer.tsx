import HeaderLayout from "./HeaderLayout";
import Logo from "@/assets/Logo.svg";
import HeaderRight from "./HeaderRight";

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

        {/* 오른쪽 */}
        <div className="flex justify-end">
          <HeaderRight isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </HeaderLayout>
  );
}

import BellIcon from "@/assets/icon_bell.svg";
import DefaultProfile from "@/assets/default profile.svg";

type HeaderRightProps = {
  isLoggedIn: boolean;
};

export default function HeaderRight({ isLoggedIn }: HeaderRightProps) {
  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <button className="text-gray-950">로그인</button>
        <button className="text-gray-950">회원가입</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 cursor-pointer">
      <BellIcon />
      <div className="h-3.5 w-px bg-gray-100" />
      <DefaultProfile />
      <span className="text-sm text-gray-950">조동현</span>
    </div>
  );
}

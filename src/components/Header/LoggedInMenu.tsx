import BellIcon from "@/assets/icon_bell.svg";
import DefaultProfile from "@/assets/default profile.svg";
import Link from "next/link";

type LoggedInMenuProps = {
  nickname: string;
};

export default function LoggedInMenu({ nickname }: LoggedInMenuProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Link
        href="/notifications"
        aria-label="알림"
        className="hover:opacity-70 transition"
      >
        <BellIcon />
      </Link>
      <Link
        href="/mypage"
        aria-label="마이페이지"
        className="flex items-center gap-2 hover:opacity-70 transition"
      >
        <DefaultProfile/>
        <span className="text-sm text-gray-950">{nickname}</span>
      </Link>
    </div>
  );
}

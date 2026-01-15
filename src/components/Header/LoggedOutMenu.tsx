import Link from "next/link";

export default function LoggedOutMenu() {
  return (
    <div className="flex items-center gap-4">
      <Link className="text-gray-950" href="/login">
        로그인
      </Link>
      <Link className="text-gray-950" href="/signup">
        회원가입
      </Link>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import Button from "@/src/components/Button/Button";
import EmptyLogo from "@/src/assets/earth.svg";

export default function ReservationEmpty() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24">
      {/* 로고 */}
      <EmptyLogo width={160} height={160} />

      {/* 텍스트 */}
      <div className="text-center">
        <p className="text-base font-semibold text-gray-900">
          아직 예약한 체험이 없어요
        </p>
      </div>

      {/* 버튼 */}
      <Button size="md" onClick={() => router.push("/")}>
        둘러보기
      </Button>
    </div>
  );
}

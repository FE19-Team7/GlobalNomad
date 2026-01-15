import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ALLOWED_STATUS = ["pending", "confirmed", "declined"] as const;
type AllowedStatus = (typeof ALLOWED_STATUS)[number];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ activityId: string }> }
) {
  const { activityId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);

  const scheduleIdParam = searchParams.get("scheduleId");
  const statusParam = searchParams.get("status");

  if (!scheduleIdParam) {
    return NextResponse.json(
      { message: "scheduleId는 필수입니다." },
      { status: 400 }
    );
  }

  const scheduleId = Number(scheduleIdParam);
  if (Number.isNaN(scheduleId)) {
    return NextResponse.json(
      { message: "scheduleId는 숫자로 입력해주세요." },
      { status: 400 }
    );
  }

  if (!statusParam) {
    return NextResponse.json(
      { message: "status는 필수입니다." },
      { status: 400 }
    );
  }

  const normalizedStatus = statusParam.trim().toLowerCase();

  const isValidStatus = (value: string): value is AllowedStatus => {
    return ALLOWED_STATUS.includes(value as AllowedStatus);
  };

  if (!isValidStatus(normalizedStatus)) {
    return NextResponse.json(
      {
        message:
          "status는 pending, confirmed, declined 중 하나로 입력해주세요.",
      },
      { status: 400 }
    );
  }

  const backendUrl =
    `${process.env.NEXT_PUBLIC_API_URL}` +
    `/my-activities/${activityId}/reservations` +
    `?scheduleId=${scheduleId}&status=${normalizedStatus}`;

  const res = await fetch(backendUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

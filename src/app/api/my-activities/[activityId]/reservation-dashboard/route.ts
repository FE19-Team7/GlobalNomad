import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ activityId: string }> }
) {
  const { activityId } = await context.params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const searchParams = new URL(req.url).searchParams;
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!year || !month) {
    return NextResponse.json(
      { message: "year와 month는 필수입니다." },
      { status: 400 }
    );
  }

  const backendUrl =
    `${process.env.NEXT_PUBLIC_API_URL}` +
    `/my-activities/${activityId}/reservation-dashboard` +
    `?year=${year}&month=${month}`;

  const res = await fetch(backendUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

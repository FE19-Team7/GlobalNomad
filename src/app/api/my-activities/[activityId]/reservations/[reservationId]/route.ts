import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      activityId: string;
      reservationId: string;
    }>;
  }
) {
  const { activityId, reservationId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  let body: { status?: "confirmed" | "declined" };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "요청 본문이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  if (!body.status || !["confirmed", "declined"].includes(body.status)) {
    return NextResponse.json(
      { message: "허용되지 않은 status 값입니다." },
      { status: 400 }
    );
  }

  const backendUrl =
    `${process.env.NEXT_PUBLIC_API_URL}` +
    `/my-activities/${activityId}/reservations/${reservationId}`;

  const res = await fetch(backendUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ status: body.status }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: "예약 상태 변경에 실패했습니다.",
    }));
    return NextResponse.json(error, { status: res.status });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

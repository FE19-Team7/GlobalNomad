import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * PATCH /api/my-reservations/[reservationId]
 * → 예약 취소
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ reservationId: string }> }
) {
  // ✅ App Router에서는 params가 Promise
  const { reservationId } = await context.params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const body = await req.json();

  const res = await fetch(`${API_URL}/my-reservations/${reservationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body), // { status: "canceled" }
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

/**
 * POST /api/my-reservations/[reservationId]
 * → 리뷰 작성
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ reservationId: string }> }
) {
  // ✅ 동일하게 params await
  const { reservationId } = await context.params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const body = await req.json();

  const res = await fetch(
    `${API_URL}/my-reservations/${reservationId}/reviews`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body), // { rating, content }
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const backendUrl =
    `${process.env.NEXT_PUBLIC_API_URL}/my-reservations?` +
    new URL(req.url).searchParams.toString();

  const res = await fetch(backendUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    return NextResponse.json({ message: "accessToken 만료" }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

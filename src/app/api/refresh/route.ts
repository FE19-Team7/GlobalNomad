import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "Refresh token 없음" },
      { status: 401 }
    );
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ message: "재발급 실패" }, { status: 401 });
  }

  const data = await res.json();

  const response = NextResponse.json({ ok: true });

  response.cookies.set("accessToken", data.accessToken, {
    httpOnly: true,
    path: "/",
  });

  return response;
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message ?? "로그인 실패" },
        { status: res.status }
      );
    }

    const response = NextResponse.json({ user: data.user }, { status: 201 });

    // accessToken → httpOnly 쿠키
    response.cookies.set("accessToken", data.accessToken, {
      httpOnly: true,
      path: "/",
    });

    // refreshToken → httpOnly 쿠키
    response.cookies.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("LOGIN ROUTE ERROR:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

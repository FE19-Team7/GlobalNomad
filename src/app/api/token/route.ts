import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * 클라이언트에서 토큰이 필요할 때 호출하는 API
 * httpOnly 쿠키에서 accessToken을 읽어 반환
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "인증 실패" }, { status: 401 });
  }

  return NextResponse.json({ token });
}

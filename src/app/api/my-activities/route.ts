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

  const { searchParams } = new URL(req.url);
  const cursorId = searchParams.get("cursorId");
  const size = searchParams.get("size") ?? "20";

  const backendUrl = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/my-activities`
  );

  if (cursorId) backendUrl.searchParams.set("cursorId", cursorId);
  backendUrl.searchParams.set("size", size);

  const res = await fetch(backendUrl.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

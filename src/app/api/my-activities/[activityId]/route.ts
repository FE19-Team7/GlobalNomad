import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(_req: NextRequest, ctx: { params: { activityId: string } }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const { activityId } = ctx.params;

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/my-activities/${activityId}`;

  const res = await fetch(backendUrl, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 204) return new NextResponse(null, { status: 204 });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
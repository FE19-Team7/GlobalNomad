import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

type Params = { activityId: string };

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { activityId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/my-activities/${activityId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  // 백엔드가 204를 주면 그대로 종료
  if (res.status === 204) return new NextResponse(null, { status: 204 });

  // 그 외엔 바디가 있을 수도/없을 수도 있으니 안전 파싱
  const data = await res.json().catch(() => null);
  return NextResponse.json(data ?? { message: res.statusText }, { status: res.status });
}

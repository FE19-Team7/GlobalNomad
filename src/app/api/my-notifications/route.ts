import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursorId = searchParams.get("cursorId");
  const size = searchParams.get("size") ?? "10";

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const query = new URLSearchParams();
  if (cursorId) query.append("cursorId", cursorId);
  query.append("size", size);

  const res = await fetch(`${BASE_URL}/my-notifications?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

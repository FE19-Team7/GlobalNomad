import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function requireApiUrl() {
  if (!API_URL) {
    return NextResponse.json(
      { message: 'NEXT_PUBLIC_API_URL이 설정되지 않았습니다.' },
      { status: 500 }
    );
  }
  return null;
}

async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value ?? null;
}

type Params = { activityId: string };

// GET /api/activities/:activityId
export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  const apiErr = requireApiUrl();
  if (apiErr) return apiErr;

  const { activityId } = await context.params;
  const accessToken = await getAccessToken();

  const res = await fetch(`${API_URL}/activities/${activityId}`, {
    method: 'GET',
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    cache: 'no-store',
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}

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

// PATCH /api/my-activities/:activityId
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const apiErr = requireApiUrl();
  if (apiErr) return apiErr;

  const { activityId } = await context.params;

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${API_URL}/my-activities/${activityId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}

// DELETE /api/my-activities/:activityId
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  const apiErr = requireApiUrl();
  if (apiErr) return apiErr;

  const { activityId } = await context.params;

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/my-activities/${activityId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}

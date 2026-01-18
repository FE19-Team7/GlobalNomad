import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

type Params = { activityId: string };

type Ctx = RouteContext<'/api/my-activities/[activityId]'>;

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

async function forwardResponse(res: Response) {
  // 백엔드가 204를 주면 그대로 종료
  if (res.status === 204) return new NextResponse(null, { status: 204 });

  const contentType = res.headers.get('content-type') ?? '';

  // JSON이면 JSON으로 안전 파싱
  if (contentType.includes('application/json')) {
    const data = await res.json().catch(() => null);
    return NextResponse.json(
      data ?? { message: res.statusText },
      { status: res.status }
    );
  }

  // 그 외엔 텍스트로 안전 처리
  const text = await res.text().catch(() => '');
  if (text) {
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': contentType || 'text/plain; charset=utf-8' },
    });
  }

  // 바디가 비어있다면 statusText로
  return NextResponse.json({ message: res.statusText }, { status: res.status });
}

// PATCH /api/my-activities/:activityId
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const apiErr = requireApiUrl();
  if (apiErr) return apiErr;

  const { activityId } = (await ctx.params) as Params;

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (body == null) {
    return NextResponse.json({ message: '요청 본문(JSON)이 필요합니다.' }, { status: 400 });
  }

  const res = await fetch(`${API_URL}/my-activities/${activityId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  return forwardResponse(res);
}

// DELETE /api/my-activities/:activityId
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const apiErr = requireApiUrl();
  if (apiErr) return apiErr;

  const { activityId } = (await ctx.params) as Params;

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/my-activities/${activityId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  return forwardResponse(res);
}
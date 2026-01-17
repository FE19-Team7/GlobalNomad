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

// POST /api/activities/image
export async function POST(req: NextRequest) {
  const apiErr = requireApiUrl();
  if (apiErr) return apiErr;

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const form = await req.formData();
  const image = form.get('image');

  if (!image || !(image instanceof File)) {
    return NextResponse.json({ message: 'image 파일이 필요합니다.' }, { status: 400 });
  }

  const fd = new FormData();
  fd.append('image', image);

  const res = await fetch(`${API_URL}/activities/image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: fd,
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}

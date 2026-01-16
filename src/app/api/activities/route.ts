import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL이 설정되지 않았습니다.');
}

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get('cookie') ?? '';
    const body = await request.json();

    const res = await fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : '체험 등록 프록시 실패';
    return NextResponse.json({ message }, { status: 500 });
  }
}

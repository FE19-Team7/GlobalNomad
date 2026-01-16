import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL이 설정되지 않았습니다.');
}

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get('cookie') ?? '';

    // 클라이언트가 보낸 formData 그대로 파싱해서
    const formData = await request.formData();

    // 서버 API로 그대로 전달
    const res = await fetch(`${API_URL}/activities/image`, {
      method: 'POST',
      headers: {
        cookie,
      },
      body: formData,
    });

    const text = await res.text(); // 응답이 json이든 아니든 안전하게 처리
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : '이미지 업로드 프록시 실패';
    return NextResponse.json({ message }, { status: 500 });
  }
}

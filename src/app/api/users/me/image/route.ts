import { NextResponse } from 'next/server';
import { serverAuthFetch } from '@/src/lib/api/serverAuthFetch';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// POST - 프로필 이미지 업로드
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const response = await serverAuthFetch(`${BASE_URL}/users/me/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: '이미지 업로드에 실패했습니다.'},
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAuTHORiZED') {
      return NextResponse.json(
        { error: '인증 토큰이 없습니다.' },
        {status: 401 }
      );
    }

    console.error('POST /api/users/me/image error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
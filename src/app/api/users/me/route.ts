import { NextResponse } from 'next/server';
import { serverAuthFetch } from '@/src/lib/api/serverAuthFetch';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// GET - 내 정보 조회
export async function GET() {
  try {
    const response = await serverAuthFetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: '사용자 정보를 불러오는데 실패했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { error: '인증 토큰이 없습니다.' },
        { status: 401 }
      );
    }
    console.error('GET /api/users/me error', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH - 내 정보 수정
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const response = await serverAuthFetch(`${BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: '정보 수정에 실패했습니다.', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { error: '인증 토큰이 없습니다.' },
        { status: 401 }
      );
    }
    console.error('PATCH /api/users/me error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
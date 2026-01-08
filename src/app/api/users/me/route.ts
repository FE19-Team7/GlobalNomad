import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sp-globalnomad-api.vercel.app/19-7';

// GET - 내 정보 조회
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    console.log('🟢 GET /api/users/me');
    console.log('🟢 Token:', token ? '있음' : '없음');

    if (!token) {
      return NextResponse.json({ error: '인증 토큰이 없습니다.' }, { status: 401 });
    }

    const response = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('🟢 External API Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('🟢 External API Error:', errorData);
      return NextResponse.json({ error: '사용자 정보를 불러오는데 실패했습니다.' }, { status: response.status });
    }

    const data = await response.json();
    console.log('🟢 Response Data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔴 GET error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
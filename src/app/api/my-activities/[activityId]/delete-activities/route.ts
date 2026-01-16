import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 내 체험 삭제
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ activityId: string }> }
) {
  const { activityId } = await context.params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${API_URL}/my-activities/${activityId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || '체험 삭제에 실패했습니다.' },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('체험 삭제 API 에러:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
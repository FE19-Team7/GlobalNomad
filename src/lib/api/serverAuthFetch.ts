import { cookies } from 'next/headers';

/**
 * 서버 라우트에서 사용하는 인증 fetch
 * 
 * 이 함수가 처리하는 것은
 * - httpOnly 쿠키에서 accessToken 자동으로 추출
 * - Authorization 헤더 자동 추가
 * - 401 응답시 refreshToken으로 토큰 갱신 후 재시도
 * - retry 플래그로 무한 루프 방지
 */

export async function serverAuthFetch(
  input: RequestInfo,
  init: RequestInit & { retry?: boolean } = {}
): Promise<Response> {
  const { retry = true, ...options } = init;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('UNAUTHORIZED');
  }

  // 토큰 포함해서 요청
  const fetchWithToken = () =>
    fetch(input, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const res = await fetchWithToken();

    // 401이 아니면 그대로 반환
    if (res.status !== 401) return res;

    // retry가 false면 그대로 반환 (무한 루프 방지용)
    if (!retry) return res;

    // 401이면 refresh 시도
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return res; // refresh 토큰 없으면 그대로 반환
    }

    // refresh토큰으로 토큰 갱신 요청
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const refreshRes = await fetch(`${BASE_URL}/auth/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({ refreshToken }),
    });

    if (!refreshRes.ok) {
      return res; // 리프레쉬 실패하면 원래 401 응답 반환
    }

    const { accessToken: newAccessToken } = await refreshRes.json();

    // 새 토큰으로 쿠키 업데이트 (이 부분은 미들웨어나 별도 처리 필요)
    // 여기서는 바로 재시도만 수행

    // 샡 토큰으로 재시도 (retry=false로 위에서 무한루프 방지 )
    return fetch(input, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${newAccessToken}`,
      },
    });
}
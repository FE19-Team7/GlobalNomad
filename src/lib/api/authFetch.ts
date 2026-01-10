/**
 * 인증이 필요한 API 요청을 위한 공통 fetch 래퍼
 *
 *   이런 경우에 사용
 * - httpOnly 쿠키 기반 인증을 사용하는 API 호출
 * - 요청 시 accessToken 쿠키가 필요하고
 * - 401 응답 시 /api/refresh 를 통해 토큰 갱신이 필요한 경우
 *
 *  이 함수가 처리하는 것
 * - credentials: "include" 자동 포함
 * - 401 응답 시 refresh 요청 후 기존 요청 1회 재시도
 * - retry 플래그로 무한 refresh 루프 방지
 */
export async function authFetch(
  input: RequestInfo,
  init: RequestInit & { retry?: boolean } = {}
) {
  const { retry = true, ...options } = init;

  const fetchWithCookie = () =>
    fetch(input, {
      ...options,
      credentials: "include",
    });

  const res = await fetchWithCookie();

  if (res.status !== 401) return res;
  if (!retry) return res;

  const refreshRes = await fetch("/api/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!refreshRes.ok) return res;

  return authFetch(input, { ...options, retry: false });
}

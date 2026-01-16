const API_URL = process.env.NEXT_PUBLIC_API_URL;

function requireApiUrl() {
  if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL이 설정되지 않았습니다.');
  return API_URL;
}

async function parseErrorMessage(res: Response) {
  try {
    const data = await res.json();
    if (data?.message) return String(data.message);
  } catch {
    // empty body or non-json
  }
  return `요청 실패: ${res.status}`;
}

type Primitive = string | number | boolean;

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  params?: Record<string, Primitive | undefined | null>;
  body?: unknown;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const base = requireApiUrl();

  const url = new URL(`${base}${path.startsWith('/') ? path : `/${path}`}`);

  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      url.searchParams.set(k, String(v));
    });
  }

  const res = await fetch(url.toString(), {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache ?? 'no-store',
  });

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }

  return (await res.json()) as T;
}
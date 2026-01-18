type Primitive = string | number | boolean;

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  params?: Record<string, Primitive | undefined | null>;
  body?: unknown;
};

async function parseErrorMessage(res: Response) {
  try {
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      const data = await res.json();
      if (data?.message) return String(data.message);
      return JSON.stringify(data);
    }
    const text = await res.text();
    if (text) return text;
  } catch {}
  return `요청 실패: ${res.status}`;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const url = new URL(path, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      url.searchParams.set(k, String(v));
    });
  }

  const res = await fetch(url.toString(), {
    ...options,
    credentials: "include", // 같은 오리진(/api)이므로 OK (쿠키 포함)
    headers: {
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
      accept: "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache ?? "no-store",
  });

  if (res.status === 204) return undefined as T;
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return (await res.json()) as T;
}
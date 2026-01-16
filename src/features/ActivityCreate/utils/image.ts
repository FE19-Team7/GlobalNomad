export type ImageValidationResult =
  | { ok: true }
  | { ok: false; reason: 'not-image' | 'too-large' | 'too-many' };

export const DEFAULT_IMAGE_RULES = {
  maxBytes: 10 * 1024 * 1024, // 10MB
  // 필요하면 여기서 확장자/타입 화이트리스트를 더 강하게 걸 수 있음
};

export function fileKey(file: File) {
  // 안정적인 key (중복 제거에도 사용)
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function validateImageFile(
  file: File,
  opts: { maxBytes?: number } = {}
): ImageValidationResult {
  const maxBytes = opts.maxBytes ?? DEFAULT_IMAGE_RULES.maxBytes;

  // MIME 기반 1차 방어
  if (!file.type || !file.type.startsWith('image/')) {
    return { ok: false, reason: 'not-image' };
  }

  if (file.size > maxBytes) {
    return { ok: false, reason: 'too-large' };
  }

  return { ok: true };
}

export function dedupeFiles(files: File[]) {
  const seen = new Set<string>();
  const out: File[] = [];
  for (const f of files) {
    const k = fileKey(f);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(f);
  }
  return out;
}

/**
 * existing + incoming -> dedupe 후 maxCount 제한
 * - maxCount 넘으면 잘라냄 (추가 실패 UX는 컴포넌트에서 border로만 처리)
 */
export function mergeAndLimitFiles(params: {
  existing: File[];
  incoming: File[];
  maxCount: number;
}) {
  const merged = dedupeFiles([...params.existing, ...params.incoming]);
  const limited = merged.slice(0, params.maxCount);
  const exceeded = merged.length > params.maxCount;
  return { files: limited, exceeded };
}

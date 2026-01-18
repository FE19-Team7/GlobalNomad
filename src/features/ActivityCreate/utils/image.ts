export type ImageValidationResult =
  | { ok: true }
  | { ok: false; reason: 'not-image' | 'too-large' | 'too-many' };

export const DEFAULT_IMAGE_RULES = {
  maxBytes: 10 * 1024 * 1024, // 10MB
};

export function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function validateImageFile(
  file: File,
  opts: { maxBytes?: number } = {}
): ImageValidationResult {
  const maxBytes = opts.maxBytes ?? DEFAULT_IMAGE_RULES.maxBytes;

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

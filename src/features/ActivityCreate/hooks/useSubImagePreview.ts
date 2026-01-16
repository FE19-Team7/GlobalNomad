import { useEffect, useMemo } from 'react';

type PreviewItem = { key: string; url: string };

export function useSubImagePreview(files: File[]) {
  const items = useMemo<PreviewItem[]>(() => {
    if (!files.length) return [];
    return files.map((f) => ({
      key: `${f.name}-${f.size}-${f.lastModified}`,
      url: URL.createObjectURL(f),
    }));
  }, [files]);

  useEffect(() => {
    return () => {
      items.forEach((it) => URL.revokeObjectURL(it.url));
    };
  }, [items]);

  return { items, count: files.length };
}
import { useEffect, useMemo } from 'react';

export function useBannerPreview(file: File | null) {
  const key = useMemo(() => {
    if (!file) return null;
    return `${file.name}-${file.size}-${file.lastModified}`;
  }, [file]);

  const url = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (!url) return;
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [url]);

  return { url, hasFile: Boolean(file), key };
}

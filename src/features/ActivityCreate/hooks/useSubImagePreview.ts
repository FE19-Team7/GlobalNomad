import { useEffect, useMemo, useState } from 'react';
import { fileKey } from '../utils/image';

type PreviewItem = { key: string; url: string };

/**
 * 소개 이미지 미리보기 (0/4)
 * - files -> objectURL 배열 생성/해제
 * - key/url를 묶어서 반환(삭제/재정렬 시 렌더 안정)
 */
export function useSubImagePreview(files: File[]) {
  const [items, setItems] = useState<PreviewItem[]>([]);

  useEffect(() => {
    if (!files.length) {
      setItems([]);
      return;
    }

    const next: PreviewItem[] = files.map((f) => ({
      key: fileKey(f),
      url: URL.createObjectURL(f),
    }));

    setItems(next);

    return () => {
      next.forEach((it) => URL.revokeObjectURL(it.url));
    };
  }, [files]);

  const info = useMemo(() => {
    return {
      count: files.length,
      items,
    };
  }, [files.length, items]);

  return info;
}

import { useEffect, useMemo, useState } from 'react';
import { fileKey } from '../utils/image';

/**
 * 배너 이미지 미리보기 (0/1)
 * - File -> objectURL 생성/해제
 * - key를 함께 내려서 렌더 안정성 확보
 */
export function useBannerPreview(file: File | null) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const info = useMemo(() => {
    return {
      hasFile: Boolean(file),
      key: file ? fileKey(file) : null,
      url,
    };
  }, [file, url]);

  return info;
}

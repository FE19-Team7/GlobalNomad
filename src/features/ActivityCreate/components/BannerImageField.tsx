'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { useBannerPreview } from '../hooks/useBannerPreview';
import { validateImageFile } from '../utils/image';
import EyeClose from '@/src/assets/eye-closed.svg';

type Props = {
  value: File | null;

  existingUrl?: string;         // edit에서만
  onChange: (file: File | null) => void;

  onClearExisting?: () => void; // edit에서만
  requiredError?: boolean;
  maxBytes: number;
};

export default function BannerImageField({
  value,
  existingUrl,
  onChange,
  onClearExisting,
  requiredError,
  maxBytes,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { url: fileUrl, hasFile, key } = useBannerPreview(value);

  const [pickFailed, setPickFailed] = useState(false);

  const hasAny = hasFile || Boolean(existingUrl);
  const countText = useMemo(() => (hasAny ? `1/1` : `0/1`), [hasAny]);

  const borderClass =
    requiredError || pickFailed ? 'border-red-500' : 'border-gray-100';

  const previewUrl = fileUrl ?? existingUrl ?? null;

  const openPicker = () => inputRef.current?.click();

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = '';
    if (!file) return;

    const v = validateImageFile(file, { maxBytes });
    if (!v.ok) {
      setPickFailed(true);
      return;
    }

    setPickFailed(false);
    onChange(file);
  };

  const onRemove = () => {
    setPickFailed(false);

    if (value) {
      onChange(null);
      return;
    }

    if (existingUrl) {
      onClearExisting?.();
      return;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-body-lg font-bold">배너 이미지 등록</p>

      <div className="flex items-center gap-[10px]">
        <button
          type="button"
          onClick={openPicker}
          className={`
            w-[128px] h-[128px]
            rounded-[16px]
            border ${borderClass}
            bg-white
            flex flex-col items-center justify-center
            gap-2
            cursor-pointer
          `}
          aria-label="배너 이미지 업로드"
        >
          <EyeClose />
          <div className="text-gray-400 text-body-lg">{countText}</div>
        </button>

        {previewUrl && (
          <div key={key ?? previewUrl} className="relative w-[128px] h-[128px]">
            <Image
              src={previewUrl}
              alt="배너 미리보기"
              fill
              className="rounded-[16px] object-cover"
              sizes="128px"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-950 text-white text-[20px] flex items-center justify-center text-sm cursor-pointer"
              aria-label="배너 이미지 삭제"
            >
              ×
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onPick}
          className="hidden"
        />
      </div>
    </div>
  );
}

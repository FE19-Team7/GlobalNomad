'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { useSubImagePreview } from '../hooks/useSubImagePreview';
import { validateImageFile } from '../utils/image';
import EyeClose from '@/src/assets/eye-closed.svg';

type ExistingSubImage = { id: number; imageUrl: string };

type Props = {
  value: File[];
  onChange: (files: File[]) => void;
  maxBytes?: number;
  maxCount?: number;

  // edit 전용
  existing?: ExistingSubImage[];
  removedExistingIds?: number[];
  onToggleRemoveExisting?: (id: number) => void;
};

export default function SubImagesField({
  value,
  onChange,
  maxBytes,
  maxCount = 4,
  existing,
  removedExistingIds,
  onToggleRemoveExisting,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { items: newItems } = useSubImagePreview(value);

  const [pickFailed, setPickFailed] = useState(false);

  const removedSet = useMemo(() => new Set(removedExistingIds ?? []), [removedExistingIds]);

  const existingCount = useMemo(() => {
    if (!existing?.length) return 0;
    // “삭제 토글되지 않은 것”만 카운트에 포함
    return existing.filter((img) => !removedSet.has(img.id)).length;
  }, [existing, removedSet]);

  const totalCount = existingCount + value.length;
  const isFull = totalCount >= maxCount;

  const tileBorderClass = useMemo(() => {
    if (pickFailed) return 'border-red-500';
    return 'border-gray-100';
  }, [pickFailed]);

  const openPicker = () => {
    if (isFull) {
      setPickFailed(true);
      return;
    }
    inputRef.current?.click();
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;

    // 남은 슬롯 계산(기존 + 새 파일 합쳐 maxCount)
    const remaining = Math.max(0, maxCount - existingCount - value.length);
    if (remaining <= 0) {
      setPickFailed(true);
      return;
    }

    const validIncoming: File[] = [];
    for (const f of files) {
      const v = validateImageFile(f, { maxBytes });
      if (v.ok) validIncoming.push(f);
    }

    if (validIncoming.length === 0) {
      setPickFailed(true);
      return;
    }

    // 중복 키 기준으로 필터링(이름/사이즈/lastModified) — 기존 value와 비교
    const existingKeys = new Set(value.map((f) => `${f.name}-${f.size}-${f.lastModified}`));
    const deduped = validIncoming.filter((f) => !existingKeys.has(`${f.name}-${f.size}-${f.lastModified}`));

    const next = [...value, ...deduped].slice(0, value.length + remaining);

    // exceeded / 변화없음 처리
    const exceeded = value.length + deduped.length > value.length + remaining;
    setPickFailed(exceeded || next.length === value.length);
    onChange(next);
  };

  const removeNewAt = (idx: number) => {
    setPickFailed(false);
    onChange(value.filter((_, i) => i !== idx));
  };

  const toggleExisting = (id: number) => {
    setPickFailed(false);
    onToggleRemoveExisting?.(id);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-body-lg font-bold">소개 이미지 등록</p>

      <div className="flex items-center gap-[10px] flex-wrap">
        {/* 업로드 타일 */}
        <button
          type="button"
          onClick={openPicker}
          className={`
            w-[128px] h-[128px]
            rounded-[16px]
            border ${tileBorderClass}
            bg-white
            flex flex-col items-center justify-center
            gap-2
            cursor-pointer
            ${isFull ? 'opacity-60 cursor-not-allowed' : ''}
          `}
          aria-label="소개 이미지 업로드"
        >
          <EyeClose />
          <div className="text-gray-400 text-sm">{totalCount}/{maxCount}</div>
        </button>

        {/* edit: 기존 이미지 */}
        {existing?.map((img) => {
          const removed = removedSet.has(img.id);

          return (
            <div key={`existing-${img.id}`} className="relative w-[128px] h-[128px]">
              <Image
                src={img.imageUrl}
                alt="기존 소개 이미지"
                fill
                className={`rounded-[16px] object-cover ${removed ? 'opacity-40 grayscale' : ''}`}
                sizes="128px"
              />

              {/* 삭제 토글 버튼 */}
              <button
                type="button"
                onClick={() => toggleExisting(img.id)}
                className={`
                  absolute -top-2 -right-2 w-8 h-8 rounded-full
                  ${removed ? 'bg-gray-200 text-gray-950' : 'bg-gray-950 text-white'}
                  text-[18px] flex items-center justify-center cursor-pointer
                `}
                aria-label={removed ? '기존 소개 이미지 삭제 취소' : '기존 소개 이미지 삭제'}
              >
                {removed ? '↩' : '×'}
              </button>

              {removed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="px-2 py-1 rounded-md bg-black/60 text-white text-xs">
                    삭제됨
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* 새로 추가한 파일 프리뷰 */}
        {newItems.map((it, idx) => (
          <div key={it.key} className="relative w-[128px] h-[128px]">
            <Image
              src={it.url}
              alt={`소개 이미지 ${idx + 1}`}
              fill
              className="rounded-[16px] object-cover"
              sizes="128px"
            />
            <button
              type="button"
              onClick={() => removeNewAt(idx)}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-950 text-white text-[20px] flex items-center justify-center cursor-pointer"
              aria-label={`소개 이미지 ${idx + 1} 삭제`}
            >
              ×
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onPick}
          className="hidden"
        />
      </div>
    </div>
  );
}

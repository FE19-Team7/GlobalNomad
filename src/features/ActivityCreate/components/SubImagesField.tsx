'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { useSubImagePreview } from '../hooks/useSubImagePreview';
import { mergeAndLimitFiles, validateImageFile } from '../utils/image';
import EyeClose from '@/src/assets/eye-closed.svg';

type ExistingSubImage = { id: number; imageUrl: string };

type SubImagesFieldProps = {
  /** 새로 추가한 파일들 (create/edit 공통) */
  value: File[];
  onChange: (files: File[]) => void;

  /** edit 초기값: 서버에 이미 존재하는 소개 이미지들 */
  existing?: ExistingSubImage[];

  /** edit: 삭제 예약된 기존 이미지 id 목록 */
  removedIds?: number[];

  /**
   * edit: 기존 이미지 삭제(토글) 처리
   * - 권장: 클릭 시 removedIds에 넣었다/뺐다
   */
  onToggleRemoveExisting?: (id: number) => void;

  /** 옵션: 용량 제한(기본 10MB) */
  maxBytes?: number;

  /** 최대 개수(기본 4) */
  maxCount?: number;
};

/**
 * 소개 이미지 등록 (0/4)
 * - create: value(File[])만 사용
 * - edit: existing(URL) + value(File[])를 같은 UI로 표시
 * - 안정화:
 *   1) 이미지 파일 검증(type/size)
 *   2) 기존 + 새 선택 merge 시 dedupe 후 maxCount 제한
 *   3) 초과/유효성 실패 시 "업로드 타일 테두리만 빨강"
 *   4) key/url 묶어서 렌더 안정
 */
export default function SubImagesField({
  value,
  onChange,
  existing = [],
  removedIds = [],
  onToggleRemoveExisting,
  maxBytes,
  maxCount = 4,
}: SubImagesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // 신규 파일 미리보기
  const { items: newItems } = useSubImagePreview(value);

  // 기존 이미지(삭제 예약 제외)만 노출
  const activeExisting = useMemo(() => {
    if (!existing.length) return [];
    if (!removedIds.length) return existing;
    const removedSet = new Set(removedIds);
    return existing.filter((img) => !removedSet.has(img.id));
  }, [existing, removedIds]);

  // 전체 카운트 = (남은 기존) + (신규 파일)
  const totalCount = activeExisting.length + newItems.length;
  const isFull = totalCount >= maxCount;

  // “추가 실패” 표시 (텍스트 없음)
  const [pickFailed, setPickFailed] = useState(false);

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

    // 같은 파일 다시 선택 가능하도록 초기화
    e.target.value = '';

    if (!files.length) return;

    // 1) 검증 통과한 것만 추림
    const validIncoming: File[] = [];
    for (const f of files) {
      const v = validateImageFile(f, { maxBytes });
      if (v.ok) validIncoming.push(f);
    }

    if (validIncoming.length === 0) {
      setPickFailed(true);
      return;
    }

    // 2) "신규 파일"만 merge/limit
    //    단, 전체 제한은 (남은 기존 + 신규) 기준이므로,
    //    신규에서 추가 가능한 슬롯 수를 계산해서 그만큼만 받는다.
    const availableSlots = Math.max(0, maxCount - activeExisting.length);

    const { files: merged, exceeded } = mergeAndLimitFiles({
      existing: value,
      incoming: validIncoming,
      maxCount: availableSlots,
    });

    // 3) 초과/유효성 실패가 있으면 테두리만 빨강
    //    merged가 기존과 동일하면(추가된 게 없으면) 실패로 간주
    setPickFailed(exceeded || merged.length === value.length);

    onChange(merged);
  };

  // 신규 파일 삭제
  const removeNewAt = (idx: number) => {
    setPickFailed(false);
    onChange(value.filter((_, i) => i !== idx));
  };

  // 기존 이미지 삭제(토글)
  const removeExisting = (id: number) => {
    setPickFailed(false);
    onToggleRemoveExisting?.(id);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-body-lg font-bold">소개 이미지 등록</p>

      <div className="flex items-center gap-[10px]">
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
          <div className="text-gray-400 text-sm">
            {totalCount}/{maxCount}
          </div>
        </button>

        {/* ✅ 기존 썸네일들 (URL) */}
        {activeExisting.map((img, idx) => (
          <div key={`existing-${img.id}`} className="relative w-[128px] h-[128px]">
            <Image
              src={img.imageUrl}
              alt={`기존 소개 이미지 ${idx + 1}`}
              fill
              className="rounded-[16px] object-cover"
              sizes="128px"
            />
            <button
              type="button"
              onClick={() => removeExisting(img.id)}
              className="
                absolute -top-2 -right-2
                w-8 h-8 rounded-full
                bg-gray-950 text-white
                flex items-center justify-center
                text-sm
                cursor-pointer
              "
              aria-label={`기존 소개 이미지 ${idx + 1} 삭제`}
            >
              ×
            </button>
          </div>
        ))}

        {/* ✅ 신규 썸네일들 (File preview) */}
        {newItems.map((it, idx) => (
          <div key={it.key} className="relative w-[128px] h-[128px]">
            <Image
              src={it.url}
              alt={`소개 이미지 ${activeExisting.length + idx + 1}`}
              fill
              className="rounded-[16px] object-cover"
              sizes="128px"
            />
            <button
              type="button"
              onClick={() => removeNewAt(idx)}
              className="
                absolute -top-2 -right-2
                w-8 h-8 rounded-full
                bg-gray-950 text-white
                flex items-center justify-center
                text-sm 
                cursor-pointer
              "
              aria-label={`소개 이미지 ${activeExisting.length + idx + 1} 삭제`}
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

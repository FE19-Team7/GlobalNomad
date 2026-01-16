'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { useBannerPreview } from '../hooks/useBannerPreview';
import { validateImageFile } from '../utils/image';
import EyeClose from '@/src/assets/eye-closed.svg';

type BannerImageFieldProps = {
    value: File | null;

    /** edit 초기값: 서버에 이미 존재하는 배너 이미지 URL */
    existingUrl?: string;

    /** 새 파일 선택/해제 */
    onChange: (file: File | null) => void;

    /** edit에서 기존 URL을 “삭제 예약” 처리하고 싶을 때 */
    onClearExisting?: () => void;

    /** 제출 시 필수 에러(빨간 테두리만) */
    requiredError?: boolean;

    maxBytes: number;
};

/**
 * 배너 이미지 등록 (0/1, 필수)
 * - 안정화:
 *   1) 이미지 파일 검증(type/size)
 *   2) 선택 실패 시 빨간 테두리만 표시
 *   3) countText 실제 값 반영(0/1 or 1/1) - (파일 or 기존 URL)
 *   4) edit: 기존 URL 미리보기 지원 + 삭제(onClearExisting)
 */
export default function BannerImageField({
    value,
    existingUrl,
    onChange,
    onClearExisting,
    requiredError,
    maxBytes,
}: BannerImageFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { url, hasFile, key } = useBannerPreview(value);

    // “파일 선택 실패(유효성)” 시에만 빨간 테두리 (텍스트 없음)
    const [pickFailed, setPickFailed] = useState(false);

    const hasAnyBanner = Boolean(hasFile || existingUrl);
    const countText = useMemo(() => (hasAnyBanner ? `1/1` : `0/1`), [hasAnyBanner]);

    const borderClass =
        requiredError || pickFailed ? 'border-red-500' : 'border-gray-100';

    const openPicker = () => inputRef.current?.click();

    const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;

        // 같은 파일 다시 선택 가능하도록 초기화
        e.target.value = '';

        if (!file) return;

        const v = validateImageFile(file, { maxBytes });

        if (!v.ok) {
            setPickFailed(true);
            return;
        }

        setPickFailed(false);

        // ✅ 새 파일을 고르면 파일 미리보기가 우선 표시됨 (url이 existingUrl보다 우선)
        onChange(file);

        // 원하면 “새 파일 선택 시 기존 URL도 즉시 제거”하고 싶을 때만 아래 주석 해제
        // if (existingUrl && onClearExisting) onClearExisting();
    };

    const onRemove = () => {
        setPickFailed(false);

        // 1) 새 파일이 있으면 파일만 제거
        if (value) {
            onChange(null);
            return;
        }

        // 2) 새 파일은 없고 기존 URL이 있으면 기존 URL 제거(edit 전용)
        if (existingUrl && onClearExisting) {
            onClearExisting();
        }
    };

    // ✅ 화면에 보여줄 src 결정: 새 파일 미리보기 > 기존 URL
    const shownSrc = url || existingUrl || '';
    const shownKey = url ? key ?? undefined : existingUrl || undefined;

    return (
        <div className="flex flex-col gap-2">
            <p className="text-body-lg font-bold">배너 이미지 등록</p>

            <div className="flex items-center gap-[10px]">
                {/* 업로드 타일 */}
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

                {/* 미리보기(기존 URL or 선택 파일) */}
                {shownSrc && (
                    <div key={shownKey} className="relative w-[128px] h-[128px]">
                        <Image
                            src={shownSrc}
                            alt="배너 미리보기"
                            fill
                            className="rounded-[16px] object-cover"
                            sizes="128px"
                        />

                        {/* 삭제 버튼 */}
                        <button
                            type="button"
                            onClick={onRemove}
                            className="
                absolute -top-2 -right-2
                w-8 h-8 rounded-full
                bg-gray-950 text-white
                flex items-center justify-center
                text-base
                cursor-pointer
              "
                            aria-label="배너 이미지 삭제"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* 실제 input */}
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

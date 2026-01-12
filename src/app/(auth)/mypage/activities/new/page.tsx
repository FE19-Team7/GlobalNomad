'use client';

/**
 * 내 체험 등록 페이지
 */

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDaumPostcodePopup } from 'react-daum-postcode';

import { uploadActivityImage, createActivity } from '@/src/api/activities';

import Input from '@/src/components/Input/Input';
import Button from '@/src/components/Button/Button';
import ActivitiesCategoryDropdown, { ActivityCategory } from '@/src/components/Dropdown/ActivitiesCategoryDropdown';

import CompleteModal from '@/src/components/Modal/CompleteModal';
import CancelModal from '@/src/components/Modal/CancelModal';

/**
 * 타입 정의
 */
type Schedule = {
  date: string;
  startTime: string;
  endTime: string;
}

const CATEGORY_TO_API: Record<ActivityCategory, string> = {
  culture: '문화 · 예술',
  food: '식음료',
  sports: '스포츠',
  tour: '투어',
  sightseeing: '관광',
  wellbeing: '웰빙',
};

// HH:mm -> 분으로 변환
function timeToMinutes(time: string): number {
  const [hh, mm] = time.split(':').map(Number);
  return hh * 60 + mm;
}

// 같은 날짜에서 시간이 겹치는지 검사
function hasOverlappedSchedules(schedules: Schedule[]): boolean {
  const byDate = new Map<string, Schedule[]>();
  for (const s of schedules) {
    if (!byDate.has(s.date)) byDate.set(s.date, []);
    byDate.get(s.date)!.push(s);
  }

  for (const [, list] of byDate) {
    const sorted = [...list].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

    for (let i = 0; i < sorted.length - 1; i++) {
      const cur = sorted[i];
      const next = sorted[i + 1];
      if (timeToMinutes(next.startTime) < timeToMinutes(cur.endTime)) {
        return true;
      }
    }
  }
  return false;
}

export default function ActivityCreatePage() {
  const router = useRouter();

  // Daum 우편번호 팝업 open 함수
  const openDaumPostcode = useDaumPostcodePopup();


  /**
   * 상태 정의
   */
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>();
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [address, setAddress] = useState('');

  // 예약 가능 시간대 상태
  const [schedules, setSchedules] = useState<Schedule[]>([
    { date: '', startTime: '', endTime: '' },
  ]);

  // 이미지 상태(배너: 1개 필수/소개 이미지: 최대 4개)
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);

  // 로딩 / 에러 / 성공 / 이탈 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // 미리보기 URL 생성
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState('');

  useEffect(() => {
    if (!bannerImage) {
      setBannerPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(bannerImage);
    setBannerPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [bannerImage]);

  const [subPreviewUrls, setSubPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = subImages.map((f) => URL.createObjectURL(f));
    setSubPreviewUrls(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [subImages]);

  // 주소 input 클릭 시 Daum 우편번호 팝업 오픈
  const handleAddressClick = () => {
    openDaumPostcode({
      onComplete: (data: unknown) => {
        if (
          typeof data === 'object' &&
          data !== null &&
          'address' in data &&
          typeof (data as { address: unknown }).address === 'string'
        ) {
          setAddress((data as { address: string }).address);
        }
      },
    });
  };

  // 예약 시간대 추가
  const handleAddSchedule = () => {
    setSchedules((prev) => [...prev, { date: '', startTime: '', endTime: '' }]);
  };

  // 예약 시간대 제거 (최소 1개 필수)
  const handleRemoveSchedule = (index: number) => {
    setSchedules((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  // 예약 시간대 값 변경
  const handleScheduleChange = (
    index: number,
    key: keyof Schedule,
    value: string
  ) => {
    setSchedules((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  /**
   * 배너 이미지 변경
   * - 최대 1개
   */
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setBannerImage(file);
  };

  /**
   * 소개 이미지 변경
   * - 최대 4개
   */
  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setSubImages((prev) => {
      if (prev.length + files.length > 4) {
        setErrorMessage('소개 이미지는 최대 4개까지 등록 가능합니다.');
        return prev;
      }
      return [...prev, ...files];
    });

    // 같은 파일 다시 선택 가능하게 input 값 초기화
    e.target.value = '';
  };

  // 소개 이미지 1장 제거
  const handleRemoveSubImage = (index: number) => {
    setSubImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 제출 전 필수값 검증
  const validateBeforeSubmit = (): string => {
    if (!title.trim()) return '제목은 필수입니다.';
    if (!category) return '카테고리는 필수입니다.';
    if (!description.trim()) return '설명은 필수입니다.';
    if (price === '' || price <= 0) {
      return '가격은 0보다 큰 숫자로 입력해 주세요.';
    }
    if (!address.trim()) return '주소는 필수입니다.';
    if (!bannerImage) return '배너 이미지는 필수입니다.';

    // schedules 필수
    if (schedules.length < 1) return '예약 가능한 시간대는 최소 1개 이상 필요합니다.';

    // schedules 내부 값 검증
    for (let i = 0; i < schedules.length; i++) {
      const s = schedules[i];
      if (!s.date) return `예약 가능한 시간대의 날짜를 입력해 주세요. (${i + 1}번째)`;
      if (!s.startTime) return `예약 가능한 시간대의 시작 시간을 입력해 주세요. (${i + 1}번째)`;
      if (!s.endTime) return `예약 가능한 시간대의 종료 시간을 입력해 주세요. (${i + 1}번째)`;

      const start = timeToMinutes(s.startTime);
      const end = timeToMinutes(s.endTime);
      if (end <= start) return `종료 시간은 시작 시간보다 늦어야 합니다. (${i + 1}번째)`;
    }

    // 같은 시간대 중복(겹침) 검증
    if (hasOverlappedSchedules(schedules)) {
      return '같은 날짜에 겹치는 예약 가능 시간대가 존재합니다.';
    }

    // 소개 이미지 제한(최대 4)
    if (subImages.length > 4) return '소개 이미지는 최대 4개까지 등록 가능합니다.';

    return '';
  };

  /**
   * 등록하기 버튼 클릭 시 로직
   * 
   * 1) 필수값/중복 검증
   * 2) 배너 이미지 업로드 -> URL
   * 3) 소개 이미지 업로드(최대 4개) -> URLs
   * 4) createActivity 호출
   * 5) 성공 모달 오픈
   */
  const handleSubmit = async () => {
    const validationMessage = validateBeforeSubmit();
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // 1) 카테고리를 한글로 변환
      const apiCategory = CATEGORY_TO_API[category!];

      // 2) 배너 업로드
      const bannerImageUrl = await uploadActivityImage(bannerImage!);

      // 3) 소개 이미지 업로드 (최대 4장)
      const subImageUrls = await Promise.all(
        subImages.map((file) => uploadActivityImage(file))
      );

      // 4) 체험 등록 API 호출
      await createActivity({
        title: title.trim(),
        category: apiCategory,
        description: description.trim(),
        address: address.trim(),
        price: Number(price),
        schedules,
        bannerImageUrl,
        subImageUrls,
      });

      // 5) 성공 모달
      setIsSuccessModalOpen(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('체험 등록 중 오류 발생');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 성공 모달 확인 버튼
   * - 확인 시 목록으로 이동
   */
  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false);
    router.push('/mypage/activities');
  };

  // 입력 변경 여부
  const isDirty = useMemo(() => {
    return (
      title.trim() !== '' ||
      !!category ||
      description.trim() !== '' ||
      price !== '' ||
      address.trim() !== '' ||
      bannerImage !== null ||
      subImages.length > 0 ||
      schedules.some(
        (s) => s.date !== '' || s.startTime !== '' || s.endTime !== ''
      )
    );
  }, [title, category, description, price, address, bannerImage, subImages, schedules]);

  // 등록 중 이탈
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      <h1 className="text-xl font-bold">내 체험 등록</h1>

      <div className="mt-6 flex flex-col gap-4">
        <Input
          label="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해 주세요"
        />

        <div>
          <p className="text-body-lg text-gray-950 mb-[6px]">카테고리</p>
          <ActivitiesCategoryDropdown value={category} onChange={setCategory} />
        </div>

        <Input
          label="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="체험에 대한 설명을 입력해 주세요"
          aria-multiline
        />

        <Input
          label="가격"
          type="number"
          value={price}
          onChange={(e) => {
            const v = e.target.value;
            setPrice(v === '' ? '' : Number(v));
          }}
          placeholder="체험 금액을 입력해 주세요"
        />

        {/* Daum 주소: readOnly + 클릭 시 팝업 */}
        <Input
          label="주소"
          value={address}
          readOnly
          onClick={handleAddressClick}
          placeholder="주소를 검색해 주세요"
        />

        {/* 예약 가능 시간대 */}
        <div className="mt-2">
          <p className="text-body-lg text-gray-950 mb-[6px]">예약 가능한 시간대</p>

          <div className="flex flex-col gap-3">
            {schedules.map((schedule, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label={index === 0 ? '날짜' : undefined}
                    type="date"
                    value={schedule.date}
                    onChange={(e) => handleScheduleChange(index, 'date', e.target.value)}
                  />
                </div>

                <div className="w-[140px]">
                  <Input
                    label={index === 0 ? '시작 시간' : undefined}
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) =>
                      handleScheduleChange(index, 'startTime', e.target.value)
                    }
                  />
                </div>

                <div className="w-[140px]">
                  <Input
                    label={index === 0 ? '종료 시간' : undefined}
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) =>
                      handleScheduleChange(index, 'endTime', e.target.value)
                    }
                  />
                </div>

                {/* '-' 버튼 (최소 1개 유지) */}
                <button
                  type="button"
                  onClick={() => handleRemoveSchedule(index)}
                  disabled={schedules.length <= 1}
                  className={`h-[40px] w-[40px] rounded-full border flex items-center justify-center
                    ${schedules.length <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  aria-label="시간대 삭제"
                >
                  &#45;
                </button>

                {/* 첫 줄에만 '+' 버튼 표시 */}
                {index === 0 && (
                  <button
                    type="button"
                    onClick={handleAddSchedule}
                    className="h-[40px] w-[40px] rounded-full border flex items-center justify-center hover:bg-gray-50"
                    aria-label="시간대 추가"
                  >
                    &#43;
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 배너 이미지 (필수, 최대 1개) */}
        <div className="mt-2">
          <p className="text-body-lg text-gray-950 mb-[6px]">배너 이미지 등록</p>
          <input type="file" accept="image/*" onChange={handleBannerImageChange} />

          {bannerPreviewUrl && (
            <div className="mt-2">
              <img
                src={bannerPreviewUrl}
                alt="배너 미리보기"
                className="w-full max-h-[240px] object-cover rounded-[12px] border"
              />
            </div>
          )}
        </div>

        {/* 소개 이미지 (최대 4개) */}
        <div className="mt-2">
          <p className="text-body-lg text-gray-950 mb-[6px]">
            소개 이미지 (최대 4개)
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleSubImagesChange}
          />

          {subPreviewUrls.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {subPreviewUrls.map((url, idx) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    alt={`소개 이미지 미리보기 ${idx + 1}`}
                    className="w-full h-[140px] object-cover rounded-[12px] border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSubImage(idx)}
                    aria-label="소개 이미지 삭제"
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80">
                    <img
                      src="/assets/icon_delete_white.svg"
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {/* 등록 버튼 */}
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? '등록 중...' : '등록하기'}
        </Button>

        {/* 등록 완료 모달 */}
        <CompleteModal
          isOpen={isSuccessModalOpen}
          onClose={handleSuccessConfirm}
          message="체험 등록이 완료되었습니다."
        />

        {/* 등록 중 이탈 모달 */}
        <CancelModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={() => router.back()}
          message={`저장되지 않았습니다.\n정말 뒤로 가시겠습니까?`}
        />
      </div>
    </div>
  );
}
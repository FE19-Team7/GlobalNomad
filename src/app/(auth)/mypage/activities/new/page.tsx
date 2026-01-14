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
import ActivitiesCategoryDropdown, {
  ActivityCategory,
} from '@/src/components/Dropdown/ActivitiesCategoryDropdown';
import CompleteModal from '@/src/components/Modal/CompleteModal';
import CancelModal from '@/src/components/Modal/CancelModal';

/**
 * 타입
 */
type Schedule = {
  date: string;      // yyyy-mm-dd
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
};

const CATEGORY_TO_API: Record<ActivityCategory, string> = {
  culture: '문화 · 예술',
  food: '식음료',
  sports: '스포츠',
  tour: '투어',
  sightseeing: '관광',
  wellbeing: '웰빙',
};

const TIME_OPTIONS = Array.from({ length: 24 }, (_, h) => {
  const hh = String(h).padStart(2, '0');
  return `${hh}:00`;
});

function timeToMinutes(time: string) {
  const [hh, mm] = time.split(':').map(Number);
  return hh * 60 + mm;
}

function hasOverlappedSchedules(schedules: Schedule[]) {
  const byDate = new Map<string, Schedule[]>();

  schedules.forEach((s) => {
    if (!byDate.has(s.date)) byDate.set(s.date, []);
    byDate.get(s.date)!.push(s);
  });

  for (const [, list] of byDate) {
    const sorted = [...list].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

    for (let i = 0; i < sorted.length - 1; i++) {
      if (timeToMinutes(sorted[i + 1].startTime) < timeToMinutes(sorted[i].endTime)) {
        return true;
      }
    }
  }
  return false;
}

export default function ActivityCreatePage() {
  const router = useRouter();
  const openDaumPostcode = useDaumPostcodePopup();

  /** 기본 정보 */
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>();
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [address, setAddress] = useState('');

  /** 예약 시간 */
  const [schedules, setSchedules] = useState<Schedule[]>([
    { date: '', startTime: '', endTime: '' },
  ]);
  const [draftSchedule, setDraftSchedule] = useState<Schedule>({
    date: '',
    startTime: '',
    endTime: '',
  });

  /** 이미지 */
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState('');
  const [subPreviewUrls, setSubPreviewUrls] = useState<string[]>([]);

  /** UI 상태 */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  /** 이미지 미리보기 */
  useEffect(() => {
    if (!bannerImage) {
      setBannerPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(bannerImage);
    setBannerPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [bannerImage]);

  useEffect(() => {
    const urls = subImages.map((f) => URL.createObjectURL(f));
    setSubPreviewUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [subImages]);

  /** 주소 검색 */
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

  /** 예약 시간 핸들러 */
  const handleAddSchedule = () => {
    setSchedules((prev) => [...prev, { date: '', startTime: '', endTime: '' }]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedules((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleScheduleChange = (
    index: number,
    key: keyof Schedule,
    value: string
  ) => {
    setSchedules((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [key]: value } : s))
    );
  };

  /** 이미지 핸들러 */
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBannerImage(e.target.files?.[0] ?? null);
  };

  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setSubImages((prev) => {
      if (prev.length + files.length > 4) {
        setErrorMessage('소개 이미지는 최대 4개까지 등록 가능합니다.');
        return prev;
      }
      return [...prev, ...files];
    });

    e.target.value = '';
  };

  const handleRemoveSubImage = (index: number) => {
    setSubImages((prev) => prev.filter((_, i) => i !== index));
  };

  /** 검증 */
  const validateBeforeSubmit = () => {
    if (!title.trim()) return '제목은 필수입니다.';
    if (!category) return '카테고리는 필수입니다.';
    if (!description.trim()) return '설명은 필수입니다.';
    if (price === '' || price <= 0) return '가격을 입력해 주세요.';
    if (!address.trim()) return '주소는 필수입니다.';
    if (!bannerImage) return '배너 이미지는 필수입니다.';

    for (let i = 0; i < schedules.length; i++) {
      const s = schedules[i];
      if (!s.date || !s.startTime || !s.endTime) {
        return `예약 가능한 시간대를 입력해 주세요. (${i + 1}번째)`;
      }
      if (timeToMinutes(s.endTime) <= timeToMinutes(s.startTime)) {
        return `종료 시간은 시작 시간보다 늦어야 합니다. (${i + 1}번째)`;
      }
    }

    if (hasOverlappedSchedules(schedules)) {
      return '같은 날짜에 겹치는 예약 시간대가 존재합니다.';
    }

    return '';
  };

  /** 제출 */
  const handleSubmit = async () => {
    const msg = validateBeforeSubmit();
    if (msg) {
      setErrorMessage(msg);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const bannerImageUrl = await uploadActivityImage(bannerImage!);
      const subImageUrls = await Promise.all(
        subImages.map((f) => uploadActivityImage(f))
      );

      await createActivity({
        title: title.trim(),
        category: CATEGORY_TO_API[category!],
        description: description.trim(),
        address: address.trim(),
        price: Number(price),
        schedules,
        bannerImageUrl,
        subImageUrls,
      });

      setIsSuccessModalOpen(true);
    } catch {
      setErrorMessage('체험 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false);
    router.push('/mypage/activities');
  };

  /** 이탈 감지 */
  const isDirty = useMemo(
    () =>
      title.trim() ||
      category ||
      description.trim() ||
      price !== '' ||
      address.trim() ||
      bannerImage ||
      subImages.length > 0 ||
      schedules.some((s) => s.date || s.startTime || s.endTime),
    [title, category, description, price, address, bannerImage, subImages, schedules]
  );

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  /** JSX */
  return (
    <div className="flex flex-col gap-6 max-w-[700px] mx-auto">
      <h1 className="text-h4 font-bold">내 체험 등록</h1>

      <Input
        label="제목"
        placeholder="제목을 입력해 주세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex flex-col gap-2">
        <p className="text-body-lg font-bold">카테고리</p>
        <ActivitiesCategoryDropdown value={category} onChange={setCategory} />
      </div>

      <Input
        label="설명"
        placeholder="체험에 대한 설명을 입력해 주세요"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        className="min-h-[200px] align-top leading-normal"
      />

      <Input
        label="가격"
        placeholder="체험 금액을 입력해 주세요"
        type="number"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value === '' ? '' : Number(e.target.value))
        }
        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <Input
        label="주소"
        placeholder="주소를 입력해 주세요"
        value={address}
        readOnly
        onClick={handleAddressClick}
      />

      {/* 예약 가능한 시간대 */}
      <div className="flex flex-col gap-4">
        <p className="text-body-lg font-bold">예약 가능한 시간대</p>

        {/* 컬럼 헤더 */}
        <div className="flex items-center gap-2">
          <p className="flex-1 text-body-lg">날짜</p>
          <p className="w-[140px] text-body-lg">시작 시간</p>
          <p className="w-[140px] text-body-lg">종료 시간</p>
          <div className="w-[42px]" />
        </div>

        {/* 시간 옵션 */}
        <datalist id="time-options">
          {TIME_OPTIONS.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>

        {/* 🔵 추가용 row (항상 최상단) */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="date"
              value={draftSchedule.date}
              onChange={(e) =>
                setDraftSchedule((p) => ({ ...p, date: e.target.value }))
              }
              className={`cursor-pointer ${!draftSchedule.date
                ? '[&::-webkit-datetime-edit]:text-gray-400'
                : '[&::-webkit-datetime-edit]:text-gray-950'
                }`}
            />
          </div>

          <div className="w-[140px]">
            <Input
              type="text"
              placeholder="0:00"
              value={draftSchedule.startTime}
              onChange={(e) =>
                setDraftSchedule((p) => ({ ...p, startTime: e.target.value }))
              }
              list="time-options"
              className="cursor-pointer"
            />
          </div>

          <div className="w-[140px]">
            <Input
              type="text"
              placeholder="0:00"
              value={draftSchedule.endTime}
              onChange={(e) =>
                setDraftSchedule((p) => ({ ...p, endTime: e.target.value }))
              }
              list="time-options"
              className="cursor-pointer"
            />
          </div>

          {/* 추가 버튼 */}
          <button
            type="button"
            onClick={() => {
              if (
                !draftSchedule.date ||
                !draftSchedule.startTime ||
                !draftSchedule.endTime
              ) {
                setErrorMessage('예약 시간을 모두 입력해 주세요.');
                return;
              }

              if (
                timeToMinutes(draftSchedule.endTime) <=
                timeToMinutes(draftSchedule.startTime)
              ) {
                setErrorMessage('종료 시간은 시작 시간보다 늦어야 합니다.');
                return;
              }

              const next = [...schedules, draftSchedule];
              if (hasOverlappedSchedules(next)) {
                setErrorMessage('같은 날짜에 겹치는 예약 시간대가 존재합니다.');
                return;
              }

              setSchedules(next);
              setDraftSchedule({ date: '', startTime: '', endTime: '' });
            }}
            className="
        h-[42px] w-[42px] rounded-full
        bg-primary-500 text-white text-xl
        flex items-center justify-center
        cursor-pointer
        hover:opacity-90
      "
          >
            +
          </button>
        </div>

        {/* ➖ 추가 후 divider */}
        {schedules.length > 0 && (
          <div className="h-px w-full bg-gray-100" />
        )}

        {/* 🟢 등록된 리스트 (수정 / 삭제) */}
        <div className="flex flex-col gap-4">
          {schedules.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="date"
                  value={s.date}
                  onChange={(e) =>
                    setSchedules((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, date: e.target.value } : it
                      )
                    )
                  }
                  className="cursor-pointer"
                />
              </div>

              <div className="w-[140px]">
                <Input
                  type="text"
                  value={s.startTime}
                  onChange={(e) =>
                    setSchedules((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, startTime: e.target.value } : it
                      )
                    )
                  }
                  list="time-options"
                  className="cursor-pointer"
                />
              </div>

              <div className="w-[140px]">
                <Input
                  type="text"
                  value={s.endTime}
                  onChange={(e) =>
                    setSchedules((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, endTime: e.target.value } : it
                      )
                    )
                  }
                  list="time-options"
                  className="cursor-pointer"
                />
              </div>

              {/* 삭제 버튼 */}
              <button
                type="button"
                onClick={() =>
                  setSchedules((prev) => prev.filter((_, i) => i !== idx))
                }
                className="
            h-[42px] w-[42px] rounded-full
            bg-gray-50 text-gray-950 text-xl
            flex items-center justify-center
            cursor-pointer
            hover:bg-gray-100
          "
              >
                −
              </button>
            </div>
          ))}
        </div>
      </div>


      {/* 배너 이미지 */}
      <input type="file" accept="image/*" onChange={handleBannerImageChange} />

      {/* 소개 이미지 */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleSubImagesChange}
      />

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? '등록 중...' : '등록하기'}
      </Button>

      <CompleteModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessConfirm}
        message="체험 등록이 완료되었습니다."
      />

      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => router.back()}
        message={`저장되지 않았습니다.\n정말 뒤로 가시겠습니까?`}
      />
    </div>
  );
}

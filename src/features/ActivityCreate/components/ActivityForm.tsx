'use client';

import { useCallback, useMemo, useState } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';

import Input from '@/src/components/Input/Input';
import Button from '@/src/components/Button/Button';
import ActivitiesCategoryDropdown, {
  ActivityCategory,
} from '@/src/components/Dropdown/ActivitiesCategoryDropdown';
import CompleteModal from '@/src/components/Modal/CompleteModal';
import CancelModal from '@/src/components/Modal/CancelModal';

import BannerImageField from './BannerImageField';
import SubImagesField from './SubImagesField';
import ScheduleField from './ScheduleField';

import { useLeaveGuard } from '../hooks/useLeaveGuard';
import { hasOverlappedSchedules, isInvalidSchedule } from '../utils/schedule';
import { buildUpdatePayload } from '../utils/updatePayload';

import type { ActivityDetail, Schedule, SubImage } from '../type';

type Mode = 'create' | 'edit';

type ExistingSubImage = SubImage;
type ActivityDetailForEdit = ActivityDetail;

type ActivityFormProps = {
  mode: Mode;

  // edit일 때만
  initialData?: ActivityDetailForEdit;

  // 버튼/모달 텍스트
  submitText: string; // '등록하기' | '수정하기'
  successMessage: string; // '등록이 완료되었습니다.' | '수정이 완료되었습니다.'

  // submit 핸들러 (페이지에서 api 연결)
  onSubmitCreate: (payload: {
    title: string;
    category: string;
    description: string;
    address: string;
    price: number;
    schedules: { date: string; startTime: string; endTime: string }[];
    bannerImageUrl: string;
    subImageUrls: string[];
  }) => Promise<void>;

  onSubmitEdit: (params: {
    activityId: number;
    payload: {
      title: string;
      category: string;
      description: string;
      price: number;
      address: string;
      bannerImageUrl: string;
      subImageIdsToRemove: number[];
      subImageUrlsToAdd: string[];
      scheduleIdsToRemove: number[];
      schedulesToAdd: { date: string; startTime: string; endTime: string }[];
    };
  }) => Promise<void>;

  // 이미지 업로드 함수(공용)
  uploadImage: (file: File) => Promise<string>;

  // 성공 후 이동 등
  onSuccessNavigate: () => void;

  // 용량 제한
  maxImageBytes?: number; // default 10MB
};

/** API 전송용 카테고리 매핑 (드롭다운 값 -> API 문자열) */
const CATEGORY_TO_API: Record<ActivityCategory, string> = {
  culture: '문화 · 예술',
  food: '식음료',
  sports: '스포츠',
  tour: '투어',
  sightseeing: '관광',
  wellbeing: '웰빙',
};

/** API 문자열 -> 드롭다운 값 (edit 초기값 세팅용) */
const API_TO_CATEGORY: Record<string, ActivityCategory | undefined> = {
  '문화 · 예술': 'culture',
  식음료: 'food',
  스포츠: 'sports',
  투어: 'tour',
  관광: 'sightseeing',
  웰빙: 'wellbeing',
};

function normalizeSchedules(list: Schedule[]) {
  return [...list]
    .map((s) => ({
      id: s.id ?? null,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
    }))
    .sort((a, b) => {
      const k1 = `${a.date}-${a.startTime}-${a.endTime}-${a.id ?? 0}`;
      const k2 = `${b.date}-${b.startTime}-${b.endTime}-${b.id ?? 0}`;
      return k1.localeCompare(k2);
    });
}

export default function ActivityForm({
  mode,
  initialData,
  submitText,
  successMessage,
  onSubmitCreate,
  onSubmitEdit,
  uploadImage,
  onSuccessNavigate,
  maxImageBytes = 10 * 1024 * 1024,
}: ActivityFormProps) {
  const openDaumPostcode = useDaumPostcodePopup();
  const isEdit = mode === 'edit';

  /* ================= 초기값 (edit) ================= */
  const initialActivityId = initialData?.id;
  const initialSchedules = useMemo(() => initialData?.schedules ?? [], [initialData]);
  const initialSubImages = useMemo(() => initialData?.subImages ?? [], [initialData]);

  /* ================= 기본 정보 ================= */
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [category, setCategory] = useState<ActivityCategory | undefined>(
    initialData?.category ? API_TO_CATEGORY[initialData.category] : undefined
  );
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [price, setPrice] = useState<number | ''>(initialData?.price ?? '');
  const [address, setAddress] = useState(initialData?.address ?? '');

  /* ================= 예약 시간 ================= */
  const [draftSchedule, setDraftSchedule] = useState<Schedule>({
    date: '',
    startTime: '',
    endTime: '',
  });

  const [schedules, setSchedules] = useState<Schedule[]>(
    initialSchedules.map((s) => ({
      id: s.id,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
    }))
  );

  /* ================= 배너 ================= */
  const [existingBannerUrl, setExistingBannerUrl] = useState<string>(
    initialData?.bannerImageUrl ?? ''
  );
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  /* ================= 소개 이미지 ================= */
  const [existingSubImagesState] = useState<ExistingSubImage[]>(initialSubImages);
  const [removedSubImageIds, setRemovedSubImageIds] = useState<number[]>([]);
  const [newSubImageFiles, setNewSubImageFiles] = useState<File[]>([]);

  const toggleRemoveExistingSub = (id: number) => {
    setRemovedSubImageIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ================= UI 상태 ================= */
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  /* ================= 이탈 모달 ================= */
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  /* ================= 주소 ================= */
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

  /* ================= 제출 기준 에러(빨간 테두리만) ================= */
  const titleError = submitted && !title.trim();
  const categoryError = submitted && !category;
  const descriptionError = submitted && !description.trim();
  const priceError = submitted && (price === '' || price <= 0);
  const addressError = submitted && !address.trim();

  const bannerMissing = isEdit ? !existingBannerUrl && !bannerFile : !bannerFile;
  const bannerError = submitted && bannerMissing;

  const scheduleSubmitError =
    submitted &&
    (schedules.length === 0 ||
      schedules.some(isInvalidSchedule) ||
      hasOverlappedSchedules(schedules));

  /* ================= 소개 이미지 합산(최대 4개) ================= */
  const activeExistingSubImages = useMemo(() => {
    return existingSubImagesState.filter((img) => !removedSubImageIds.includes(img.id));
  }, [existingSubImagesState, removedSubImageIds]);

  /* ================= ✅ Dirty 체크: edit는 "초기 스냅샷" 비교 ================= */
  const initialSnapshot = useMemo(() => {
    if (!isEdit || !initialData) return null;

    return {
      title: initialData.title ?? '',
      category: API_TO_CATEGORY[initialData.category] ?? undefined,
      description: initialData.description ?? '',
      price: initialData.price ?? '',
      address: initialData.address ?? '',
      bannerImageUrl: initialData.bannerImageUrl ?? '',
      schedules: normalizeSchedules(
        (initialData.schedules ?? []).map((s) => ({
          id: s.id,
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
        }))
      ),
      removedSubImageIds: [] as number[],
      newSubImageCount: 0,
      bannerChangedByFile: false,
    };
  }, [isEdit, initialData]);

  const currentSnapshot = useMemo(() => {
    if (!isEdit) return null;

    return {
      title: title.trim(),
      category,
      description: description.trim(),
      price,
      address: address.trim(),
      bannerImageUrl: existingBannerUrl,
      schedules: normalizeSchedules(schedules),
      removedSubImageIds: [...removedSubImageIds].sort((a, b) => a - b),
      newSubImageCount: newSubImageFiles.length,
      bannerChangedByFile: Boolean(bannerFile),
    };
  }, [
    isEdit,
    title,
    category,
    description,
    price,
    address,
    existingBannerUrl,
    schedules,
    removedSubImageIds,
    newSubImageFiles,
    bannerFile,
  ]);

  const isDirty = useMemo(() => {
    if (!isEdit) {
      // create: 입력된 게 있으면 dirty
      return Boolean(
        title.trim() ||
          category ||
          description.trim() ||
          price !== '' ||
          address.trim() ||
          schedules.length > 0 ||
          draftSchedule.date ||
          draftSchedule.startTime ||
          draftSchedule.endTime ||
          bannerFile ||
          newSubImageFiles.length > 0
      );
    }

    // edit: 초기 스냅샷과 비교
    if (!initialSnapshot || !currentSnapshot) return false;
    return JSON.stringify(initialSnapshot) !== JSON.stringify(currentSnapshot);
  }, [
    isEdit,
    title,
    category,
    description,
    price,
    address,
    schedules,
    draftSchedule,
    bannerFile,
    newSubImageFiles,
    initialSnapshot,
    currentSnapshot,
  ]);

  const onAttemptLeave = useCallback(() => {
    setIsCancelModalOpen(true);
  }, []);

  useLeaveGuard({ enabled: isDirty, onAttemptLeave });

  const confirmLeave = () => {
    // 실제 router.back()은 페이지에서 처리하는 게 가장 깔끔함.
    // 여기서는 모달만 닫아주고, leave 처리는 useLeaveGuard 쪽 설계에 맞추면 됨.
    setIsCancelModalOpen(false);
  };

  const cancelLeave = () => {
    setIsCancelModalOpen(false);
  };

  /* ================= 제출 ================= */
  const handleSubmit = async () => {
    setSubmitted(true);

    if (
      titleError ||
      categoryError ||
      descriptionError ||
      priceError ||
      addressError ||
      bannerError ||
      scheduleSubmitError
    ) {
      return;
    }

    try {
      setIsSubmitting(true);

      // 1) 배너 URL 확보
      let bannerImageUrl = existingBannerUrl;
      if (!isEdit) {
        bannerImageUrl = await uploadImage(bannerFile!);
      } else {
        if (bannerFile) bannerImageUrl = await uploadImage(bannerFile);
      }

      // 2) 소개 이미지 URL(신규) 업로드
      const subImageUrlsToAdd = await Promise.all(
        newSubImageFiles.map((f) => uploadImage(f))
      );

      if (!isEdit) {
        await onSubmitCreate({
          title: title.trim(),
          category: CATEGORY_TO_API[category!],
          description: description.trim(),
          address: address.trim(),
          price: Number(price),
          schedules: schedules.map((s) => ({
            date: s.date,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
          bannerImageUrl,
          subImageUrls: subImageUrlsToAdd,
        });
      } else {
        const payload = buildUpdatePayload({
          currentSchedules: schedules,
          original: initialData!, // edit니까 존재
          subImageIdsToRemove: removedSubImageIds,
          subImageUrlsToAdd,
          bannerImageUrl,
          title: title.trim(),
          category: CATEGORY_TO_API[category!],
          description: description.trim(),
          price: Number(price),
          address: address.trim(),
        });

        await onSubmitEdit({
          activityId: initialActivityId!,
          payload,
        });
      }

      setIsSuccessModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      <Input
        label="제목"
        placeholder="제목을 입력해 주세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={titleError ? ' ' : undefined}
      />

      <div className="flex flex-col gap-2">
        <p className="text-body-lg font-bold">카테고리</p>
        <ActivitiesCategoryDropdown
          value={category}
          onChange={setCategory}
          error={categoryError}
        />
      </div>

      <Input
        label="설명"
        placeholder="체험에 대한 설명을 입력해 주세요"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        className="min-h-[200px] align-top leading-normal"
        error={descriptionError ? ' ' : undefined}
      />

      <Input
        label="가격"
        placeholder="체험 금액을 입력해 주세요"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        error={priceError ? ' ' : undefined}
      />

      <Input
        label="주소"
        placeholder="주소를 입력해 주세요"
        value={address}
        readOnly
        onClick={handleAddressClick}
        error={addressError ? ' ' : undefined}
      />

      <ScheduleField
        draft={draftSchedule}
        onChangeDraft={setDraftSchedule}
        schedules={schedules}
        onChangeSchedules={setSchedules}
        submitted={submitted}
      />

      <BannerImageField
        value={bannerFile}
        existingUrl={isEdit ? existingBannerUrl : undefined}
        onChange={(file) => setBannerFile(file)}
        onClearExisting={() => setExistingBannerUrl('')}
        requiredError={bannerError}
        maxBytes={maxImageBytes}
      />

      <SubImagesField
        existing={isEdit ? activeExistingSubImages : undefined}
        onToggleRemoveExisting={isEdit ? toggleRemoveExistingSub : undefined}
        value={newSubImageFiles}
        onChange={setNewSubImageFiles}
        maxBytes={maxImageBytes}
        maxCount={4}
      />

      <div className="flex justify-center">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-[120px]">
          {submitText}
        </Button>
      </div>

      <CompleteModal
        isOpen={isSuccessModalOpen}
        onClose={onSuccessNavigate}
        message={successMessage}
      />

      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={cancelLeave}
        onConfirm={confirmLeave}
        message={`저장되지 않았습니다.\n정말 뒤로 가시겠습니까?`}
      />
    </div>
  );
}

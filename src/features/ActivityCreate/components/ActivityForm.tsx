'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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

import { DEFAULT_IMAGE_RULES } from '../utils/image';
import { hasOverlappedSchedules, isInvalidSchedule } from '../utils/schedule';
import { buildUpdatePayload } from '../utils/updatePayload';
import { useLeaveGuard } from '../hooks/useLeaveGuard';

import type { ActivityDetailForEdit, Mode, Schedule } from '../type';

/** 드롭다운(컴포넌트) 값 -> API category 문자열 */
const CATEGORY_TO_API: Record<ActivityCategory, string> = {
    culture: '문화 · 예술',
    food: '식음료',
    sports: '스포츠',
    tour: '투어',
    sightseeing: '관광',
    wellbeing: '웰빙',
};

/** API category 문자열 -> 드롭다운 값(역매핑) */
const API_TO_CATEGORY: Record<string, ActivityCategory> = Object.fromEntries(
    Object.entries(CATEGORY_TO_API).map(([k, v]) => [v, k as ActivityCategory])
) as Record<string, ActivityCategory>;

type Props = {
    mode: Mode;

    // edit에서만
    initialData?: ActivityDetailForEdit;

    submitText: string;
    successMessage: string;

    uploadImage: (file: File) => Promise<string>;

    onSubmitCreate: (payload: {
        title: string;
        category: string;
        description: string;
        address: string;
        price: number;
        schedules: { date: string; startTime: string; endTime: string }[];
        bannerImageUrl: string;
        subImageUrls: string[];
    }) => Promise<unknown>;

    onSubmitEdit: (args: {
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
    }) => Promise<unknown>;

    onSuccessNavigate: () => void;
};

export default function ActivityForm({
    mode,
    initialData,
    submitText,
    successMessage,
    uploadImage,
    onSubmitCreate,
    onSubmitEdit,
    onSuccessNavigate,
}: Props) {
    const isEdit = mode === 'edit';

    /** ---------------------------
     *  초기값 세팅 (edit)
     * -------------------------- */
    const initialSnapshot = useMemo(() => {
        if (!isEdit || !initialData) return null;

        return {
            title: initialData.title ?? '',
            category: API_TO_CATEGORY[initialData.category] ?? undefined,
            description: initialData.description ?? '',
            price: initialData.price ?? 0,
            address: initialData.address ?? '',
            bannerImageUrl: initialData.bannerImageUrl ?? '',
            schedules: (initialData.schedules ?? []).map((s) => ({
                id: s.id,
                date: s.date,
                startTime: s.startTime,
                endTime: s.endTime,
            })),
            subImages: initialData.subImages ?? [],
        };
    }, [isEdit, initialData]);

    /** ---------------------------
     *  기본 정보
     * -------------------------- */
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<ActivityCategory | undefined>(undefined);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [address, setAddress] = useState('');

    /** ---------------------------
     *  스케줄
     * -------------------------- */
    const [draftSchedule, setDraftSchedule] = useState<Schedule>({
        date: '',
        startTime: '',
        endTime: '',
    });
    const [schedules, setSchedules] = useState<Schedule[]>([]);

    /** ---------------------------
     *  배너
     * -------------------------- */
    const [existingBannerUrl, setExistingBannerUrl] = useState(''); // edit: 기존 url
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    /** ---------------------------
     *  소개 이미지(서브)
     * -------------------------- */
    const [existingSubImages, setExistingSubImages] = useState<Array<{ id: number; imageUrl: string }>>([]);
    const [removedSubImageIds, setRemovedSubImageIds] = useState<number[]>([]);
    const [newSubImageFiles, setNewSubImageFiles] = useState<File[]>([]);

    /** ---------------------------
     *  UI/검증 상태
     * -------------------------- */
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    /** ---------------------------
     *  “변경 감지” (leave guard)
     * -------------------------- */
    const isDirty = useMemo(() => {
        if (!isEdit || !initialSnapshot) {
            // create: 뭐라도 입력되면 dirty
            return (
                title.trim() !== '' ||
                Boolean(category) ||
                description.trim() !== '' ||
                price !== '' ||
                address.trim() !== '' ||
                schedules.length > 0 ||
                Boolean(bannerFile) ||
                newSubImageFiles.length > 0
            );
        }

        // edit: 스냅샷 비교 (간단 비교)
        const bannerChanged = Boolean(bannerFile) || existingBannerUrl !== initialSnapshot.bannerImageUrl;

        const subRemovedChanged = removedSubImageIds.length > 0;
        const subAddedChanged = newSubImageFiles.length > 0;

        const scheduleChanged = (() => {
            const a = [...schedules].sort((x, y) => (x.id ?? 0) - (y.id ?? 0));
            const b = [...initialSnapshot.schedules].sort((x, y) => (x.id ?? 0) - (y.id ?? 0));

            if (a.length !== b.length) return true;

            return a.some((s, idx) => {
                const o = b[idx];
                if (!o) return true;
                return s.id !== o.id || s.date !== o.date || s.startTime !== o.startTime || s.endTime !== o.endTime;
            });
        })();

        // price는 create처럼 ''가 없고 edit은 number만 들어오도록 초기주입함(아래 useEffect)
        return (
            title !== initialSnapshot.title ||
            category !== initialSnapshot.category ||
            description !== initialSnapshot.description ||
            Number(price) !== initialSnapshot.price ||
            address !== initialSnapshot.address ||
            bannerChanged ||
            subRemovedChanged ||
            subAddedChanged ||
            scheduleChanged
        );
    }, [
        isEdit,
        initialSnapshot,
        title,
        category,
        description,
        price,
        address,
        schedules,
        bannerFile,
        existingBannerUrl,
        removedSubImageIds,
        newSubImageFiles,
    ]);

    // leave guard: confirm() 제거하고 CancelModal 띄우기
    const allowLeave = useLeaveGuard({
        enabled: isDirty && !isSubmitting,
        onAttemptLeave: () => {
            setIsCancelModalOpen(true);
        },
    });

    const confirmLeave = () => {
        allowLeave();
        setIsCancelModalOpen(false);

        history.go(-2);
    };

    const cancelLeave = () => {
        setIsCancelModalOpen(false);
    };

    /** edit 초기 주입 */
    useEffect(() => {
        if (!isEdit || !initialData || !initialSnapshot) return;

        setTitle(initialSnapshot.title);
        setCategory(initialSnapshot.category);
        setDescription(initialSnapshot.description);

        // edit은 기존값 number로 주입 (placeholder가 아니라 값이 보여야 하니까)
        setPrice(initialSnapshot.price);

        setAddress(initialSnapshot.address);

        setSchedules(initialSnapshot.schedules);
        setDraftSchedule({ date: '', startTime: '', endTime: '' });

        setExistingBannerUrl(initialSnapshot.bannerImageUrl);
        setBannerFile(null);

        setExistingSubImages(initialSnapshot.subImages);
        setRemovedSubImageIds([]);
        setNewSubImageFiles([]);
    }, [isEdit, initialData, initialSnapshot]);

    /** ---------------------------
     * 주소 검색(다음)
     * -------------------------- */
    const openPostcode = useDaumPostcodePopup();

    const onSearchAddress = useCallback(() => {
        openPostcode({
            onComplete: (data) => {
                const fullAddress = data.roadAddress || data.address;
                setAddress(fullAddress);
            },
        });
    }, [openPostcode]);

    /** edit: 기존 서브이미지 토글 제거 */
    const toggleRemoveExistingSub = (id: number) => {
        setRemovedSubImageIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    /** ---------------------------
     * 검증 규칙
     * -------------------------- */
    const categoryApi = category ? CATEGORY_TO_API[category] : '';

    const bannerRequiredError = submitted && !bannerFile && !existingBannerUrl;

    const scheduleSubmitError =
        submitted &&
        (schedules.length === 0 ||
            schedules.some(isInvalidSchedule) ||
            hasOverlappedSchedules(schedules));

    const basicRequiredError =
        submitted &&
        (title.trim() === '' ||
            !category ||
            description.trim() === '' ||
            address.trim() === '' ||
            price === '' ||
            Number(price) <= 0);

    /** ---------------------------
     * submit
     * -------------------------- */
    const handleSubmit = async () => {
        setSubmitted(true);

        if (basicRequiredError || bannerRequiredError || scheduleSubmitError) return;

        try {
            setIsSubmitting(true);

            // 1) 배너 업로드 결정
            let bannerImageUrl = existingBannerUrl;
            if (bannerFile) {
                bannerImageUrl = await uploadImage(bannerFile);
            }

            // 2) 새 서브 이미지 업로드
            const subImageUrlsToAdd = await Promise.all(newSubImageFiles.map(uploadImage));

            if (!isEdit) {
                await onSubmitCreate({
                    title: title.trim(),
                    category: categoryApi,
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

                setIsSuccessModalOpen(true);
                return;
            }

            // edit
            if (!initialData) throw new Error('초기 데이터가 없습니다.');

            const payload = buildUpdatePayload({
                currentSchedules: schedules,
                original: initialData,
                subImageIdsToRemove: removedSubImageIds,
                subImageUrlsToAdd,
                bannerImageUrl,
                title: title.trim(),
                category: categoryApi,
                description: description.trim(),
                price: Number(price),
                address: address.trim(),
            });

            await onSubmitEdit({
                activityId: initialData.id,
                payload,
            });

            setIsSuccessModalOpen(true);
        } catch (e) {
            const msg = e instanceof Error ? e.message : '요청 실패';
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
        onSuccessNavigate();
    };

    return (
        <div className="flex flex-col gap-6 min-w-[700px] mx-auto">
            <Input
                label="제목"
                placeholder="제목을 입력해 주세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={submitted && title.trim() === '' ? ' ' : undefined}
            />

            <div className="flex flex-col gap-2">
                <p className="text-body-lg font-bold">카테고리</p>
                <ActivitiesCategoryDropdown
                    value={category}
                    onChange={(v) => setCategory(v)}
                    error={submitted && !category}
                />
            </div>

            <Input
                label="설명"
                placeholder="체험에 대한 설명을 입력해 주세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                className="min-h-[200px] align-top leading-normal"
                error={submitted && description.trim() === '' ? ' ' : undefined}
            />

            <Input
                label="가격"
                placeholder="체험 금액을 입력해 주세요"
                type="number"
                value={price}
                onChange={(e) => {
                    const v = e.target.value;
                    setPrice(v === '' ? '' : Number(v));
                }}
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                error={submitted && (price === '' || Number(price) <= 0) ? ' ' : undefined}
            />

            <Input
                label="주소"
                placeholder="주소를 입력해 주세요"
                value={address}
                readOnly
                onClick={onSearchAddress}
                error={submitted && address.trim() === '' ? ' ' : undefined}
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
                onChange={setBannerFile}
                onClearExisting={() => setExistingBannerUrl('')}
                requiredError={bannerRequiredError}
                maxBytes={DEFAULT_IMAGE_RULES.maxBytes}
            />

            <SubImagesField
                value={newSubImageFiles}
                onChange={setNewSubImageFiles}
                maxBytes={DEFAULT_IMAGE_RULES.maxBytes}
                maxCount={4}
                existing={isEdit ? existingSubImages : undefined}
                removedExistingIds={isEdit ? removedSubImageIds : undefined}
                onToggleRemoveExisting={isEdit ? toggleRemoveExistingSub : undefined}
            />

            <div className="flex justify-center">
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-[120px]"
                >
                    {isSubmitting ? '처리 중...' : submitText}
                </Button>
            </div>

            <CompleteModal
                isOpen={isSuccessModalOpen}
                onClose={closeSuccessModal}
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

'use client';

/**
 * 내 체험 등록 페이지
 */

import { useState } from 'react';
import Input from '@/src/components/Input/Input';
import Button from '@/src/components/Button/Button';
import ActivitiesCategoryDropdown, { ActivityCategory } from '@/src/components/Dropdown/ActivitiesCategoryDropdown';
import { uploadActivityImage, createActivity } from '@/src/api/activities';
import { useRouter } from 'next/navigation';

/**
 * 타입 정의
 */
type Schedule = {
  date: string;
  startTime: string;
  endTime: string;
}

export default function ActivityCreatePage() {
  const router = useRouter();

  /**
   * 기본 입력 필드 상태
   */
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>();
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');

  /**
   * 예약 가능 시간대 정의
   */
  const [schedules, setSchedules] = useState<Schedule[]>([
    { date: '', startTime: '', endTime: '' },
  ]);

  /**
   * 이미지 상태
   */
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);

  /**
   * 로딩 / 에러 상태
   */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * 예약 시간대 추가
   */
  const handleAddSchedule = () => {
    setSchedules((prev) => [
      ...prev,
      { date: '', startTime: '', endTime: '' },
    ]);
  };

  /**
   * 예약 시간대 제거
   */
  const handleRemoveSchedule = (index: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * 예약 시간대 값 변경
   */
  const handleScheduleChange = (
    index: number,
    key: keyof Schedule,
    value: string
  ) => {
    setSchedules((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [key]: value } : item)
    )
  };

  /**
   * 체험 등록 버튼 클릭시 로직
   * 
   * 서버로 보내기 전 필수값 검증
   * 이미지 업로드 및 URL 변환
   * 체험 등록 API 추출
   */
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      if (!bannerImage) {
        setErrorMessage('배너 이미지는 필수입니다.');
        return
      }

      // 배너 이미지 업로드
      const bannerImageUrl = await uploadActivityImage(bannerImage);

      // 서브 이미지 업로드
      const subImageUrls = await Promise.all(
        subImages.map((file) => uploadActivityImage(file))
      );

      // 체험 등록 API 호출
      await createActivity({
        title,
        category: category!,
        description,
        address,
        price: Number(price),
        schedules,
        bannerImageUrl,
        subImageUrls,
      });

      // 라우터 추가
    } catch (error: any) {
      setErrorMessage(error.message || '체험 등록 중 오류 발생');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>내 체험 등록</h1>

      <Input
        label="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력해 주세요"
      />

      <ActivitiesCategoryDropdown
        value={category}
        onChange={setCategory}
        className="mt-4"
      />

      <Input
        label="체험 설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="체험에 대한 설명을 입력해 주세요"
        className="mt-4"
      />

      <Input
        label="가격"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="체험 금액을 입력해 주세요"
        className="mt-4"
      />

      <Input
        label="주소"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="주소를 입력해 주세요"
        className="mt-4"
      />

      {/* 예약 시간대 UI 미완성 테스트 */}
      <div className="mt-6">
        <h2>예약 가능 시간대</h2>
        {schedules.map((schedule, index) => (
          <div key={index}>
            <Input
              type="date"
              value={schedule.date}
              onChange={(e) =>
                handleScheduleChange(index, 'date', e.target.value)
              }
            />
            <Input
              type="time"
              value={schedule.startTime}
              onChange={(e) =>
                handleScheduleChange(index, 'startTime', e.target.value)
              }
            />
            <Input
              type="time"
              value={schedule.endTime}
              onChange={(e) =>
                handleScheduleChange(index, 'endTime', e.target.value)
              }
            />
            <Button onClick={() => handleRemoveSchedule(index)}>삭제</Button>
          </div>
        ))}
        <Button onClick={handleAddSchedule}>+ 시간 추가</Button>
      </div>

      {errorMessage && (
        <p className="text-red-500 mt-4">{errorMessage}</p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-6 w-full bg-black text-white py-3"
      >
        {isSubmitting ? '등록 중...' : '체험 등록'}
      </Button>
    </div>
  )

}
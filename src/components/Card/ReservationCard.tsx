'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CardBase from '@/src/components/Card/CardBase';
import StatusBadge, { type ReservationStatus } from '@/src/components/Card/StatusBadge';
import Button from '@/src/components/Button/Button';
import CancelModal from '@/src/components/Modal/CancelModal';
import ReviewModal from '@/src/components/Modal/ReviewModal';
import DefaultThumbnail from '@/assets/activity-default-thumbnail.svg';

interface ReservationCardProps {
  id: number;
  activity: {
    id: number;
    title: string;
    bannerImageUrl?: string;
  };
  status?: ReservationStatus;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  onCancel?: (id: number) => void;
  onReview?: (id: number) => void;
}

export default function ReservationCard({
  id,
  activity,
  status = 'confirmed',
  totalPrice = 0,
  headCount = 0,
  date,
  startTime,
  endTime,
  onCancel,
  onReview,
}: ReservationCardProps) {
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);


  const handleEdit = () => {
    router.push(`/activities/${activity.id}`);    // 체험 상세 페이지에서 예약 변경
  }

  const handleCancel = () => {
    setIsCancelModalOpen(true);    // 취소 confirm 모달 호출
  }

  const handleConfirmCancel = () => {
    // TODO: API 연동 시 예약 취소 로직 추가 예정
    onCancel?.(id);
    setIsCancelModalOpen(false);
  }

  const handleCloseCancel = () => {
    setIsCancelModalOpen(false);
  }

  const handleReview = () => {
    setIsReviewModalOpen(true);    // 후기 작성 모달 호출
  }

  const handleCloseReview = () => {
    setIsReviewModalOpen(false);
  }

  const handleSubmitReview = (rating: number, content: string) => {
    // TODO: API 연동 시 리뷰 작성 로직 추가 예정
    onReview?.(id);
    setIsReviewModalOpen(false);
  }

  return (
    <>
      <CardBase className="max-w-[640px] group">
        <div className="flex justify-between">
          <CardBase
            width="flex-1"
            height={false}
            boxShadow='sm'
            className="flex flex-col justify-between -mr-[26px] px-[40px] py-[30px] z-10">

            {/* 텍스트 영역 */}
            <div className="flex flex-col">
              <StatusBadge status={status} className="mb-[12px]" />
              <Link href={`/activities/${activity.id}`} className="block">
                <div className="flex flex-col">
                  <div className="text-h4 font-bold leading-6">{activity.title}</div>
                  <div className="flex">
                    <span className="text-gray-500 text-body leading-6">{date}</span>
                    <span className="mx-[8px] text-gray-500 text-body leading-6">·</span>
                    <span className="text-gray-500 text-body leading-6">{startTime} - {endTime}</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* 가격·버튼 영역 */}
            <div className="h-[29px] flex items-center justify-between">
              <div>
                <span className="mr-[4px] text-h4 font-bold leading-6">₩ {totalPrice.toLocaleString()}</span>
                <span className="text-gray-400 text-body-lg leading-6">/{' '}{headCount}명</span>
              </div>

              {/* 예약 상태별 버튼 분기 */}
              <div className="flex justify-end items-center gap-2">
                {status === 'confirmed' && (
                  <>
                    <Button
                      onClick={handleEdit}
                      baseStyles="px-[10px] py-[6px] outline outline-1 outline-offset-[-1px] outline-gray-100 text-body text-gray-600 rounded-lg cursor-pointer hover:bg-gray-25 transition-colors duration-150"
                    >
                      예약 변경
                    </Button>
                    <Button
                      onClick={handleCancel}
                      baseStyles="px-[10px] py-[6px] bg-gray-100 text-body text-gray-600 rounded-lg cursor-pointer hover:bg-gray-200 hover:text-gray-700 transition-colors duration-150"
                    >
                      예약 취소
                    </Button>
                  </>
                )}
                {status === 'completed' && (
                  <Button
                    onClick={handleReview}
                    baseStyles="px-[10px] py-[6px] bg-primary-500 text-body text-white rounded-lg cursor-pointer hover:bg-blue-500 transition-colors duration-150"
                  >
                    후기 작성
                  </Button>
                )}
              </div>
            </div>
          </CardBase>

          {/* 이미지 영역 */}
          <Link href={`/activities/${activity.id}`} className="block">
            <div className="w-[200px] h-[200px] bg-gray-100 relative overflow-hidden">
              {activity.bannerImageUrl ? (
                <Image
                  src={activity.bannerImageUrl}
                  alt={`${activity.title} 체험 썸네일 이미지`}
                  fill
                  className="object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
                  sizes="200px"
                />
              ) : (
                <DefaultThumbnail
                  aria-label="체험 썸네일 이미지"
                  className="w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                  preserveAspectRatio="xMidYMid slice"
                />
              )}
            </div>
          </Link>
        </div>
      </CardBase>

      {/* 취소 모달 */}
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={handleCloseCancel}
        onConfirm={handleConfirmCancel}
        message="예약을 취소하시겠습니까?"
      />

      {/* 후기 모달 */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReview}
        onSubmit={handleSubmitReview}
        title={activity.title}    // 체험명
        subtitle={`${date} · ${startTime} - ${endTime}`}    // 날짜·시간
      />
    </>
  )
};

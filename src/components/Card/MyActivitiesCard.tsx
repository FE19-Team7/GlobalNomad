'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CardBase from '@/src/components/Card/CardBase';
import Button from '@/src/components/Button/Button'
import DeleteModal from '@/src/components/Modal/DeleteModal'
import DefaultThumbnail from '@/assets/activity-default-thumbnail.svg';
import StarIcon from '@/assets/icon_star.svg';

interface MyActivitiesCardProps {
  activity: {
    id: number;
    title: string;
    rating: number;
    reviewCount: number;
    price: number;
    bannerImageUrl?: string;
    onDelete?: (id: number) => void | Promise<void>;
  }
}

export default function MyActivitiesCard({
  activity: {
    id,
    title,
    rating = 0,
    reviewCount = 0,
    price = 0,
    bannerImageUrl,
    onDelete,
  }
}: MyActivitiesCardProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/activities/${id}/edit`);    // 체험 수정 페이지로 이동
  };

  const handleDelete = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(true);    // 삭제 confirm 모달 열기
  }

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await onDelete?.(id); // 페이지에서 실제 삭제 + state 갱신
      setIsDeleteModalOpen(false); // 성공 후 닫기
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDelete = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);    // 모달 닫기 (삭제 안 함)
  }

  return (
    <>
      <CardBase
        height={false}
        className="max-w-[640px] min-h-[200px] flex p-[30px] justify-between gap-[30px] group"
      >

        {/* 텍스트 영역 */}
        <div className="w-full max-w-[550px] flex flex-col gap-5">
          <Link href={`/activities/${id}`} className="block">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <div className="text-h4 font-bold leading-6">{title}</div>
                <div className="flex gap-[2px]">
                  <StarIcon aria-label="별점" className="w-[20px] h-[20px]" />
                  <span className="ml-[3px] text-body leading-6">{rating}</span>
                  <span className="text-gray-400 text-body leading-6">({reviewCount.toLocaleString()})</span>
                </div>
              </div>
              <div>
                <span className="mr-[4px] text-h4 font-bold leading-6">₩ {price.toLocaleString()}</span>
                <span className="text-gray-400 text-body-lg leading-6">/{' '}인</span>
              </div>
            </div>
          </Link>

          {/* 버튼 영역 */}
          <div className="flex items-center gap-[8px]">
            <Button
              onClick={handleEdit}
              disabled={isDeleting}
              baseStyles="px-[10px] py-[6px] outline outline-1 outline-offset-[-1px] outline-gray-100 text-body text-gray-600 rounded-lg cursor-pointer hover:bg-gray-25 transition-colors duration-150
                          disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            >
              수정하기
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              baseStyles="px-[10px] py-[6px] bg-gray-100 text-body text-gray-600 rounded-lg cursor-pointer hover:bg-gray-200 hover:text-gray-700 transition-colors duration-150
                          disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-600"
            >
              삭제하기
            </Button>
          </div>
        </div>

        {/* 이미지 영역 */}
        <Link href={`/activities/${id}`} className="block self-center">
          <div className="w-[142px] h-[142px] flex-shrink-0 relative rounded-[32px] overflow-hidden bg-gray-100">
            {bannerImageUrl ? (
              <Image
                src={bannerImageUrl}
                alt={`${title} 체험 썸네일 이미지`}
                fill
                className="object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
                sizes="142px"
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
      </CardBase>

      {/* 삭제 모달 */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        message="체험을 삭제하시겠습니까?"
      />
    </>
  )
};

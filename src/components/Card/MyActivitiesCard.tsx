'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CardBase from '@/src/components/Card/CardBase';
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
    onDelete?: (id: number) => void;
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

  const handleEdit = () => {
    router.push(`/seller/activities/${id}/edit`);    // 체험 수정 페이지로 이동
  };

  const handleDelete = () => {
    onDelete?.(id);    // 삭제 confirm 모달 호출
  }

  return (
    <Link href={`/activities/${id}`} className="inline-block group">
      <CardBase
        rounded="lg"
        boxShadow="md"
        overflow={false}
        className="max-width-[640px] min-w-[327px] max-width-[202px] min-h-[159px]"
      >
        <div className="flex p-[30px] justify-between">
          <div className="w-76 flex flex-col gap-5">
            {/* 텍스트 영역 */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <div className="text-lg font-semibold leading-6">{title}</div>
                <div className="flex gap-[2px]">
                  <StarIcon aria-label="별점" className="w-[20px] h-[20px]" />
                  <span className="ml-[3px] text-sm leading-6">{rating}</span>
                  <span className="text-gray-400 text-sm leading-6">({reviewCount.toLocaleString()})</span>
                </div>
              </div>
              <div>
                <span className="mr-[4px] text-lg font-bold leading-6">₩ {price.toLocaleString()}</span>
                <span className="text-gray-400 text-base leading-6">/{' '}인</span>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex items-center gap-[8px]">
              {/* TODO: 버튼 컴포넌트로 교체 예정 */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEdit();
                }}
                className="px-[10px] py-[6px] outline outline-1 outline-offset-[-1px] outline-gray-100 text-sm text-gray-600 rounded-lg cursor-pointer hover:bg-gray-25 hover:text-gray-700 transition-colors duration-150"
              >
                수정하기
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                className="px-[10px] py-[6px] bg-gray-100 text-sm text-gray-600 rounded-lg cursor-pointer hover:bg-gray-200 hover:text-gray-700 transition-colors duration-150"
              >
                삭제하기
              </button>
            </div>
          </div>

          {/* 이미지 영역 */}
          <div className="w-[142px] h-[142px] relative rounded-[32px] overflow-hidden bg-gray-100">
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
        </div>
      </CardBase>
    </Link>
  )
};

import Link from 'next/link';
import Image from 'next/image';
import DefaultThumbnail from '@/assets/activity-default-thumbnail.svg';

type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'declined' | 'completed';

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
}

export default function ReservationCard({
  id,
  activity,
  status,
  totalPrice = 0,
  headCount = 0,
  date,
  startTime,
  endTime,
}: ReservationCardProps) {
  return (
    <div className="w-[600px] h-[200px] flex justify-between overflow-hidden rounded-[32px] shadow-[0px_4px_24px_0px_rgba(156,180,202,0.20)]">
      <div className="w-[423px] grid content-between -mr-[26px] px-[40px] py-[30px] bg-white rounded-[32px] shadow-[0px_-8px_20px_0px_rgba(0,0,0,0.05)] z-10">
        <div className="flex flex-col justify-between">
          {/* TODO: StatusBadge 컴포넌트로 교체 */}
          <div className="w-[63px] h-[24px] flex justify-center items-center mb-[12px] bg-green-100 text-xs text-center font-bold text-lime-700 rounded-[100px]">예약 완료</div>

          <Link href={`/activities/${activity.id}`} className="block group">
            <div className="flex flex-col">
              <div className="text-lg font-semibold leading-6">{activity.title}</div>
              <div className="flex">
                <span className="text-gray-500 text-sm leading-6">{date}</span>
                <span className="mx-[8px] text-gray-500 text-sm leading-6">·</span>
                <span className="text-gray-500 text-sm leading-6">{startTime} - {endTime}</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="h-[29px] flex items-center justify-between">
          <div>
            <span className="mr-[4px] text-lg font-bold leading-6">₩ {totalPrice.toLocaleString()}</span>
            <span className="text-gray-400 text-base leading-6">/{' '}{headCount}명</span>
          </div>

          {/* 예약 상태별 버튼 분기 */}
          <div className="flex justify-end items-center gap-[8px]">
            {status === 'confirmed' && (
              <>
                <button className="px-[10px] py-[6px] outline outline-1 outline-offset-[-1px] outline-gray-100 text-sm rounded-lg">예약 취소</button>
                <button className="px-[10px] py-[6px] bg-gray-100 text-sm rounded-lg">예약 변경</button>
              </>
            )}
            {status === 'completed' && (
              <button className="px-[10px] py-[6px] bg-primary-500 text-sm text-white rounded-lg">후기 작성</button>
            )}
          </div>
        </div>
      </div>
      <Link href={`/activities/${activity.id}`} className="block group">
        <div className="w-[200px] h-[200px] bg-gray-100 overflow-hidden z-0">
          {activity.bannerImageUrl ? (
            <Image
              src={activity.bannerImageUrl}
              alt={`${activity.title} 체험 썸네일 이미지`}
              className="object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
              sizes="262px"
              priority={false}
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
  )
};

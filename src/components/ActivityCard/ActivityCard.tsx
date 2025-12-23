import DefaultThumbnail from '@/assets/activity-default-thumbnail.svg';
import StarIcon from '@/assets/icon_star.svg';
import Link from 'next/link';

export default function ActivityCard() {
  return (
    <div className="w-[262px]">
      <Link
        href="/activities/{activityId}"
        className="flex flex-col overflow-hidden rounded-[32px] shadow-[0px_-8px_20px_0px_rgba(0,0,0,0.05)]"
      >
        <div className="w-full h-[290px] overflow-hidden bg-gray-100">
          <DefaultThumbnail aria-label="체험 썸네일 이미지" className="w-full h-full" preserveAspectRatio="xMidYMid slice" />
        </div>
        <div className="flex flex-col -mt-[60px] px-[20px] py-[30px] gap-[18px] bg-white rounded-[32px] shadow-[0px_-8px_20px_0px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col">
            <div className="text-lg font-semibold leading-6">title</div>
            <div className="flex gap-[2px]">
              <StarIcon aria-label="별점 아이콘" className="w-[20px] h-[20px]" />
              <span className="ml-[3px] text-sm leading-6">4.9</span>
              <span className="text-gray-400 text-sm leading-6">(254)</span>
            </div>
          </div>
          <div>
            <span className="text-lg font-bold leading-6">₩ 25,000</span>
            <span className="text-gray-400 font-semibold text-base leading-6"> / 인</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

import Link from 'next/link';
import DefaultThumbnail from '@/assets/activity-default-thumbnail.svg';
import StarIcon from '@/assets/icon_star.svg';

export default function MyActivitiesCard() {
  return (
    <div className="w-[600px] h-[200px]">
      <Link href={`/activities/{id}`} className="block group">
        <div className="flex p-[30px] justify-between rounded-3xl shadow-[0px_4px_24px_0px_rgba(156,180,202,0.20)]">
          <div className="w-76 flex flex-col gap-5 rounded-[32px]">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <div className="text-lg font-semibold leading-6">동해 해돋이 방구석 직관</div>
                <div className="flex gap-[2px]">
                  <StarIcon aria-label="별점 아이콘" className="w-[20px] h-[20px]" />
                  <span className="ml-[3px] text-sm leading-6">4.9</span>
                  <span className="text-gray-400 text-sm leading-6">(20)</span>
                </div>
              </div>
              <div>
                <span className="mr-[4px] text-lg font-bold leading-6">₩ 10,000</span>
                <span className="text-gray-400 text-base leading-6">/{' '}인</span>
              </div>
            </div>
            <div className="flex items-center gap-[8px]">
              <button className="px-[10px] py-[6px] outline outline-1 outline-offset-[-1px] outline-gray-100 text-sm text-gray-600 rounded-lg">수정하기</button>
              <button className="px-[10px] py-[6px] bg-gray-100 text-sm text-gray-600 rounded-lg">삭제하기</button>
            </div>
          </div>
          <div className="w-36 h-36 flex justify-center items-center rounded-[32px] overflow-hidden bg-gray-100">
            <DefaultThumbnail
              aria-label="체험 썸네일 이미지"
              className="transition-transform duration-300 ease-in-out group-hover:scale-105"
              preserveAspectRatio="xMidYMid slice"
            />
          </div>
        </div>
      </Link >
    </div >
  )
};

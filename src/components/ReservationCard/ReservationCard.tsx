import Link from 'next/link';
import DefaultThumbnail from '@/assets/activity-default-thumbnail.svg';

export default function ReservationCard() {
  return (
    <div className="justify-center items-center p-10">
      <Link href={`/activities/{id}`} className="block group">
        <div className="w-[600px] h-[200px] flex justify-between overflow-hidden rounded-[32px] shadow-[0px_-8px_20px_0px_rgba(0,0,0,0.2)]">
          <div className="w-[423px] grid content-between -mr-[26px] px-[40px] py-[30px] bg-white rounded-[32px] shadow-[0px_-8px_20px_0px_rgba(0,0,0,0.05)] z-10">
            <div className="flex flex-col justify-between">
              <div className="w-[63px] h-[24px] flex justify-center items-center mb-[12px] bg-green-100 text-xs text-center font-bold text-lime-700 rounded-[100px]">예약 완료</div>
              <div className="flex flex-col">
                <div className="text-lg font-semibold leading-6">동해 해돋이 방구석 직관</div>
                <div className="flex">
                  <span className="text-gray-500 text-sm leading-6">2026.12.25</span>
                  <span className="mx-[8px] text-gray-500 text-sm leading-6">·</span>
                  <span className="text-gray-500 text-sm leading-6">12:30 - 13:30</span>
                </div>
              </div>
            </div>
            <div className="h-[29px] flex items-center justify-between">
              <div>
                <span className="mr-[4px] text-lg font-bold leading-6">₩ 25,000</span>
                <span className="text-gray-400 text-base leading-6">/{' '}1명</span>
              </div>
              <div className="flex justify-end items-center gap-[8px]">
                <button className="px-[10px] py-[6px] outline outline-1 outline-offset-[-1px] outline-gray-100 text-sm rounded-lg">예약 취소</button>
                <button className="px-[10px] py-[6px] bg-gray-100 text-sm rounded-lg">예약 변경</button>
              </div>
            </div>
          </div>
          <div className="w-[200px] h-[200px] bg-gray-100 overflow-hidden z-0">
            <DefaultThumbnail
              aria-label="체험 썸네일 이미지"
              className="w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
              preserveAspectRatio="xMidYMid slice"
            />
          </div>
        </div>
      </Link>
    </div>
  )
};

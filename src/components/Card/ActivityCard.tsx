import Link from 'next/link';
import Image from 'next/image';
import DefaultThumbnail from '@/assets/activity-default-thumbnail.svg';
import StarIcon from '@/assets/icon_star.svg';

interface ActivityCardProps {
  id: number;
  title: string;
  rating: number;
  reviewCount: number;
  price: number;
  bannerImageUrl?: string;
}

export default function ActivityCard({
  id,
  title,
  rating = 0,
  reviewCount = 0,
  price = 0,
  bannerImageUrl,
}: ActivityCardProps) {

  return (
    <div className="w-[262px] w-max-[332px]">
      <Link href={`/activities/${id}`} className="block group">
        <div className="overflow-hidden rounded-[32px] shadow-[0px_-8px_20px_0px_rgba(0,0,0,0.2)]">
          <div className="relative w-full h-[290px] bg-gray-100 overflow-hidden z-0">
            {bannerImageUrl ? (
              <Image
                src={bannerImageUrl}
                alt={`${title} 체험 썸네일 이미지`}
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
          <div className="relative flex flex-col -mt-[60px] px-[20px] py-[30px] gap-[18px] bg-white rounded-[32px] shadow-[0px_-8px_20px_0px_rgba(0,0,0,0.05)] z-10">
            <div className="flex flex-col">
              <div className="text-lg font-semibold leading-6">{title}</div>
              <div className="flex gap-[2px]">
                <StarIcon aria-label="별점" className="w-[20px] h-[20px]" />
                <span className="ml-[3px] text-sm leading-6">{rating} </span>
                <span className="text-gray-400 text-sm leading-6">({reviewCount.toLocaleString()})</span>
              </div>
            </div>
            <div>
              <span className="text-lg font-bold leading-6">₩ {price.toLocaleString()}</span>
              <span className="text-gray-400 font-semibold text-base leading-6">{' '}/ 인</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

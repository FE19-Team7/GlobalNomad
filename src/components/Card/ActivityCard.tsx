import Link from 'next/link';
import Image from 'next/image';
import CardBase from '@/src/components/Card/CardBase';
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
    <div className="max-w-[332px]">
      <Link href={`/activities/${id}`} className="block group">
        <CardBase
          width="w-full"
          height="h-auto"
        >

          {/* 이미지 영역 */}
          <div className="relative w-full h-[290px] bg-gray-100">
            {bannerImageUrl ? (
              <Image
                src={bannerImageUrl}
                alt={`${title} 체험 썸네일 이미지`}
                fill
                className="object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
                sizes="262px"
              />
            ) : (
              <DefaultThumbnail
                aria-label="체험 썸네일 이미지"
                className="w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                preserveAspectRatio="xMidYMid slice"
              />
            )}
          </div>

          {/* 텍스트 영역 */}
          <CardBase
            boxShadow="sm"
            rounded="lg"
            overflow={false}
            className="-mt-[60px] relative"
          >
            <div className="flex flex-col px-[30px] py-[20px] gap-[18px]">
              <div className="flex flex-col min-w-0">
                <div className="text-h4 font-bold leading-6 truncate">{title}</div>
                <div className="flex gap-[2px]">
                  <StarIcon aria-label="별점" className="w-[20px] h-[20px]" />
                  <span className="ml-[3px] text-body leading-6">{rating}</span>
                  <span className="text-gray-400 text-body leading-6">({reviewCount.toLocaleString()})</span>
                </div>
              </div>
              <div>
                <span className="text-h4 font-bold leading-6">₩ {price.toLocaleString()}</span>
                <span className="text-gray-400 text-body-lg leading-6">{' '}/ 인</span>
              </div>
            </div>
          </CardBase>
        </CardBase>
      </Link>
    </div>
  );
}

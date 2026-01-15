'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Reservation from '@/src/components/Reservation/Reservation';
import { Pagination } from '@/src/components/Pagination/Pagination';
import { ActivityData } from '@/src/types/activityType';
import { Review } from '@/src/types/reviewType';
import { getActivityDetail } from '@/src/features/public/services/activities';
import LocationIcon from '@/src/assets/icon_location.svg';
import KebabMenuIcon from '@/src/assets/icon_kebab_menu.svg';
import StarIcon from '@/src/assets/icon_star.svg';

const ActivityDetailPage = () => {
  const params = useParams();
  const activityId = params.activityId as string;
  
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 임시 데이터 (API에 없는 필드)
  const defaultReviews: Review[] = [];

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setIsLoading(true);
        const data = await getActivityDetail(activityId);
        setActivityData(data);
      } catch (err) {
        console.error('API 에러:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityData();
  }, [activityId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-body text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (error || !activityData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-body text-red-600">{error || '데이터를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  // subImages URL 배열로 변환
  const subImageUrls = activityData.subImages?.map(img => img.imageUrl) || [];

  return (
    <div className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          
          {/* 이미지 및 상세 정보 */}
          <div className="space-y-8">
            <ImageGallery 
              bannerImage={activityData.bannerImageUrl}
              images={subImageUrls}
            />
            <DescriptionSection description={activityData.description} />
            <LocationSection 
              address={activityData.address}
            />
            <ReviewSection 
              rating={activityData.rating}
              reviewCount={activityData.reviewCount}
              reviews={defaultReviews}
            />
          </div>
          
          {/* 제목 + 예약 달력 */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-body text-gray-600 mb-2">
                  {activityData.category}
                </div>
                <h1 className="text-h4 font-bold text-gray-900 tracking-h4 mb-3">
                  {activityData.title}
                </h1>
                <div className="flex items-center gap-2 text-body text-gray-600 mb-2">
                  <Star filled={true} size="small" />
                  <span className="font-medium">{activityData.rating}</span>
                  <span>({activityData.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-body text-gray-600">
                  <LocationIcon className="w-4 h-4" />
                  <span>{activityData.address}</span>
                </div>
              </div>
              <KebabMenu />
            </div>
            
            <p className="text-body text-gray-700">
              초보자부터 전문가까지 즐거운 체험을 함께 느껴보세요.
            </p>
            
            <ReservationCard 
              activityId={activityData.id.toString()}
              pricePerPerson={activityData.price}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// 케밥 메뉴
const KebabMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleEdit = () => {
    window.location.href = '/my-reservations/1';
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      alert('삭제되었습니다.');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full"
      >
        <KebabMenuIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <button
              onClick={handleEdit}
              className="w-full px-4 py-3 text-left text-body text-gray-900 hover:bg-gray-50 rounded-t-lg"
            >
              수정하기
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-3 text-left text-body text-gray-900 hover:bg-gray-50 rounded-b-lg"
            >
              삭제하기
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// 이미지 갤러리
const ImageGallery = ({ bannerImage, images }: { bannerImage: string | null; images: string[] }) => {
  return (
    <div className="space-y-4">
      <div className="w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden relative">
        {bannerImage ? (
          <Image 
            src={bannerImage} 
            alt="체험 메인 이미지" 
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            체험 등록 이미지 표시 영역
          </div>
        )}
      </div>
      
      {/* 서브 이미지 */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
              <Image 
                src={image} 
                alt={`서브 이미지 ${index + 1}`} 
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 체험 설명
const DescriptionSection = ({ description }: { description: string }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-h3 font-bold text-gray-900 tracking-h3">
        체험 설명
      </h2>
      <div className="p-6 bg-gray-25 rounded-lg">
        <p className="text-body text-gray-700 whitespace-pre-wrap">
          {description}
        </p>
      </div>
    </div>
  );
};

// 오시는 길
const LocationSection = ({ address }: { address: string }) => {
  const mapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;

        // Geocoder 생성
        const geocoder = new window.kakao.maps.services.Geocoder();

        // 주소로 좌표 검색
        geocoder.addressSearch(address, (result: Array<{ x: string; y: string }>, status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(
              parseFloat(result[0].y), 
              parseFloat(result[0].x)
            );

            const options = {
              center: coords,
              level: 3
            };

            const map = new window.kakao.maps.Map(container, options);

            const marker = new window.kakao.maps.Marker({
              position: coords
            });
            marker.setMap(map);
          } else {
            // 주소 검색 실패 시 기본 위치 (서울시청)
            const defaultCoords = new window.kakao.maps.LatLng(37.5665, 126.9780);
            const options = {
              center: defaultCoords,
              level: 3
            };

            const map = new window.kakao.maps.Map(container, options);

            const marker = new window.kakao.maps.Marker({
              position: defaultCoords
            });
            marker.setMap(map);
          }
        });
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [address]);

  return (
    <div className="space-y-4">
      <h2 className="text-h3 font-bold text-gray-900 tracking-h3">
        오시는 길
      </h2>
      <p className="text-body text-gray-600">
        {address}
      </p>
      <div 
        ref={mapRef}
        className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden"
      />
    </div>
  );
};

// 후기 섹션
const ReviewSection = ({ rating, reviewCount, reviews }: { rating: number; reviewCount: number; reviews: Review[] }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const reviewsPerPage = 3;
  
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <div className="space-y-6">
      {/* 후기 헤더 */}
      <div className="flex items-center gap-2">
        <h2 className="text-h3 font-bold text-gray-900 tracking-h3">
          체험 후기
        </h2>
        <span className="text-body font-medium text-gray-600">{reviewCount}개</span>
      </div>

      {/* 평점 정보 */}
      {reviewCount > 0 ? (
        <>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-h1 font-bold text-gray-900 leading-none mb-2">
              {rating}
            </div>
            <div className="text-body-lg font-bold text-gray-900 mb-2">
              매우 만족
            </div>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} filled={star <= Math.round(rating)} size="small" />
                ))}
              </div>
              <span className="text-body font-medium text-gray-600 ml-1">{reviewCount}개 후기</span>
            </div>
          </div>

          {/* 리뷰 목록 */}
          <div className="space-y-3">
            {currentReviews.length > 0 ? (
              currentReviews.map((review) => (
                <div 
                  key={review.id} 
                  className="bg-white rounded-lg p-6"
                  style={{ boxShadow: '0px 4px 24px 0px rgba(156, 180, 202, 0.2)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-body-lg font-bold text-gray-900">{review.author}</span>
                    <span className="text-body text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} filled={star <= review.rating} size="small" />
                    ))}
                  </div>
                  <p className="text-body text-gray-700">{review.content}</p>
                </div>
              ))
            ) : (
              <div className="p-8 bg-gray-25 rounded-lg">
                <p className="text-body text-gray-600 text-center">
                  아직 작성된 리뷰가 없습니다.
                </p>
              </div>
            )}
          </div>
          
          {/* 페이지 네이션 */}
          {reviews.length > 0 && totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="p-8 bg-gray-25 rounded-lg">
          <p className="text-body text-gray-600 text-center">
            아직 작성된 리뷰가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};

// 별 아이콘 컴포넌트
const Star = ({ filled, size = "normal" }: { filled: boolean; size?: string }) => {
  const sizeClass = size === "small" ? "w-4 h-4" : "w-6 h-6";
  const color = filled ? "#FFC107" : "#E0E0E5";
  
  return (
    <StarIcon 
      className={sizeClass}
      style={{ color }}
    />
  );
};

// 예약 카드
const ReservationCard = ({ activityId, pricePerPerson }: { activityId: string; pricePerPerson: number }) => {
  return (
    <div 
      className="bg-white rounded-lg p-4" 
      style={{ boxShadow: '0px 4px 24px 0px rgba(156, 180, 202, 0.2)' }}
    >
      <div className="[&>*]:!text-body [&_h3]:!text-body-lg [&_span]:!text-body">
        <Reservation 
          activityId={activityId}
          pricePerPerson={pricePerPerson}
        />
      </div>
    </div>
  );
};

export default ActivityDetailPage;
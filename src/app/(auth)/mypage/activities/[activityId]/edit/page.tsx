'use client';

import React from 'react';
import Reservation from '@/src/components/Reservation/Reservation';
import { Pagination } from '@/src/components/Pagination/Pagination';
import { ActivityData } from '@/src/types/activityType';
import { Coordinates } from '@/src/types/kakaoMapType';
import { Review } from '@/src/types/reviewType';
import LocationIcon from '@/assets/icon_location.svg';
import KebabMenuIcon from '@/assets/icon_kebab_menu.svg';
import StarIcon from '@/assets/icon_star.svg';

// 목업 데이터 (API 연동 전)
const mockActivityData: ActivityData = {
  category: "문화 · 예술",
  title: "함께 배우면 즐거운 스트릿 댄스",
  rating: 4.2,
  reviewCount: 1300,
  location: "서울 중구 명동8길 100 5F",
  address: "서울 중구 명동8길 100 5F",
  price: 1000,
  description: `안녕하세요! 저는 스트릿 댄스 제윤을 가르치는데요. 처음으로 나 좋아하게 만든 댄스를 한 곳에서 배울 수 있어요. 처음 해보시는데 여기 와서 댄스는 한 곳에서 배울 수 있어요. 
  
시간이 흐를 수록 춤보다 사람을 만나고 그는 친구와 시간 보내기 좋아서 사람들 만나고 시작하고 저는 또 이해 와서 같은 시간 동안 춤을 그려서 저도 많은 걸 받아가려고 마치 초등학교 때처럼 이해와 오해, 배움과 재능, 그래도 이 수업은 인연만 만들면 다른 것은 제외하고 시작이에요. 
  
세부로 작은 여러분들을 실력만 쌓는 것이 아닌 마음을 채우고 사랑하는 시간이 되었으면 해요.`,
  bannerImageUrl: null,
  subImages: [],
  availableTimes: ["14:00~15:00", "15:00~16:00", "16:00~17:00", "17:00~18:00"],
  coordinates: { lat: 37.5665, lng: 126.9780 },
  reviews: [
    {
      id: 1,
      author: "김지현",
      rating: 5,
      date: "2022.2.4",
      content: "처음 저는 스트릿 댄서 체험에 참가했을 때 진짜 만족했어요. 밝은 분위기 시설 덕분 중요해요."
    },
    {
      id: 2,
      author: "조현서",
      rating: 5,
      date: "2022.2.4",
      content: "다음에 또 다시 가고 싶어요! 저도 춤실력 성장 조식되었어요."
    },
    {
      id: 3,
      author: "이서준",
      rating: 4,
      date: "2022.2.5",
      content: "좋은 경험이었습니다. 강사님이 친절하셨어요."
    },
    {
      id: 4,
      author: "박민지",
      rating: 5,
      date: "2022.2.6",
      content: "재미있게 배울 수 있어서 좋았습니다!"
    },
    {
      id: 5,
      author: "최예린",
      rating: 4,
      date: "2022.2.7",
      content: "시설도 깨끗하고 분위기가 좋아요."
    }
  ]
};

const ActivityDetailPage = () => {
  const activityData = mockActivityData;

  return (
    <div className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          
          <div className="space-y-8">
            <ImageGallery 
              bannerImage={activityData.bannerImageUrl}
              images={activityData.subImages}
            />
            <DescriptionSection description={activityData.description} />
            <LocationSection 
              address={activityData.address}
              coordinates={activityData.coordinates}
            />
            <ReviewSection 
              rating={activityData.rating}
              reviewCount={activityData.reviewCount}
              reviews={activityData.reviews}
            />
          </div>
          
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
                  <span>{activityData.location}</span>
                </div>
              </div>
              <KebabMenu />
            </div>
            
            <p className="text-body text-gray-700">
              초보자부터 전문가까지 즐겁는 즐거움을 함께 느껴보세요.
            </p>
            
            <ReservationCard 
              pricePerPerson={activityData.price}
              availableTimes={activityData.availableTimes}
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

// 이미지
const ImageGallery = ({ bannerImage, images }: { bannerImage: string | null; images: string[] }) => {
  return (
    <div className="space-y-4">
      <div className="w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
        {bannerImage ? (
          <img 
            src={bannerImage} 
            alt="체험 메인 이미지" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            체험 등록 이미지 표시 영역
          </div>
        )}
      </div>
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
        <p className="text-body text-gray-600 text-center">
          체험 등록 설명 연동 예정
        </p>
      </div>
    </div>
  );
};

// 오시는 길(카카오맵)
const LocationSection = ({ address, coordinates }: { address: string; coordinates: Coordinates }) => {
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;
        
        const options = {
          center: new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng),
          level: 3
        };

        const map = new window.kakao.maps.Map(container, options);

        const markerPosition = new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [coordinates]);

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
      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-[32px] font-bold text-gray-900 leading-none mb-2">
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
      
      {/* Pagination */}
      {reviews.length > 0 && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

// 후기 별 아이콘 컴포넌트
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
const ReservationCard = ({ pricePerPerson, availableTimes }: { pricePerPerson: number; availableTimes: string[] }) => {
  return (
    <div 
      className="bg-white rounded-lg p-4" 
      style={{ boxShadow: '0px 4px 24px 0px rgba(156, 180, 202, 0.2)' }}
    >
      <div className="[&>*]:!text-body [&_h3]:!text-body-lg [&_button]:!text-body [&_span]:!text-body [&>*]:!border-0">
        <Reservation 
          pricePerPerson={pricePerPerson}
          availableTimes={availableTimes}
        />
      </div>
    </div>
  );
};

export default ActivityDetailPage;
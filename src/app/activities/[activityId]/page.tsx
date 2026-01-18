'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Reservation from '@/src/components/Reservation/Reservation';
import { Pagination } from '@/src/components/Pagination/Pagination';
import DeleteModal from '@/src/components/Modal/DeleteModal';
import { ActivityData } from '@/src/types/activityType';
import { ReviewsResponse } from '@/src/types/reviewType';
import { getActivityDetail, deleteMyActivity, getActivityReviews } from '@/src/features/public/services/activities';
import LocationIcon from '@/src/assets/icon_location.svg';
import KebabMenuIcon from '@/src/assets/icon_kebab_menu.svg';
import StarIcon from '@/src/assets/icon_star.svg';

const ActivityDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const activityId = params.activityId as string;
  
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/users/me');
        if (response.ok) {
          const userData = await response.json();
          setCurrentUserId(userData.id);
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    };

    fetchCurrentUser();
  }, []);

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await getActivityReviews(activityId, currentReviewPage, 3);
        setReviewsData(data);
      } catch (err) {
        console.error('리뷰 API 에러:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [activityId, currentReviewPage]);

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
        <p className="text-body text-red-500">{error || '데이터를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  const subImageUrls = activityData.subImages?.map(img => img.imageUrl) || [];

  return (
    <div className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          
          <div className="space-y-8">
            <ImageGallery 
              bannerImage={activityData.bannerImageUrl}
              images={subImageUrls}
            />
            <DescriptionSection description={activityData.description} />
            <LocationSection address={activityData.address} />
            <ReviewSection 
              reviewsData={reviewsData}
              reviewsLoading={reviewsLoading}
              currentPage={currentReviewPage}
              onPageChange={setCurrentReviewPage}
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
                  <div className="flex-shrink-0">
                    <Star filled={true} size="small" />
                  </div>
                  <span className="font-medium">{activityData.rating}</span>
                  <span>({activityData.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-body text-gray-600">
                  <div className="flex-shrink-0">
                    <LocationIcon className="w-6 h-6" />
                  </div>
                  <span>{activityData.address}</span>
                </div>
              </div>
              <KebabMenu 
                activityId={activityId}
                userId={activityData.userId}
                currentUserId={currentUserId}
              />
            </div>
            
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

const KebabMenu = ({ 
  activityId, 
  userId,
  currentUserId 
}: { 
  activityId: string; 
  userId: number;
  currentUserId: number | null;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isMyActivity = currentUserId !== null && userId === currentUserId;

  if (!isMyActivity) {
    return null;
  }

  const handleEdit = () => {
    setIsOpen(false);
    router.push(`/activities/${activityId}/edit`);
  };

  const handleDeleteClick = () => {
    setIsOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMyActivity(activityId)
      .then(() => {
        alert('체험이 삭제되었습니다.');
        router.push('/');
      })
      .catch((error) => {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert('체험 삭제에 실패했습니다.');
        }
      })
      .finally(() => {
        setIsDeleteModalOpen(false);
      });
  };

  return (
    <>
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
                onClick={handleDeleteClick}
                className="w-full px-4 py-3 text-left text-body text-gray-900 hover:bg-gray-50 rounded-b-lg"
              >
                삭제하기
              </button>
            </div>
          </>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        message="체험을 삭제하시겠어요?"
      />
    </>
  );
};

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

        const geocoder = new window.kakao.maps.services.Geocoder();

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

const ReviewSection = ({ 
  reviewsData,
  reviewsLoading,
  currentPage,
  onPageChange
}: { 
  reviewsData: ReviewsResponse | null;
  reviewsLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  if (reviewsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-h3 font-bold text-gray-900 tracking-h3">
            체험 후기
          </h2>
        </div>
        <div className="p-8 bg-gray-25 rounded-lg">
          <p className="text-body text-gray-600 text-center">
            리뷰를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (!reviewsData) {
    return null;
  }

  const { averageRating, totalCount, reviews } = reviewsData;
  const totalPages = Math.ceil(totalCount / 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-h3 font-bold text-gray-900 tracking-h3">
          체험 후기
        </h2>
        <span className="text-body font-medium text-gray-600">{totalCount}개</span>
      </div>

      {totalCount > 0 ? (
        <>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-h1 font-bold text-gray-900 leading-none mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-body-lg font-bold text-gray-900 mb-2">
              매우 만족
            </div>
            <div className="flex items-center gap-1">
              <div className="flex-shrink-0">
                <PartialStar rating={averageRating} />
              </div>
              <span className="text-body font-medium text-gray-600 ml-1">{totalCount}개 후기</span>
            </div>
          </div>

          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="bg-white rounded-lg p-6"
                  style={{ boxShadow: '0px 4px 24px 0px rgba(156, 180, 202, 0.2)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-body-lg font-bold text-gray-900">
                      {review.user.nickname}
                    </span>
                    <span className="text-body text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="flex-shrink-0">
                        <Star filled={star <= review.rating} size="small" />
                      </div>
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
          
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
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

const Star = ({ filled, size = "normal" }: { filled: boolean; size?: string }) => {
  const sizeClass = size === "small" ? "w-5 h-5" : "w-6 h-6";
  const color = filled ? "#FFC107" : "#E0E0E5";
  
  return (
    <StarIcon 
      className={sizeClass}
      style={{ color }}
    />
  );
};

const PartialStar = ({ rating }: { rating: number }) => {
  const percentage = (rating / 5) * 100;
  
  return (
    <div className="relative w-5 h-5 flex-shrink-0">
      <StarIcon 
        className="w-5 h-5 absolute top-0 left-0"
        style={{ color: '#E0E0E5' }}
      />
      <div 
        className="absolute top-0 left-0 overflow-hidden"
        style={{ width: `${percentage}%` }}
      >
        <StarIcon 
          className="w-5 h-5"
          style={{ color: '#FFC107' }}
        />
      </div>
    </div>
  );
};

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
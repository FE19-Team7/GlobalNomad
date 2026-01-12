import { Coordinates } from '@/src/types/kakaoMapType';
import { Review } from '@/src/types/reviewType';

// 체험 상세 데이터 타입
export interface ActivityData {
  category: string;
  title: string;
  rating: number;
  reviewCount: number;
  location: string;
  address: string;
  price: number;
  description: string;
  bannerImageUrl: string | null;
  subImages: string[];
  availableTimes: string[];
  coordinates: Coordinates;
  reviews: Review[];
}
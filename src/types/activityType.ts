import { Coordinates } from './kakaoMapType';
import { Review } from './reviewType';

// 스케줄 시간대 타입
export interface ScheduleTime {
  id: number;
  startTime: string;
  endTime: string;
}

// 스케줄 타입
export interface Schedule {
  date: string;
  times: ScheduleTime[];
}

// 서브 이미지 타입
export interface SubImage {
  id: number;
  imageUrl: string;
}

// 체험 상세 데이터 타입 (API 응답)
export interface ActivityData {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  schedules: Schedule[];
  subImages: SubImage[];
}

// 페이지에서 사용할 확장 타입
export interface ActivityDetailData extends ActivityData {
  location?: string;
  coordinates?: Coordinates;
  reviews?: Review[];
}
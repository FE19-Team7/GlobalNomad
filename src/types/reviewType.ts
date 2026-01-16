// 기존 Review 타입
export interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  content: string;
}

// API 응답용 타입 추가
export interface ReviewUser {
  profileImageUrl: string | null;
  nickname: string;
  id: number;
}

export interface ReviewDetail {
  id: number;
  user: ReviewUser;
  activityId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  averageRating: number;
  totalCount: number;
  reviews: ReviewDetail[];
}
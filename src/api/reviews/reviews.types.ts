// 리뷰 평점 (1~5)
export type ReviewRating = 1 | 2 | 3 | 4 | 5;

// 리뷰 작성자
export interface ReviewUser {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
}

// 리뷰
export interface Review {
    id: number;
    activityId: number;
    rating: ReviewRating;
    content: string;

    user: ReviewUser;

    createdAt: string;
    updatedAt: string;
}

// 리뷰 리스트 응답
export interface ReviewsResponse {
    averageRating: number;
    totalCount: number;
    reviews: Review[];
}

// 리뷰 조회 쿼리
export interface GetReviewsParams {
    page?: number;
    size?: number;
}

// 리뷰 작성 body
export interface CreateReviewBody {
    rating: ReviewRating;
    content: string;
}

// 리뷰 작성 응답
export interface CreateReviewResponse {
    id: number;
    activityId: number;
    userId: number;
    teamId: string;
    rating: ReviewRating;
    content: string;
    createdAt: string;
    updatedAt: string;
}
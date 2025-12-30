import { http } from '../http';
import {
    ReviewsResponse,
    GetReviewsParams,
    CreateReviewBody,
    CreateReviewResponse,
} from './reviews.types';

/**
 * 체험 리뷰 조회
 * GET /activities/{activityId}/reviews
 */
export const getReviewsByActivity = (
    activityId: number,
    params?: GetReviewsParams
) => {
    return http.get<ReviewsResponse>(
        `/activities/${activityId}/reviews`,
        {
            params,
        }
    );
};

/**
 * 내 예약 리뷰 작성
 * POST /my-reservations/{reservationId}/reviews
 */
export const createReview = (
    reservationId: number,
    body: CreateReviewBody
) => {
    return http.post<CreateReviewResponse>(
        `/my-reservations/${reservationId}/reviews`,
        body
    );
};
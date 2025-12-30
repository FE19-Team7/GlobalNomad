import { http } from '../http';
import {
    ActivitiesResponse,
    ActivityDetail,
    GetActivitiesParams,
    AvailableSchedule,
    ReviewsResponse,
    CreateReservationBody,
} from './activities.types';

/**
 * 체험 리스트 조회
 * GET /activities
 */
export const getActivities = (params: GetActivitiesParams) => {
    return http.get<ActivitiesResponse>('/activities', { params });
};

/**
 * 체험 상세 조회
 * GET /activities/{activityId}
 */
export const getActivityDetail = (activityId: number) => {
    return http.get<ActivityDetail>(`/activities/${activityId}`);
};

/**
 * 체험 예약 가능일 조회
 * GET /activities/{activityId}/available-schedule
 */
export const getAvailableSchedule = (
    activityId: number,
    year: string,
    month: string
) => {
    return http.get<AvailableSchedule[]>(
        `/activities/${activityId}/available-schedule`,
        {
            params: { year, month },
        }
    );
};

/**
 * 체험 리뷰 조회
 * GET /activities/{activityId}/reviews
 */
export const getActivityReviews = (
    activityId: number,
    page = 1,
    size = 3
) => {
    return http.get<ReviewsResponse>(
        `/activities/${activityId}/reviews`,
        {
            params: { page, size },
        }
    );
};

/**
 * 체험 예약 신청
 * POST /activities/{activityId}/reservations
 */
export const createActivityReservation = (
    activityId: number,
    body: CreateReservationBody
) => {
    return http.post(
        `/activities/${activityId}/reservations`,
        body
    );
};

/**
 * 체험 이미지 업로드
 * POST /activities/image
 */
export const uploadActivityImage = (formData: FormData) => {
    return http.post<{ activityImageUrl: string }>(
        '/activities/image',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
};
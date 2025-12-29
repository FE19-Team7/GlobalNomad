// 체험 카테고리
export type Category =
    | '문화 · 예술'
    | '식음료'
    | '스포츠'
    | '투어'
    | '관광'
    | '웰빙';

// 정렬 방식
export type ActivitySort =
    | 'most_reviewed'
    | 'price_asc'
    | 'price_desc'
    | 'latest';

// 예약 상태
export type ReservationStatus =
    | 'pending'
    | 'confirmed'
    | 'declined'
    | 'canceled'
    | 'completed';

// 체험 기본 정보
export interface Activity {
    id: number;
    userId: number;
    title: string;
    description: string;
    category: Category;
    price: number;
    address: string;
    bannerImageUrl: string;
    rating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
}

// 서브 이미지
export interface ActivitySubImage {
    id: number;
    imageUrl: string;
}

// 스케줄
export interface ActivitySchedule {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
}

// 체험 상세
export interface ActivityDetail extends Activity {
    subImages: ActivitySubImage[];
    schedules: ActivitySchedule[];
}

// 체험 리스트 응답
export interface ActivitiesResponse {
    cursorId: number;
    totalCount: number;
    activities: Activity[];
}

// 체험 리스트 조회 파라미터
export interface GetActivitiesParams {
    method: 'offset' | 'cursor';
    cursorId?: number;
    category?: Category;
    keyword?: string;
    sort?: ActivitySort;
    page?: number;
    size?: number;
}

// 예약 가능 시간
export interface AvailableSchedule {
    date: string;
    times: {
        id: number;
        startTime: string;
        endTime: string;
    }[];
}

// 리뷰
export interface Review {
    id: number;
    activityId: number;
    rating: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        nickname: string;
        profileImageUrl: string;
    };
}

// 리뷰 조회 응답
export interface ReviewsResponse {
    averageRating: number;
    totalCount: number;
    reviews: Review[];
}

// 체험 예약 생성
export interface CreateReservationBody {
    scheduleId: number;
    headCount: number;
}
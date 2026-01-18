// 체험 데이터 타입
export interface Activity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl?: string;
  rating?: number;
  reviewCount: number;
  createdAt: string;
  updatedAt?: string;
}

// 체험 리스트 응답 타입
export interface ActivityResponse {
  cursorId: number | null;
  totalCount: number;
  activities: Activity[];
}

// 체험 리스트 조회 API 파라미터 타입
export interface GetActivitiesParams {
  method?: 'offset' | 'cursor';
  page?: number;
  size?: number;
  cursorId?: number | null;
  keyword?: string;
  category?: string | null;
  sort?: SortOption;
}

export type SortOption = 'latest' | 'most_reviewed' | 'price_asc' | 'price_desc';

// 인기 체험 조회
export const getPopularActivities = async (cursorId: number | null = null, size: number = 4) => {
  return getActivities({
    method: 'cursor',
    size,
    cursorId,
    sort: 'most_reviewed'
  });
};

// 모든 체험 조회
export const getActivities = async ({
  method = 'offset',
  page = 1,
  size = 8,
  cursorId = null,
  keyword,
  category,
  sort = 'latest',
}: GetActivitiesParams): Promise<ActivityResponse> => {

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  const url = `${API_URL}/activities`;

  const params = new URLSearchParams({
    method,
    size: String(size),
    sort,
  });

  if (method === 'offset') params.append('page', String(page));
  if (method === 'cursor' && cursorId !== null) {
    params.append('cursorId', String(cursorId));
  }
  if (keyword?.trim()) params.append('keyword', keyword);
  if (category) params.append('category', category);

  const response = await fetch(`${url}?${params.toString()}`);

  if (!response.ok) throw new Error("데이터 로드 실패");

  return response.json();
};

export type MyActivity = {
  id: number;
  userId?: number;
  title: string;
  description?: string;
  category?: string;
  price: number;
  address?: string;
  bannerImageUrl?: string;
  rating: number;
  reviewCount: number;
  createdAt?: string;
  updatedAt?: string;
};

export type MyActivitiesResponse = {
  cursorId: number | null;
  totalCount: number;
  activities: MyActivity[];
};
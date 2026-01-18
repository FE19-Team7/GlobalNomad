export type Mode = 'create' | 'edit';

export type Schedule = {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
};

export type ExistingSubImage = {
  id: number;
  imageUrl: string;
};

export type ActivityDetailForEdit = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImages: ExistingSubImage[];
  schedules: Array<Required<Schedule>>;
};
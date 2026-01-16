export type Schedule = {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
};

export type SubImage = {
  id: number;
  imageUrl: string;
};

export type ActivityDetail = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImages: SubImage[];
  schedules: Required<Schedule>[];
};
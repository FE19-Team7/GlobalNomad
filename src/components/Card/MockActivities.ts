import { ActivityCardProps } from '@/src/components/Card/ActivityCard';

export const baseActivities = [
  {
    id: 1,
    title: "함께 배우면 즐거운 스트릿 댄스",
    rating: 4.9,
    reviewCount: 703,
    price: 38000,
    category: "스포츠",
  },
  {
    id: 2,
    title: "VR 게임 마스터 하는 법",
    rating: 4.9,
    reviewCount: 293,
    price: 38000,
    category: "문화 · 예술",
  },
  {
    id: 3,
    title: "자연 속에서 당일치기 캠핑하기",
    rating: 4.7,
    reviewCount: 236,
    price: 40000,
    category: "웰빙",
  },
  {
    id: 4,
    title: "연인과 사랑의 징검다리 데이트",
    rating: 3.9,
    reviewCount: 108,
    price: 35000,
    category: "투어",
  },
  {
    id: 5,
    title: "크리스마스 랜선 집들이",
    rating: 4.9,
    reviewCount: 10,
    price: 25000,
    category: "식음료",
  },
  {
    id: 6,
    title: "피오르 체험",
    rating: 3.9,
    reviewCount: 109,
    price: 42800,
    category: "관광",
  },
  {
    id: 7,
    title: "해안가 마을에서 1주일",
    rating: 4.9,
    reviewCount: 10,
    price: 225000,
    category: "웰빙",
  },
  {
    id: 8,
    title: "부모님과 함께 갈대숲 체험",
    rating: 4.9,
    reviewCount: 10,
    price: 25000,
    category: "투어",
  },
  {
    id: 9,
    title: "열기구 페스티벌",
    rating: 4.1,
    reviewCount: 85,
    price: 35000,
    category: "관광",
  },
  {
    id: 10,
    title: "베트남 자전거 여행",
    rating: 3.9,
    reviewCount: 108,
    price: 63000,
    category: "스포츠",
  },
  {
    id: 11,
    title: "다양한 열대어 구경하기",
    rating: 4.3,
    reviewCount: 18,
    price: 50000,
    category: "투어",
  },
  {
    id: 12,
    title: "조개구이와 함께 즐기는 을왕리 석양",
    rating: 4.8,
    reviewCount: 52,
    price: 25000,
    category: "식음료",
  },
  {
    id: 13,
    title: "여행 가이드와 함께하는 숲",
    rating: 4.1,
    reviewCount: 111,
    price: 18000,
    category: "웰빙",
  },
  {
    id: 14,
    title: "내 강아지 인생 사진 찍어주기",
    rating: 4.8,
    reviewCount: 10,
    price: 35000,
    category: "문화 · 예술",
  },
  {
    id: 15,
    title: "발리 코끼리 목욕 체험",
    rating: 4.1,
    reviewCount: 10,
    price: 35000,
    category: "관광",
  },
  {
    id: 16,
    title: "앵무새와 친구 되기",
    rating: 4.7,
    reviewCount: 42,
    price: 60000,
    category: "문화 · 예술",
  },
  {
    id: 17,
    title: "한라산 등반",
    rating: 4.7,
    reviewCount: 11,
    price: 25000,
    category: "스포츠",
  },
  {
    id: 18,
    title: "가이드와 함께하는 국립중앙박물관 탐방",
    rating: 4.9,
    reviewCount: 65,
    price: 8000,
    category: "문화 · 예술",
  },
  {
    id: 19,
    title: "강릉 서핑",
    rating: 4.5,
    reviewCount: 110,
    price: 80000,
    category: "스포츠",
  },
];

const categories = ["문화 · 예술", "식음료", "스포츠", "투어", "관광", "웰빙"];

// 100개 목업 데이터 생성
export const mockActivities: ActivityCardProps[] = Array.from({ length: 100 }, (_, index) => {
  const baseIndex = index % baseActivities.length;
  const base = baseActivities[baseIndex];

  return {
    id: index + 1,
    title: `${base.title} #${Math.floor(index / baseActivities.length) + 1}`,
    category: categories[index % categories.length],
    rating: +((index % 20) / 10 + 3).toFixed(1),
    reviewCount: (index % 500) + 10,
    price: ((index % 20) + 1) * 5000,
  };
});


export const getMockActivities = (page: number, size: number = 4) => {
  const start = page * size;
  const end = start + size;

  return {
    data: mockActivities.slice(start, end),
    hasMore: end < mockActivities.length,
  };
};

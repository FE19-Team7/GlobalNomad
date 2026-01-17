import { useState, useCallback, useEffect } from 'react';
import { getActivities, Activity } from '@/src/features/mainpage/activities';

export type PriceSortValue = 'price_asc' | 'price_desc' | 'latest' | 'most_reviewed';

interface UseActivitiesFilterProps {
  itemsPerPage: number;
  searchTerm?: string;
}

export function useActivitiesFilter({
  itemsPerPage = 8,
  searchTerm: externalSearchTerm = '',
}: UseActivitiesFilterProps) {

  // API 데이터 및 필터링 상태 관리
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceSort, setPriceSort] = useState<PriceSortValue>('latest');
  const [isLoading, setIsLoading] = useState(false);

  // 서버에서 데이터 불러오기
  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getActivities({
        method: 'offset',
        page: currentPage,
        size: itemsPerPage,
        keyword: externalSearchTerm,
        category: selectedCategory === '전체' ? null : selectedCategory,
        sort: priceSort,
      });
      setActivities(data.activities);
      setTotalItems(data.totalCount);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, externalSearchTerm, selectedCategory, priceSort]);

  // 필터 · 페이지 · 검색어 변경 시 데이터 호출
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // 정렬 방식 변경 시 첫 페이지로 초기화
  const handleSetPriceSort = useCallback((sort: PriceSortValue | null) => {
    setPriceSort(sort || 'latest');
    setCurrentPage(1);
  }, []);

  // 카테고리 변경 시 첫 페이지로 초기화
  const handleSetSelectedCategory = useCallback((category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  // 모든 필터 초기화
  const resetFilters = useCallback(() => {
    setPriceSort('latest');
    setSelectedCategory(null);
    setCurrentPage(1);
  }, []);

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    // 필터링 상태
    priceSort,
    selectedCategory,
    currentPage,
    searchTerm: externalSearchTerm,
    isLoading,

    // 상태 변경 함수
    setPriceSort: handleSetPriceSort,
    setSelectedCategory: handleSetSelectedCategory,
    setCurrentPage,
    resetFilters,

    // API 응답 데이터
    currentItems: activities,
    totalPages,
    totalItems
  };
}

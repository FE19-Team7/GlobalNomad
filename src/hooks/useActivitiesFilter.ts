import { useState, useMemo, useCallback } from 'react';
import { ActivityCardProps } from '@/src/components/Card/ActivityCard';

export type PriceSortValue = 'price_asc' | 'price_desc';

interface UseActivitiesFilterProps {
  activities: ActivityCardProps[];
  itemsPerPage: number;
}

interface useActivitiesFilterReturn {
  priceSort: PriceSortValue | null;
  selectedCategory: string | null;
  currentPage: number;
  searchTerm: string;

  setPriceSort: (value: PriceSortValue | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  resetFilters: () => void;

  processedItems: ActivityCardProps[];    // 필터링 및 정렬된 전체 데이터
  currentItems: ActivityCardProps[];      // 현재 페이지 데이터
  totalPages: number;                     // 전체 페이지 수
  totalItems: number;                     // 전체 데이터 수
}

export function useActivitiesFilter({
  activities,
  itemsPerPage = 8,
}: UseActivitiesFilterProps): useActivitiesFilterReturn {

  // 필터 상태 관리
  const [priceSort, setPriceSort] = useState<PriceSortValue | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // 필터링 및 정렬된 전체 데이터
  const processedItems = useMemo(() => {
    let items = [...activities];

    // 검색 필터링
    if (searchTerm.trim()) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 카테고리 필터링
    if (selectedCategory) {
      items = items.filter(item =>
        item.category === selectedCategory
      );
    }

    // 가격 정렬
    items.sort((a, b) => {
      if (priceSort === null) {
        return b.id - a.id;           // 최신 순 (ID 높은 순)
      } else if (priceSort === 'price_asc') {
        return a.price - b.price;    // 가격 낮은 순
      } else {
        return b.price - a.price;    // 가격 높은 순
      }
    });

    return items;
  }, [activities, searchTerm, selectedCategory, priceSort]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(processedItems.length / itemsPerPage);
  const totalItems = processedItems.length;

  // 현재 페이지 데이터
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return processedItems.slice(startIndex, endIndex);
  }, [processedItems, currentPage, itemsPerPage]);

  // 검색어 변경 시 1페이지로 초기화
  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  // 필터 변경 시 1페이지로 초기화
  const handleSetPriceSort = useCallback((sort: PriceSortValue | null) => {
    setPriceSort(sort);
    setCurrentPage(1);
  }, []);

  const handleSetSelectedCategory = useCallback((category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  // 모든 필터 초기화
  const resetFilters = () => {
    setPriceSort(null);
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  return {
    searchTerm,
    priceSort,
    selectedCategory,
    currentPage,

    setSearchTerm: handleSetSearchTerm,
    setPriceSort: handleSetPriceSort,
    setSelectedCategory: handleSetSelectedCategory,
    setCurrentPage,
    resetFilters,

    processedItems,
    currentItems,
    totalPages,
    totalItems
  };
}

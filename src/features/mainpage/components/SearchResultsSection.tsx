'use client';

import ActivityCard from '@/src/components/Card/ActivityCard';
import { Pagination } from '@/src/components/Pagination/Pagination';
import { useActivitiesFilter } from '@/src/hooks/useActivitiesFilter';
import { mockActivities } from '@/src/components/Card/MockActivities';
import EmptyImage from '@/src/assets/earth.svg';

interface SearchResultsSectionProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export default function SearchResultsSection({
  searchTerm,
  onSearchTermChange
}: SearchResultsSectionProps) {
  const {
    currentItems,
    totalPages,
    totalItems,
    currentPage,
    setCurrentPage,
    setSearchTerm,
  } = useActivitiesFilter({
    activities: mockActivities,
    itemsPerPage: 8,
  });

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    onSearchTermChange(term);
  };

  return (
    <div className="flex flex-col">

      {/* 검색 결과 헤더 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {searchTerm}<span className="font-medium"> 검색 결과입니다.</span>
        </h2>
        <p className="text-gray-600">
          총 {totalItems}개의 결과
        </p>
      </div>

      {/* 검색 결과가 없을 때 */}
      {totalItems === 0 && (
        <div className="text-center py-20">
          <EmptyImage
            aria-label="검색 결과 없음 이미지"
            className="w-[150px] h-[150px] mx-auto mb-6 object-contain"
          />
          <p className="text-lg text-gray-500">
            {searchTerm}에 대한 검색 결과가 없습니다.
          </p>
        </div>
      )}

      {/* 검색 결과 카드 */}
      {totalItems > 0 && (
        <div className="grid grid-cols-4 gap-x-6 gap-y-[30px]">
          {currentItems.map((item) => (
            <ActivityCard key={item.id} {...item} />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-[30px] flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            maxPageButtons={7}
          />
        </div>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import AllActivitiesList from '@/src/components/Card/AllActivitiesList';
import { useActivitiesFilter } from '@/src/hooks/useActivitiesFilter';
import { Pagination } from '@/src/components/Pagination/Pagination';

interface AllActivitiesSectionProps {
  page: number;
  onPageChange: (page: number) => void;
}

export default function AllActivitiesSection({
  page,
  onPageChange,
}: AllActivitiesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    totalPages,
    currentItems,
    setPriceSort,
  } = useActivitiesFilter({
    itemsPerPage: 8,
    page: page,
    selectedCategory: selectedCategory,
  });

  return (
    <section className="w-full h-[964px] flex flex-col gap-[30px]">
      <div>
        <h2 className="h-[38px] flex items-center text-h1 font-bold">🛼 모든 체험</h2>
      </div>
      <div>
        <AllActivitiesList
          currentItems={currentItems}
          selectedCategory={selectedCategory}
          setPriceSort={setPriceSort}
          onCategoryChange={(category) => {
            setSelectedCategory(category);
            onPageChange(1);
          }}
        />
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-[30px] flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            maxPageButtons={7}
          />
        </div>
      )}
    </section>
  );
}

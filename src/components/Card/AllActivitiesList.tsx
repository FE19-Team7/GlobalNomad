'use client';

import ActivityCard from '@/src/components/Card/ActivityCard';
import { Pagination } from '@/src/components/Pagination/Pagination';
import { mockActivities } from '@/src/components/Card/MockActivities';
import PriceSortDropdown from '@/src/components/Dropdown/PriceSortDropdown';
import CategoryFilter from '@/src/components/Card/CategoryFilter';
import { useActivitiesFilter } from '@/src/hooks/useActivitiesFilter';

export default function AllActivitiesList() {
  const {
    priceSort,
    selectedCategory,
    currentPage,
    setPriceSort,
    setSelectedCategory,
    setCurrentPage,
    currentItems,
    totalPages,
  } = useActivitiesFilter({
    activities: mockActivities,
    itemsPerPage: 8,
  });

  const categories = ['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'];

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        <div className="flex items-center flex-end">
          <PriceSortDropdown
            value={priceSort || 'price_asc'}
            onChange={setPriceSort}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-x-6 gap-y-[30px]">
        {currentItems.map((item) => (
          <ActivityCard key={item.id} {...item} />
        ))}
      </div>

      <div className="mt-[30px] flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          maxPageButtons={7}
        />
      </div>
    </div>
  );
}

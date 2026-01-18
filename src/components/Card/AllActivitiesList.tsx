'use client';

import ActivityCard from '@/src/components/Card/ActivityCard';
import PriceSortDropdown from '@/src/components/Dropdown/PriceSortDropdown';
import CategoryFilter from '@/src/components/Card/CategoryFilter';
import { Activity, SortOption } from '@/src/features/mainpage/activities';

interface AllActivitiesListProps {
  currentItems: Activity[];
  selectedCategory: string | null;
  setPriceSort: (sort: SortOption) => void;
  onCategoryChange: (category: string | null) => void;
}

export default function AllActivitiesList({
  currentItems,
  selectedCategory,
  setPriceSort,
  onCategoryChange,
}: AllActivitiesListProps) {

  const categories = ['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'];

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={onCategoryChange}
          />
        </div>

        <div className="flex items-center flex-end">
          <PriceSortDropdown
            value={'price_asc'}
            onChange={setPriceSort}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-x-6 gap-y-[30px]">
        {currentItems.map((item) => (
          <ActivityCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

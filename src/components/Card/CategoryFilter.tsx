'use client';

import FilterButton from '@/src/components/Button/FilterButton';

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
  className?: string;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
  className = '',
}: CategoryFilterProps) {

  return (
    <div className={`flex gap-4 ${className}`}>

      {/* 카테고리 버튼 */}
      {categories.map(category => (
        <FilterButton
          key={category}
          label={category}
          selected={selected === category}
          onClick={() => onSelect(category)}
          size="md"
        />
      ))}
    </div>
  );
}

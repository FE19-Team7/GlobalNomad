'use client';

import { useCallback } from 'react';
import FilterButton from '@/src/components/Button/FilterButton';
import ArtIcon from '@/src/assets/icon_art.svg';
import FoodIcon from '@/src/assets/icon_food.svg';
import SportsIcon from '@/src/assets/icon_sports.svg';
import TourIcon from '@/src/assets/icon_tour.svg';
import TravelIcon from '@/src/assets/icon_bus.svg';
import WellbeingIcon from '@/src/assets/icon_wellbeing.svg';

const ICON_MAP = {
  "문화 · 예술": ArtIcon,
  "식음료": FoodIcon,
  "스포츠": SportsIcon,
  "투어": TourIcon,
  "관광": TravelIcon,
  "웰빙": WellbeingIcon
} as const;

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

  // 카테고리 클릭 핸들러
  const handleCategoryClick = useCallback((category: string) => {
    if (selected === category) {
      onSelect(null);
    } else {
      onSelect(category);
    }
  }, [selected, onSelect]);

  return (
    <div className={`flex gap-4 ${className}`}>

      {/* 카테고리 버튼 */}
      {categories.map(category => {
        const IconComponent = ICON_MAP[category as keyof typeof ICON_MAP];
        const isSelected = selected === category;

        return (
          <FilterButton
            key={category}
            label={category}
            icon={<IconComponent className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-black'}`} />}
            selected={isSelected}
            onClick={() => handleCategoryClick(category)}
            size="md"
          />
        );
      })}
    </div>
  );
}

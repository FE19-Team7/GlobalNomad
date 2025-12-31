'use client';

import React from 'react';
import Button from '@/src/components/button_test/Button';
import { FilterButtonProps } from '@/src/types/filterButtonType';

const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  (
    {
      label,
      icon,
      selected = false,
      size = 'md',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // 반응형 사이즈
    const sizeStyles = {
      sm: 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs gap-1.5 sm:gap-2',
      md: 'px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm gap-2',
      lg: 'px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base gap-2 sm:gap-2.5',
    };

    const variantStyles = selected
      ? 'bg-black text-white border-0'
      : 'bg-white text-black border border-gray-200 hover:border-gray-300 active:border-gray-400';

    // FilterButton만의 baseStyles 재정의
    const filterBaseStyles = `inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 ease-in-out disabled:cursor-not-allowed cursor-pointer ${sizeStyles[size]} ${variantStyles}`;

    return (
      <Button
        ref={ref}
        baseStyles={filterBaseStyles}
        className={className}
        {...props}
      >
        <>
        {icon && <span className='flex-shrink-0'>{icon}</span>}
        <span>{children || label}</span>
        </>
      </Button>
    ); 
  }
);

FilterButton.displayName = 'FilterButton';

export default FilterButton;
'use client';

import React from 'react';
import { FilterButtonProps } from '@/src/types/filterButtonType';

export default function FilterButton ({
  label,
  selected = false,
  onClick,
  disabled = false,
  size = 'md',
  className = '',
  children,
  ref,
  ...props
}: FilterButtonProps & {ref?: React.Ref<HTMLButtonElement> }) {
  const baseStyles = `
    inline-flex
    items-center
    gap-2
    px-5
    py-2.5
    rounded-full
    font-medium
    text-sm
    transtion-all
    duration-200
    cursor-pointer
    disabled:opacity-50
    disabled:cursor-not-allowed
  `;

  // 사이즈별 스타일
  const sizeStyles = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-3 text-md',
    lg: 'px-10 py-3 text-lg',
  };

  // 선택 여부에 따른 스타일
  const variantStyles = selected
    ? 'bg-gray-900 text-white border-2 border-gray-900'
    : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 active:border-gray-400';

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles} ${className}`}
        {...props}
      >
        {label}
        {children}
      </button>
    );
}
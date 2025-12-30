'use client';

import React from 'react';
import Button from './Button';
import { IconButtonProps } from '@/src/types/iconButtonType';

const IconButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>(
  (
    {
      label,
      icon,
      selected = false,
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    // 반응형 사이즈
    const sizeStyles = {
      sm: 'pl-5 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm gap-1.5 sm:gap-2',
      md: 'pl-5 pr-4 sm:pr-5 py-2 sm:py-2.5 text-sm sm:text-base gap-2',
      lg: 'pl-5 pr-5 sm:pr-6 py-2.5 sm:py-3 text-base sm:text-lg gap-2 sm:gap-2.5',
    };

    const variantStyles = selected
      ? 'bg-primary-100 !bg-primary-100'
      : 'bg-white hover:bg-gray-50 active:bg-gray-100';

    const iconColorClass = selected ? 'text-primary-500' : 'text-gray-600';
    const textColorClass = selected ? 'text-gray-950' : 'text-gray-600';

    const combinedClassName = `rounded-full font-medium border-0 justify-start ${sizeStyles[size]} ${variantStyles} ${className}`;

    return (
      <Button
        ref={ref}
        className={combinedClassName}
        {...props}
      >
        <>
          {icon && <span className={`flex-shrink-0 ${iconColorClass}`}>{icon}</span>}
          <span className={textColorClass}>{label}</span>
        </>
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
'use client';

import React from 'react';
import Link from 'next/link';
import { ButtonProps } from '@/src/types/buttonType';

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      href,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      selected = false,
      children,
      className = '',
      baseStyles,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // baseStyles가 전달되면 그것을 사용하고, 아니면 기본 스타일 사용
    const defaultBaseStyles =
      'inline-flex items-center justify-center rounded-xl transition-all duration-200 ease-in-out disabled:cursor-not-allowed cursor-pointer font-bold';

    const variantStyles = {
      primary: isDisabled
        ? 'bg-gray-200 text-white'
        : 'bg-primary-500 text-white hover:opacity-90 active:opacity-80',
      secondary: isDisabled
        ? 'bg-white border border-gray-200 text-gray-200'
        : selected
        ? 'bg-primary-500 text-white hover:opacity-90 active:opacity-80'
        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-25 active:bg-gray-50',
    };

    // 반응형 고려한 사이즈 스타일
    const sizeStyles = {
      sm: 'px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm min-w-[100px] sm:min-w-[120px]',
      md: 'px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base min-w-[140px] sm:min-w-[160px]',
      lg: 'px-8 sm:px-10 py-3 sm:py-3.5 text-base sm:text-lg',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    // baseStyles가 제공되면 variant와 size 스타일을 무시
    const combinedClassName = baseStyles
      ? `${baseStyles} ${widthStyles} ${className}`
      : `${defaultBaseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

    if (href) {
      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isDisabled) {
          e.preventDefault();
          return;
        }
        if (props.onClick) {
          props.onClick(e);
        }
      };

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={combinedClassName}
          onClick={handleClick}
          aria-disabled={isDisabled}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={isDisabled}
        className={combinedClassName}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
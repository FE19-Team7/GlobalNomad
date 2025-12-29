'use client';

import React from 'react';
import Link from 'next/link';
import { ButtonProps } from '../../types/buttonType';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyles =
      'inline-flex items-center justify-center rounded-xl transition-all duration-200 ease-in-out disabled:cursor-not-allowed cursor-pointer font-bold';

    // Variant별 스타일
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

    const sizeStyles = {
      sm: 'px-6 h-[40px] text-[14px] min-w-[120px]',
      md: 'px-8 h-[48px] text-[16px] min-w-[160px]',
      lg: 'px-10 h-[56px] text-[18px] w-full',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

    if (href) {
      const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (isDisabled) {
          e.preventDefault();
          return;
        }
        const event = e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>;
        props.onClick?.(event);
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
        ref={ref}
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
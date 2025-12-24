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
      'rounded-xl transition-all duration-200 ease-in-out disabled:cursor-not-allowed cursor-pointer';

    // Varidant별 스타일
    const variantStyles = {
      primary: isDisabled
          ? 'bg-[var(--gray-200)] text-[var(--white)]'
          : 'bg-[var(--primary-500)] text-[var(--white)] hover:opacity-90 active:opacity-80',
      secondary: isDisabled
          ? 'bg-[var(--white)] border border-[var(--gray-200)] text-[var(--gray-200)]'
          : selected
          ? 'bg-[var(--primary-500)] text-[var(--white)] hover:opacity-90 active:opacity-80'
          : 'bg-[var(--white)] border border-[var-(--gray-200)] text-[var(gray-600)] hover:bg-[var(--gray-25)] active:bg-[var-(--gray-50)]',
    };

    const sizeStyles = {
      sm: 'px-6 py-3 text-[14px] min-w-[120px] h-[40px]',
      md: 'px-8 py-3.5 text-[16px] min-w-[160px] h-[48px]',
      lg: 'px-10 py-4 text-[18px] w-full h-[56px]',
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
          aria-disabled={disabled || loading}
        >
          <span className="flex items-center justify-center gap-1">{children}</span>
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
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
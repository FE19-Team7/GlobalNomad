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
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'rounded-xl transition-all duration-200 ease-in-out disabled:cursor-not-allowed cursor-pointer';

    const variantStyles = {
      primary:
        loading || disabled
          ? 'bg-grayscale-300 text-white'
          : 'bg-primary-200 text-white hover:bg-primary-300 active:bg-primary-300',
      secondary:
        loading || disabled
          ? 'bg-transparent border-2 border-grayscale-300 text-grayscale-300'
          : 'bg-transparent border-2 border-primary-200 text-primary-200 hover:bg-primary-100 active:bg-primary-100',
    };

    const sizeStyles = {
      sm: 'px-6 py-3 text-md-medium min-w-[120px]',
      md: 'px-8 py-3.5 text-lg-medium min-w-[160px]',
      lg: 'px-10 py-4 text-lg-semibold min-w-full',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

    if (href) {
      const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (disabled || loading) {
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
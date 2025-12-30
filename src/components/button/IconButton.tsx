'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MouseEvent } from 'react';
import { IconButtonProps } from '@/src/types/iconButtontype';

export default function IconButton({
  label,
  icon,
  href,
  selected,
  onClick,
  disabled = false,
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) {
  const pathname = usePathname();
  
  // href가 있으면 현재 경로와 비교해서 자동으로 활성화, 없으면 selected prop 사용
  const isSelected = href ? pathname === href : selected;

  const baseStyles = `
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-full
    font-medium
    transition-all
    duration-200
    cursor-pointer
    disabled:opacity-50
    disabled:cursor-not-allowed
  `;

  // 사이즈별 스타일
  const sizeStyles = {
    sm: 'w-[115px] h-[41px] text-sm',
    md: 'w-[115px] h-[48px] text-base',
    lg: 'w-[115px] h-[54px] text-lg',
  };

  // 선택에 따른 스타일
  const variantStyles = isSelected
    ? 'bg-primary-100'
    : 'bg-white hover:bg-gray-50 active:bg-gray-100';

  const iconColorClass = isSelected ? 'text-primary-500' : 'text-gray-600';
  const textColorClass = isSelected ? 'text-gray-950' : 'text-gray-600';

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles} ${className}`;

  const content = (
    <>
      {icon && <span className={iconColorClass}>{icon}</span>}
      <span className={textColorClass}>{label}</span>
    </>
  );

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
  };
  
  // href가 있으면 Link로, 없으면 button으로 렌더링
  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={combinedClassName}
        onClick={handleClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={combinedClassName}
      {...props}
    >
      {content}
    </button>
  );
}
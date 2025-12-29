'use client';

import { useState } from 'react';
import { InputProps } from '../../types/inputType';
import EyeOpen from '@/assets/eye-open.svg';
import EyeClosed from '@/assets/eye-closed.svg';

export default function Input({
  label,
  error,
  showPassword,
  onTogglePassword,
  fullWidth = false,
  className = '',
  onFocus,
  onBlur,
  disabled,
  type,
  ref,
  ...props
}: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // 눈 아이콘 표시 여부 (onTogglePassword가 제공된 경우에만)
  const showEyeIcon = !!onTogglePassword;
  
  // 컨테이너 스타일
  const containerStyles = fullWidth ? 'w-full' : '';

  // wrapper 스타일 - 테두리 색상 결정
  const getBorderColor = () => {
    if (error) return 'border-red-500';
    if (isFocused) return 'border-primary-500';
    return 'border-gray-200';
  };

  const wrapperStyles = `
    relative 
    flex 
    items-center
    h-14
    rounded-full
    border-2
    bg-white
    transition-all 
    duration-200
    ${getBorderColor()}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  // 인풋 스타일
  const inputStyles = `
    w-full
    h-full
    px-6
    bg-transparent
    text-base
    text-gray-900
    placeholder:text-gray-400
    outline-none
    rounded-full
    disabled:cursor-not-allowed
    ${showEyeIcon ? 'pr-14' : ''}
  `;

  return (
    <div className={containerStyles}>
      {/* 라벨 */}
      {label && (
        <label className="block text-lg font-bold text-gray-900 mb-3">
          {label}
        </label>
      )}

      {/* 인풋 wrapper */}
      <div className={wrapperStyles}>
        <input
          ref={ref}
          type={type}
          className={`${inputStyles} ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          {...props}
        />

        {/* 눈 아이콘 (onTogglePassword가 있는 경우에만 표시) */}
        {showEyeIcon && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-6 flex items-center cursor-pointer"
            tabIndex={-1}
            aria-label="toggle password visibility"
          >
            {showPassword ? (
              <EyeOpen width={24} height={24} />
            ) : (
              <EyeClosed width={24} height={24} />
            )}
          </button>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-2 text-sm text-red-500 ml-4">
          {error}
        </p>
      )}
    </div>
  );
}
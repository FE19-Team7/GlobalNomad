'use client';

import React from 'react';
import { forwardRef, useState } from 'react';
import EyeOpen from '@/assets/eye-open.svg';
import EyeClosed from '@/assets/eye-closed.svg';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      disabled,
      type = 'text',
      fullWidth = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className={`flex flex-col gap-[6px] ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="text-body-lg text-gray-950">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            aria-invalid={!!error}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full min-h-[54px] px-5 py-4 rounded-[16px] bg-white
              border text-body-lg leading-5 text-gray-950 outline-none
              placeholder:text-gray-400
              disabled:bg-gray-100 disabled:text-gray-400
              ${disabled && 'border-gray-100'}
              ${!disabled && error && 'border-red-500'}
              ${!disabled && !error && focused && 'border-primary-500'}
              ${!disabled && !error && !focused && 'border-gray-100'}
              ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              aria-label="비밀번호 토글"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-5 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOpen className="w-6 h-6 cursor-pointer" />
              ) : (
                <EyeClosed className="w-6 h-6 cursor-pointer" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="text-body-lg text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
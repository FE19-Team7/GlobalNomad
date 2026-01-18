'use client';

import React, { forwardRef, useState } from 'react';
import EyeOpen from '@/assets/eye-open.svg';
import EyeClosed from '@/assets/eye-closed.svg';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  multiline?: boolean;
}

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>((props, ref) => {
  const {
    label,
    error,
    disabled,
    type = 'text',
    fullWidth = true,
    className = '',
    multiline,
    ...rest
  } = props;

  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const isTextarea = multiline;

  return (
    <div className={`flex flex-col gap-[6px] ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="text-body-lg text-gray-950 font-bold">
          {label}
        </label>
      )}

      <div className="relative">
        {isTextarea ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            disabled={disabled}
            aria-invalid={!!error}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full min-h-[200px] px-5 pt-4 pb-4
              rounded-[16px] bg-white border
              text-body-lg leading-normal text-gray-950
              placeholder:text-gray-400
              resize-none outline-none
              ${disabled && 'border-gray-100 bg-gray-100'}
              ${!disabled && error && 'border-red-500'}
              ${!disabled && !error && focused && 'border-primary-500'}
              ${!disabled && !error && !focused && 'border-gray-100'}
              ${className}`}
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={inputType}
            disabled={disabled}
            aria-invalid={!!error}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full min-h-[54px] px-5 py-4
              rounded-[16px] bg-white border
              text-body-lg leading-5 text-gray-950
              placeholder:text-gray-400 outline-none
              disabled:bg-gray-100 disabled:text-gray-400
              ${disabled && 'border-gray-100'}
              ${!disabled && error && 'border-red-500'}
              ${!disabled && !error && focused && 'border-primary-500'}
              ${!disabled && !error && !focused && 'border-gray-100'}
              ${className}`}
            {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {isPassword && !isTextarea && (
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
});

Input.displayName = 'Input';
export default Input;
'use client';

import React from 'react';
import SearchIcon from '@/assets/icon_search.svg';

export type SearchProps = {
  title?: string;                     // 상단 타이틀 제목
  value: string;                      // 현재 입력된 검색어
  onChange: (value: string) => void;  // 검색어 변경 시 호출되는 함수
  onSearch?: (value: string) => void; // 검색 시 호출되는 함수
  placeholder?: string;               // 입력 필드의 플레이스홀더 텍스트
  className?: string;                 // 추가적인 CSS 클래스 이름
};

export default function Search({
  title = '무엇을 체험하고 싶으신가요?',
  value,
  onChange,
  onSearch,
  placeholder = '내가 원하는 체험은',
  className = '',
}: SearchProps) {

  // Enter 키 입력 시 검색
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(value.trim());
    }
  };

  // 검색 버튼 클릭 시 검색
  const handleSearch = () => {
    onSearch?.(value.trim());
  };

  return (
    <div className={`flex flex-col items-center gap-9 px-10 py-9 ${className}`}>

      {/* 상단 타이틀 */}
      {title && (
        <h1 className="text-h1 font-bold text-gray-950">
          {title}
        </h1>
      )}

      {/* 검색 입력 필드 */}
      <div className="flex flex-row justify-between w-full items-center pl-8 pr-3 py-[10px]
                border border-transparent focus-within:border-primary-500 rounded-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.05)]">

        <div className="flex flex-row gap-[10px] items-center w-full">
          <SearchIcon className="w-6 h-6 text-gray-950" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full placeholder:text-gray-500 text-gray-950 text-h4 tracking-h4 weight-medium 
                                caret-primary-500 focus:placeholder:text-transparent outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="h-[50px] w-[120px] bg-primary-500 text-white text-body-lg text-center rounded-[14px] weight-medium cursor-pointer flex items-center justify-center"
        >
          검색하기
        </button>
      </div>
    </div>
  )
}
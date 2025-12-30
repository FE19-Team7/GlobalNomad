'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/src/components/button/button';
import FilterButton from '@/src/components/button/FilterButton';
import Calendar from '@/src/components/Calendar/Calendar';
import Input from '@/src/components/Input/Input';

export default function Home() {
  const [searchValue, setSearchValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState('');
  const [showErrorPassword, setShowErrorPassword] = useState(false);
  
  // 필터 버튼 상태
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
    alert(`필터 "${filterId}" ${selectedFilters.includes(filterId) ? '해제' : '선택'}됨`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-25 font-sans py-12 px-4">
      <main className="flex w-full max-w-6xl flex-col gap-12">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold text-gray-900">컴포넌트 테스트</h1>
        </div>

        {/* 버튼 테스트 섹션 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button href="https://vercel.com/new" variant="primary" size="md">
              <Image
                className="invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={16}
                height={16}
              />
              파란 배경 링크 연결
            </Button>

            <Button href="https://nextjs.org/docs" variant="secondary" size="md">
              흰 배경 링크 연결
            </Button>

            <Button variant="primary" size="sm" onClick={() => alert('Clicked!')}>
              Sm 사이즈
            </Button>

            <Button variant="secondary" size="md" loading={true}>
              로딩/비활성화
            </Button>

            <Button variant="secondary" size="md" selected={true}>
              Selected
            </Button>
          </div>

          <div className="w-full mt-4">
            <Button variant="primary" size="lg" fullWidth>
              최대 사이즈 버튼
            </Button>
          </div>
        </section>

        {/* 필터 버튼 테스트 섹션 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">필터 버튼 테스트</h2>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              <FilterButton
                label="예약 거절"
                size="sm"
                selected={selectedFilters.includes('music')}
                onClick={() => toggleFilter('music')}
              />
              <FilterButton
                label="예약 승인"
                size="md"
                selected={selectedFilters.includes('movie')}
                onClick={() => toggleFilter('movie')}
              />
              <FilterButton
                label="예약 보류"
                size="lg"
                selected={selectedFilters.includes('game')}
                onClick={() => toggleFilter('game')}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              <FilterButton
                label="전체"
                selected={selectedFilters.includes('all')}
                onClick={() => toggleFilter('all')}
              />
              <FilterButton
                label="인기순"
                selected={selectedFilters.includes('popular')}
                onClick={() => toggleFilter('popular')}
              />
              <FilterButton
                label="최신순"
                selected={selectedFilters.includes('latest')}
                onClick={() => toggleFilter('latest')}
              />
            </div>
          </div>

          {/* 비활성화 상태 */}
          <div>
            <h3 className="text-base font-semibold text-gray-700 mb-3">비활성화 상태</h3>
            <div className="flex flex-wrap gap-3">
              <FilterButton
                label="비활성화"
                disabled
                onClick={() => alert('비활성화된 버튼')}
              />
              <FilterButton
                label="선택+비활성화"
                selected
                disabled
                onClick={() => alert('비활성화된 버튼')}
              />
            </div>
          </div>
        </section>

        {/* 인풋 테스트 섹션 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Input Components</h2>
          <div className="flex flex-col gap-6 max-w-2xl">
            {/* 1. 기본 상태 (포커스 아웃) - gray-200 */}
            <Input 
              label="기본 인풋" 
              placeholder="text" 
              fullWidth 
            />

            {/* 2. 포커스 상태 (타이핑 가능) - primary-500 */}
            <Input
              label="검색 인풋 (포커스)"
              placeholder="검색어를 입력하세요"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              fullWidth
            />

            {/* 3. 에러 상태 - red-500 */}
            <Input 
              label="에러 인풋" 
              placeholder="text" 
              error="에러 메시지입니다" 
              fullWidth 
            />

            {/* 4. 비밀번호 인풋 (눈 아이콘 있음) */}
            <Input
              label="비밀번호"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              fullWidth
            />

            {/* 5. 비밀번호 에러 상태 */}
            <Input
              label="비밀번호 에러"
              type={showErrorPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              value={errorPassword}
              onChange={(e) => setErrorPassword(e.target.value)}
              error="비밀번호를 8자 이상 입력해주세요"
              showPassword={showErrorPassword}
              onTogglePassword={() => setShowErrorPassword(!showErrorPassword)}
              fullWidth
            />

            {/* 6. 비활성화 */}
            <Input 
              label="비활성화" 
              placeholder="비활성화된 인풋" 
              disabled 
              fullWidth 
            />
          </div>
        </section>

        {/* 캘린더 테스트 섹션 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">캘린더 컴포넌트 테스트</h2>
          <div className="flex justify-center">
            <Calendar />
          </div>
        </section>
      </main>
    </div>
  );
}
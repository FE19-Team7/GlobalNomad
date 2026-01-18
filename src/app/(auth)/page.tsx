'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import HeroSection from "@/src/features/mainpage/components/HeroSection";
import SearchSection from "@/src/features/mainpage/components/SearchSection";
import PopularActivitiesSection from "@/src/features/mainpage/components/PopularActivitiesSection";
import AllActivitiesSection from "@/src/features/mainpage/components/AllActivitiesSection";
import SearchResultsSection from '@/src/features/mainpage/components/SearchResultsSection';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchTerm = searchParams.get('keyword') || '';
  const pageParam = searchParams.get('page');
  const currentPage = (pageParam && Number(pageParam) > 0) ? Number(pageParam) : 1;

  // 공통 쿼리 업데이트 함수
  const updateQueryParams = (params: { keyword?: string; page?: number }) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // keyword 업데이트
    if (params.keyword !== undefined) {
      if (params.keyword.trim()) {
        newParams.set('keyword', params.keyword);
        newParams.delete('page');    // 검색어가 바뀌면 페이지 1로 리셋 (page 쿼리 삭제)
      } else {
        newParams.delete('keyword');
        newParams.delete('page');
      }
    }

    // page 업데이트
    if (params.page !== undefined) {
      if (params.page > 1) {
        newParams.set('page', params.page.toString());
      } else {
        newParams.delete('page');    // 1페이지는 주소에 미표시
      }
    }

    const queryString = newParams.toString();
    router.push(queryString ? `/?${queryString}` : '/', { scroll: false });
  };

  const handleSearch = (term: string) => {
    updateQueryParams({ keyword: term });
  };

  const handlePageChange = (page: number) => {
    updateQueryParams({ page });
  };

  return (
    <div className="min-h-screen flex flex-col gap-16">
      <div className="bg-gradient-to-t from-white via-[#F7FBFF] to-[#BBDDFF]/50">
        <div className="w-full max-w-[1200px] mx-auto mt-[53px] px-10 py-[50px]">
          <HeroSection />
          <SearchSection onSearch={handleSearch} />
        </div>
      </div>

      <main className="w-full max-w-[1200px] mx-auto px-10 py-5 flex flex-col gap-16">
        {searchTerm ? (
          <SearchResultsSection
            searchTerm={searchTerm}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        ) : (
          <div className="flex flex-col gap-16">
            <PopularActivitiesSection />
            <AllActivitiesSection
              page={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>
    </div>
  );
}

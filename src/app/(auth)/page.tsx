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

  const handleSearch = (term: string) => {
    if (term.trim()) {
      router.push(`/?keyword=${encodeURIComponent(term)}`);
    } else {
      router.push('/');
    }
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
          <SearchResultsSection searchTerm={searchTerm} />
        ) : (
          <div className="flex flex-col gap-16">
            <PopularActivitiesSection />
            <AllActivitiesSection />
          </div>
        )}
      </main>
    </div>
  );
}

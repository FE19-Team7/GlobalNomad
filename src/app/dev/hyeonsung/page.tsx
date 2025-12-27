'use client';

import Image from 'next/image';
import Button from '@/src/components/button/button';
import Calendar from '@/src/components/Calendar/Calendar';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-25 font-sans py-12 px-4">
      <main className="flex w-full max-w-6xl flex-col gap-12">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold text-gray-900">
            컴포넌트 테스트
          </h1>
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
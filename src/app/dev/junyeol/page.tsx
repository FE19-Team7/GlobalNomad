'use client';

import { useState } from 'react';
import Dropdown from '@/src/components/Dropdown/Dropdown';

export default function JunyeolPage() {
  const [value, setValue] = useState<string>();

  return (

    <main className="flex p-4 gap-4 justify-center items-center">

      {/* 기본 옵션 드롭다운 */}
      <Dropdown
        placeholder="옵션 선택"
        value={value}
        onChange={setValue}
        items={[
          { label: '옵션 A', value: 'A' },
          { label: '옵션 B', value: 'B' },
          { label: '옵션 C', value: 'C' },
        ]}
      />

      {/* 헤더용 (link + action) */}
      <Dropdown
        label="홍길동"
        items={[
          { type: 'link', label: '마이 페이지', href: '/mypage' },
          {
            type: 'action',
            label: '로그아웃',
            onSelect: () => alert('로그아웃'),
          },
        ]}
        className="w-50 justify-between"
      />

      {/* disabled 상태 */}
      <Dropdown
        label="비활성화"
        disabled
        items={[
          { label: '테스트', value: 'test' },
        ]}
      />

      {/* 현재 선택 값 표시 */}
      <div className="text-sm text-gray-600">
        현재 선택 값: {value ?? '없음'}
      </div>
    </main>

  );
}
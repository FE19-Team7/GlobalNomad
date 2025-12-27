'use client';

import { useState } from 'react';
import UserMenuDropDown from '@/src/components/Dropdown/UserMenuDropDown';
import PriceSortDropdown, { PriceSortValue } from '@/src/components/Dropdown/PriceSortDropdown';
import ActivitiesCategoryDropdown, { ActivityCategory } from '@/src/components/Dropdown/ActivitiesCategoryDropdown';
import ReservationsDropdown, { ReservationItem } from '@/src/components/Dropdown/ReservationsDropdown';

// api 연동 전 목업 데이터
const MOCK_RESERVATIONS: ReservationItem[] = [
  {
    label: '서핑 입문 체험',
    value: '1',
    reservedAt: '2024-12-01',
  },
  {
    label: '도자기 원데이 클래스',
    value: '2',
    reservedAt: '2025-01-03',
  },
  {
    label: '함께 배우는 즐거운 스트릿댄스',
    value: '3',
    reservedAt: '2025-02-10',
  },
];

// ReservationsDropdown 최근 예약 기준 정렬
const sortedReservations = [...MOCK_RESERVATIONS].sort(
  (a, b) =>
    new Date(b.reservedAt).getTime() -
    new Date(a.reservedAt).getTime()
);

export default function JunyeolPage() {
  const [sort, setSort] = useState<PriceSortValue>('price_asc');
  const [category, setCategory] = useState<ActivityCategory | undefined>();
  const [reservation, setReservation] = useState<string | undefined>(
    sortedReservations[0]?.value
  );

  return (
    <div className="flex flex-col ph-10 gap-20 justify-center items-center">
      <div className="flex ph-10 gap-10 justify-center items-center">
        {/* UserMenuDropDown 컴포넌트 사용 예시 */}
        {/* api 연동시 로그아웃 로직 구현 */}
        <UserMenuDropDown
          userName="김준열"
          onLogout={() => alert('로그아웃')}
          className="w-25"
        />

        {/* PriceSortDropdown 컴포넌트 사용 예시 */}
        <PriceSortDropdown
          value={sort}
          onChange={(v) => setSort(v)}
          className="w-25"
        />
      </div>
      <div className="flex ph-10 gap-10 justify-center items-center">
        {/* ActivitiesCategoryDropdown 컴포넌트 사용 예시 */}
        <ActivitiesCategoryDropdown
          value={category}
          onChange={setCategory}
          className="w-[700px]"
        />
      </div>
      <div className="flex ph-10 gap-10 justify-center items-center">
        {/* ReservationsDropdown 컴포넌트 사용 예시 */}
        <ReservationsDropdown
          items={sortedReservations}
          value={reservation}
          onChange={setReservation}
          className="w-[640px]"
        />
      </div>
    </div>

  );
}
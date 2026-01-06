'use client'

import { useState, useRef } from 'react';
import SideMenu from "@/src/components/SideMenu/SideMenu";
import UserMenuDropDown from '@/src/components/Dropdown/UserMenuDropDown';
import PriceSortDropdown, { PriceSortValue } from '@/src/components/Dropdown/PriceSortDropdown';
import ActivitiesCategoryDropdown, { ActivityCategory } from '@/src/components/Dropdown/ActivitiesCategoryDropdown';
import ReservationsDropdown, { ReservationItem } from '@/src/components/Dropdown/ReservationsDropdown';
import { CalendarDayCell } from '@/src/components/Calendar/CalendarDayCell';
import { EventBadge } from '@/src/components/Calendar/EventBadge';
import { Pagination } from '@/src/components/Pagination/Pagination';
import Search from "@/src/components/Search/search";
import ReservationsTimeDropdown from '@/src/components/Dropdown/ReservationsTimeDropdown';
import Popover from '@/src/components/Popover/Popover'
import Button from '@/src/components/Button/Button';

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

const MOCK_TIMES = [
  { id: 1, startTime: '14:00', endTime: '15:00' },
  { id: 2, startTime: '15:00', endTime: '16:00' },
  { id: 3, startTime: '16:00', endTime: '17:00' },
]

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
  const [selectedTimeId, setSelectedTimeId] = useState<number>(
    MOCK_TIMES[0].id
  )
  const [currentPage, setCurrentPage] = useState(1);
  const TOTAL_PAGES = 12;
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    console.log('검색어:', value);
  }

  const anchorRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-10 justify-center items-center">
      <h2 className="text-h2">Dropdown 컴포넌트</h2>
      <div className="flex flex-col border border-primary-100 rounded-xl p-10 gap-10 justify-center items-center">
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

        {/* ActivitiesCategoryDropdown 컴포넌트 사용 예시 */}
        <ActivitiesCategoryDropdown
          value={category}
          onChange={setCategory}
          className="w-[700px]"
        />

        {/* ReservationsDropdown 컴포넌트 사용 예시 */}
        <ReservationsDropdown
          items={sortedReservations}
          value={reservation}
          onChange={setReservation}
          className="w-[640px]"
        />

        {/* ReservationsTimeDropDown 컴포넌트 사용 예시 */}
        <ReservationsTimeDropdown
          times={MOCK_TIMES}
          value={selectedTimeId}
          onChange={setSelectedTimeId}
          className="w-[200px]"
        />
      </div>

      <div className="flex flex-col gap-10 justify-center items-center">
        <h2 className="text-h2">ReservationsTimeDropDown 컴포넌트를 사용하는 Popover 컴포넌트 테스트</h2>
        <div className="flex flex-col border border-primary-100 rounded-xl p-10 gap-10 justify-center items-center">
          <Button
            ref={anchorRef}
            onClick={() => setOpen(true)}
          >
            테스트
          </Button>

          <Popover
            isOpen={open}
            onClose={() => setOpen(false)}
            dateLabel="2024-01-09"
            anchorRef={anchorRef}
          />
        </div>
      </div>

      <h2 className="text-h2">CallendarDayCell, EventBadge 컴포넌트</h2>
      <div className="flex flex-col border border-primary-100 rounded-xl p-10 gap-10 justify-center items-center">
        {/* CalendarDayCell 컴포넌트 사용 예시 */}
        {/* 달력 구조는 따로 컴포넌트로 만들어야 될듯 */}
        <div className="grid grid-cols-5 gap-4 h-[124px]">
          {/* 이벤트 없음 */}
          <CalendarDayCell
            day={1}
            summary={{
              reserved: 0,
              approved: 0,
              completed: 0,
            }}
          />

          {/* 예약만 */}
          <CalendarDayCell
            day={2}
            summary={{
              reserved: 2,
              approved: 0,
              completed: 0,
            }}
          />

          {/* 예약 + 승인 */}
          <CalendarDayCell
            day={3}
            summary={{
              reserved: 1,
              approved: 3,
              completed: 0,
            }}
          />

          {/* 예약 + 승인 + 완료 */}
          <CalendarDayCell
            day={4}
            summary={{
              reserved: 1,
              approved: 1,
              completed: 1,
            }}
          />

          {/* 완료만 */}
          <CalendarDayCell
            day={5}
            summary={{
              reserved: 0,
              approved: 0,
              completed: 4,
            }}
          />
        </div>
      </div>

      <div className="flex flex-col border border-primary-100 rounded-xl p-10 gap-10 justify-center items-center">
        {/* EventBadge 컴포넌트 사용 예시 */}
        <div className="flex items-center gap-4">
          <EventBadge status="RESERVED" count={1} />
          <EventBadge status="APPROVED" count={3} />
          <EventBadge status="COMPLETED" count={7} />
        </div>
      </div>

      <h2 className="text-h2">Pagination 컴포넌트</h2>
      <div className="flex flex-col border border-primary-100 rounded-xl p-10 gap-10 justify-center items-center">
        {/* Pagination 컴포넌트 사용 예시 */}
        <Pagination
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
          maxPageButtons={5}
          onPageChange={setCurrentPage}
        />
      </div>

      <h2 className="text-h2">SideMenu 컴포넌트</h2>
      <div className="flex flex-col border border-primary-100 rounded-xl p-10 gap-10 justify-center items-center">
        {/* SideMenu 컴포넌트 사용 예시 */}
        <SideMenu
          className="w-[290px]"
          profileImageUrl={null}
          onProfileEdit={() => {
            console.log("프로필 편집");
          }} />
      </div>

      <h2 className="text-h2">Search 컴포넌트</h2>
      <div className="flex flex-col border border-primary-100 rounded-xl p-10 gap-10 justify-center items-center">
        {/* Search 컴포넌트 사용 예시 */}
        <Search
          value={searchValue}
          onChange={setSearchValue}
          onSearch={handleSearch}
          className="w-[660px]"
        />
      </div>

    </div>
  );
}

'use client';

import { useState } from 'react';
import ActivityCard from '@/src/components/Card/ActivityCard';
import { Pagination } from '@/src/components/Pagination/Pagination';
import { mockActivities } from '@/src/components/Card/MockActivities';

export default function AllActivitiesList() {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  // 전체 데이터
  const allItems = mockActivities;
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  // 현재 페이지 데이터
  const currentItems = allItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="grid grid-cols-4 gap-x-6 gap-y-[30px]">
        {currentItems.map((item) => (
          <ActivityCard key={item.id} {...item} />
        ))}
      </div>
      <div className="mt-[30px] flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          maxPageButtons={7}
        />
      </div>
    </div>
  );
}

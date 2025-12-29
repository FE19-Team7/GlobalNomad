import { useMemo } from "react";

type UsePaginationOptions = {
  currentPage: number;      // 현재 페이지, 1부터 시작
  totalPages: number;       // 전체 페이지 수
  maxPageButtons?: number;  // 최대 버튼 수
};

/*
    현재 페이지와 전체 페이지 수, 최대 버튼 수를 기반으로
    보여줄 페이지 번호 배열을 반환하는 훅
*/
export function usePagination({
  currentPage,
  totalPages,
  maxPageButtons = 7,
}: UsePaginationOptions) {
  return useMemo(() => {
    if (totalPages <= 0) return []; // 페이지가 없으면 빈 배열 반환

    const pages: number[] = [];
    const visibleCount = Math.min(totalPages, maxPageButtons); // 실제로 표시할 버튼 수

    // currentPage를 가운데에 두도록 start/end 계산
    let start = currentPage - Math.floor(visibleCount / 2);
    let end = start + visibleCount - 1;

    // 앞 범위가 1보다 작으면 1부터 시작하도록 조정
    if (start < 1) {
      start = 1;
      end = start + visibleCount - 1;
    }

    // 뒤 범위가 totalPages를 넘어가면 끝에서 맞추도록 조정
    if (end > totalPages) {
      end = totalPages;
      start = end - visibleCount + 1;
      if (start < 1) start = 1;
    }

    // start부터 end까지 페이지 번호 채우기
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages, maxPageButtons]);
}
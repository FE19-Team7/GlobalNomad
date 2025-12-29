'use client';

import Link from 'next/link';
import ArrowIcon from '@/assets/icon_pagination_arrow.svg'
import { usePagination } from '@/src/hooks/usePagination';

/**
 * 숫자 버튼 컴포넌트
 */
type NumberButtonProps = {
  page: number;         // 버튼에 표시될 페이지 번호
  isActive: boolean;    // 현재 페이지 활성화 여부(선택된 페이지인지)
  href?: string;        // 제공되면 Link로 렌더링할 href
  onClick?: () => void; // 버튼 클릭 시 호출될 콜백
};

function NumberButton({ page, isActive, href, onClick }: NumberButtonProps) {
  // 활성/비활성 상태에 따른 색상 분기
  const classes = `inline-flex items-center justify-center w-10 h-10 text-body border-b-2 cursor-pointer
    ${isActive 
        ? 'text-gray-950 border-primary-500' 
        : 'text-gray-300 border-transparent hover:text-gray-700 hover:bg-primary-100/60 hover:rounded-md'}`;

  // href가 있으면 Link로 렌더링
  if (href) {
    return (
      <Link
        href={href}
        scroll={false}
        aria-current={isActive ? 'page' : undefined}
        className={classes}
        onClick={onClick}
      >
        <span>{page}</span>
      </Link>
    );
  }

  // href가 없으면 onPageChange로 상태만 변경하는 버튼
  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      className={classes}
      onClick={onClick}
    >
      <span>{page}</span>
    </button>
  );
}

/**
 * 화살표 버튼 컴포넌트
 */
type ArrowButtonProps = {
  direction: 'prev' | 'next'; // 화살표 방향(이전 또는 다음)
  disabled: boolean;          // 버튼 비활성화 여부
  href?: string;              // 제공되면 Link로 렌더링할 href
  onClick?: () => void;       // 버튼 클릭 시 호출될 콜백
};

function ArrowButton({ direction, disabled, href, onClick }: ArrowButtonProps) {
  const icon =
    <ArrowIcon 
        className={`
            w-3 h-3
            ${direction === 'prev' ? 'rotate-180' : ''}
            `}
            aria-hidden="true"
    />

  const ariaLabel = direction === 'prev' ? '이전 페이지' : '다음 페이지';

  // 비활성 여부에 따라 색상 분기
  const classes = `flex items-center justify-center w-10 h-10 
    ${disabled 
    ? 'text-gray-300 cursor-not-allowed' 
    : 'text-gray-950 cursor-pointer hover:text-gray-700'}`;

  // Link 기반 이동
  if (href && !disabled) {
    return (
      <Link
        href={href}
        scroll={false}
        aria-label={ariaLabel}
        className={classes}
        onClick={onClick}
      >
        {icon}
      </Link>
    );
  }

  // 버튼 기반 이동
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
      onClick={disabled ? undefined : onClick}
    >
      {icon}
    </button>
  );
}

/**
 * Pagination 메인 컴포넌트
 */
type PaginationProps = {
  currentPage: number;                    // 현재 페이지 (1부터 시작)
  totalPages: number;                     // 전체 페이지 수
  onPageChange?: (page: number) => void;  // 페이지 변경 콜백 (href가 없을 때 사용)
  hrefBuilder?: (page: number) => string; // 페이지별 링크 생성 함수 (존재하면 Link로 렌더링)
  maxPageButtons?: number;                // 가운데에 표시될 최대 페이지 수
  className?: string;                     // 추가로 적용시킬 Tailwind 클래스
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hrefBuilder,
  maxPageButtons = 7,
  className,
}: PaginationProps) {
  // totalPage가 0, 음수 등 비정상적인 값이여도 안전하게 처리
  const safeTotalPages = Math.max(totalPages, 0);

  // currentPage를 1 ~ safeTotalPages 범위로 보정
  const safeCurrentPage =
    safeTotalPages > 0 ? Math.min(Math.max(currentPage, 1), safeTotalPages) : 1;

  // 화면에 보여줄 페이지 번호 배열 계산 (ex: [3,4,5,6,7])
  const pages = usePagination({
    currentPage: safeCurrentPage,
    totalPages: safeTotalPages,
    maxPageButtons,
  });

  // 1페이지 이하일 땐 렌더링하지 않음
  if (safeTotalPages <= 1) return null;

  // 이전/다음 페이지 번호 계산
  const prevPage = safeCurrentPage - 1;
  const nextPage = safeCurrentPage + 1;

  const isFirst = safeCurrentPage === 1;
  const isLast = safeCurrentPage === safeTotalPages;

  // hrefBuilder가 있으면 page -> URL을 만들어 주는 헬퍼
  const buildHref = (page: number) =>
    hrefBuilder ? hrefBuilder(page) : undefined;

  /**
   * 페이지 변경 핸들러
   * onPageChange가 없으면 아무 동작도 하지 않음
   * page가 범위를 벗어나거나 같은 페이지로 이동하려고 하면 무시
   */
  const handleChange = (page: number) => {
    if (!onPageChange) return;
    if (page < 1 || page > safeTotalPages) return;
    if (page === safeCurrentPage) return;
    onPageChange(page);
  };

  return (
    <nav aria-label="Pagination"
      className={`flex items-center justify-center gap-0.5${className ? ` ${className}` : ''}`}
    >
      {/* 이전 화살표 */}
      <ArrowButton
        direction="prev"
        disabled={isFirst}
        href={!isFirst ? buildHref(prevPage) : undefined}
        onClick={!hrefBuilder ? () => handleChange(prevPage) : undefined}
      />

      {/* 숫자 버튼 */}
      {pages.map((page) => (
        <NumberButton
          key={page}
          page={page}
          isActive={page === safeCurrentPage}
          href={buildHref(page)}
          onClick={!hrefBuilder ? () => handleChange(page) : undefined}
        />
      ))}

      {/* 다음 화살표 */}
      <ArrowButton
        direction="next"
        disabled={isLast}
        href={!isLast ? buildHref(nextPage) : undefined}
        onClick={!hrefBuilder ? () => handleChange(nextPage) : undefined}
      />
    </nav>
  );
}
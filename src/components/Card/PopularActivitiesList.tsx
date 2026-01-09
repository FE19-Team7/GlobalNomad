'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ActivityCard from '@/src/components/Card/ActivityCard';
import { getMockActivities } from '@/src/components/Card/MockActivities';
import ArrowRightIcon from '@/src/assets/icon_arrow_right.svg';
import ArrowLeftIcon from '@/src/assets/icon_arrow_left.svg';

export default function PopularActivitiesList() {

  // 초기 데이터 로드
  const initialData = getMockActivities(0, 4);
  const [items, setItems] = useState(initialData.data);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const remainder = items.length % 4;
  const emptyCardsCount = remainder === 0 ? 0 : 4 - remainder;

  // 데이터 로드 함수
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      // TODO: API 연동 시 수정 예정
      const result = getMockActivities(page, 4);
      if (result.data.length > 0) {
        setItems((prevItems) => [...prevItems, ...result.data]);
        setHasMore(result.hasMore);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading]);

  // 마지막 요소가 보이면 로드 - 모바일
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);

  // 스크롤 위치를 감지하여 왼쪽 버튼 노출 제어
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      setShowLeftBtn(scrollLeft > 0);
      setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const getMoveDistance = () => {
    if (scrollRef.current && scrollRef.current.firstElementChild) {
      const firstCard = scrollRef.current.firstElementChild as HTMLElement;
      const cardWidth = firstCard.offsetWidth;
      const gap = 16;
      return (cardWidth + gap) * 4;
    }
    return 0;
  };

  // 왼쪽 화살표 버튼 - 이전으로 이동
  const handlePrevBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -getMoveDistance(),
        behavior: 'smooth',
      });
    }
  };

  // 오른쪽 화살표 버튼 - 다음으로 이동
  const handleNextBtn = async () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const isNearEnd = scrollLeft + clientWidth >= scrollWidth - 50;

      if (isNearEnd && hasMore) {
        await loadMore();
      }
      scrollRef.current.scrollBy({
        left: getMoveDistance(),
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full group">

      {/* 왼쪽 화살표 버튼 */}
      {showLeftBtn && (
        <button
          onClick={handlePrevBtn}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 
                     w-12 h-12 flex items-center justify-center 
                     bg-white border border-gray-200 rounded-full shadow-xl
                     hover:bg-gray-50"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="pr-4 flex gap-4 overflow-x-hidden scroll-smooth"
      >
        {items.map(item => (
          <div key={item.id} className="flex-shrink-0 w-[calc(25%-12px)]">
            <ActivityCard {...item} />
          </div>
        ))}

        {/* 비어 있는 카드 영역 생성 */}
        {emptyCardsCount > 0 && (
          <div
            className="flex-shrink-0"
            style={{
              width: `calc(${emptyCardsCount * 25}% - ${emptyCardsCount * 12}px)`
            }}
          />
        )}

        <div ref={loaderRef} className="flex-shrink-0" />
      </div>

      {/* 오른쪽 화살표 버튼 */}
      {(hasMore || showRightBtn) && (
        <button
          onClick={handleNextBtn}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 
                     w-12 h-12 flex items-center justify-center 
                     bg-white border border-gray-200 rounded-full shadow-xl
                     hover:bg-gray-50"
        >
          <ArrowRightIcon className="w-6 h-6 text-gray-700" />
        </button>
      )}
    </div>
  );
}

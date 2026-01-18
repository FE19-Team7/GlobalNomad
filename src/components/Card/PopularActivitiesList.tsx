'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ActivityCard from '@/src/components/Card/ActivityCard';
import ArrowRightIcon from '@/src/assets/icon_arrow_right.svg';
import ArrowLeftIcon from '@/src/assets/icon_arrow_left.svg';
import { Activity, getPopularActivities } from '@/src/features/mainpage/activities';

export default function PopularActivitiesList() {
  const [items, setItems] = useState<Activity[]>([]);
  const [cursorId, setCursorId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // 마지막 카드 그룹 빈 영역을 채우기 위한 카드 개수 계산
  const remainder = items.length % 4;
  const emptyCardsCount = remainder === 0 ? 0 : 4 - remainder;

  // 데이터 로드 함수
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const result = await getPopularActivities(cursorId, 4);

      if (result?.activities && result.activities.length > 0) {
        setItems((prevItems) => {
          const merged = [...prevItems, ...result.activities];
          const map = new Map(merged.map(item => [item.id, item]));
          return Array.from(map.values());
        });
        setCursorId(result.cursorId);
        setHasMore(result.cursorId !== null);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cursorId, hasMore, isLoading]);

  // 마지막 요소가 보이면 로드 - 모바일
  useEffect(() => {
    loadMore();
  }, []);

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
    setIsScrolling(true);

    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -getMoveDistance(),
        behavior: 'smooth',
      });
    }

    setTimeout(() => setIsScrolling(false), 600);
  };

  // 오른쪽 화살표 버튼 - 다음으로 이동
  const handleNextBtn = async () => {
    setIsScrolling(true);

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

    setTimeout(() => setIsScrolling(false), 600);
  };

  return (
    <div className="relative w-full">

      {/* 왼쪽 화살표 버튼 */}
      {showLeftBtn && (
        <button
          onClick={handlePrevBtn}
          disabled={isScrolling}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 
                     w-12 h-12 flex items-center justify-center 
                     bg-white border border-gray-200 rounded-full shadow-xl
                     hover:bg-gray-50 cursor-pointer"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-hidden scroll-smooth"
      >
        {items.map(item => (
          <div key={item.id} className="flex-shrink-0 w-[calc(25%-12px)]">
            <ActivityCard {...item} />
          </div>
        ))}

        {/* 비어 있는 카드 영역 생성 */}
        {emptyCardsCount > 0 &&
          Array.from({ length: emptyCardsCount }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex-shrink-0 w-[calc(25%-12px)]"
              aria-hidden="true"
            />
          ))
        }

        {/* 무한 스크롤 감지를 위한 타겟 요소 */}
        <div ref={loaderRef} className="flex-shrink-0" />
      </div>

      {/* 오른쪽 화살표 버튼 */}
      {(hasMore || showRightBtn) && (
        <button
          onClick={handleNextBtn}
          disabled={isScrolling}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 
                     w-12 h-12 flex items-center justify-center 
                     bg-white border border-gray-200 rounded-full shadow-xl
                     hover:bg-gray-50 cursor-pointer"
        >
          <ArrowRightIcon className="w-6 h-6 text-gray-700" />
        </button>
      )}
    </div>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useInfiniteScroll } from '@/src/lib/hooks/useInfiniteScroll';
import MyActivitiesCard from '@/src/components/Card/MyActivitiesCard';
import Button from '@/src/components/Button/Button';
import Earth from '@/src/assets/earth.svg';

import { deleteMyActivity, getMyActivities } from '@/src/features/myActivities/api/myActivities';
import type { MyActivity } from '@/src/features/myActivities/type';

const PAGE_SIZE = 20;

export default function MyActivitiesPage() {
  const router = useRouter();

  const [items, setItems] = useState<MyActivity[]>([]);
  const [cursorId, setCursorId] = useState<number | undefined>(undefined);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 중복 호출 방지 락
  const inFlightRef = useRef(false);

  // 무한 스크롤 컨테이너
  const scrollRootRef = useRef<HTMLElement | null>(null);

  const fetchNext = useCallback(async () => {
    if (inFlightRef.current || !hasNext) return;

    inFlightRef.current = true;
    setIsLoading(true);

    try {
      const data = await getMyActivities({ cursorId, size: PAGE_SIZE });

      // 안전망: id 중복 제거 및 최신순 정렬 (StrictMode/인터섹션 중복 호출 대비)
      setItems((prev) => {
        const merged = [...prev, ...data.activities];

        // 1) id 중복 제거
        const unique = Array.from(new Map(merged.map((x) => [x.id, x])).values());

        // 2) 최신순 정렬: createdAt 내림차순 → createdAt 없으면 id 내림차순
        unique.sort((a, b) => {
          const at = a.createdAt ? Date.parse(a.createdAt) : NaN;
          const bt = b.createdAt ? Date.parse(b.createdAt) : NaN;

          const aValid = Number.isFinite(at);
          const bValid = Number.isFinite(bt);

          // 둘 다 createdAt 유효: createdAt 최신순
          if (aValid && bValid) return bt - at;

          // 한쪽만 유효: createdAt 있는 쪽을 앞으로(=더 최신으로 간주)
          if (aValid && !bValid) return -1;
          if (!aValid && bValid) return 1;

          // 둘 다 없거나 파싱 불가: id 큰 순
          return b.id - a.id;
        });

        return unique;
      });

      // 다음 커서 판단 (스웨거: cursorId가 null이면 종료)
      if (data.cursorId === null) {
        setHasNext(false);
        return;
      }

      // 추가 안전망: 빈 배열이면 종료
      if (data.activities.length === 0) {
        setHasNext(false);
        return;
      }

      // 커서가 그대로면 무한루프 방지
      if (data.cursorId === cursorId) {
        setHasNext(false);
        return;
      }

      setCursorId(data.cursorId);
    } catch (e) {
      alert(e instanceof Error ? e.message : '목록 조회 실패');
      setHasNext(false);
    } finally {
      setIsLoading(false);
      inFlightRef.current = false;
    }
  }, [cursorId, hasNext]);

  useEffect(() => {
    fetchNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const targetRef = useInfiniteScroll({
    onIntersect: fetchNext,
    disabled: isLoading || !hasNext,
    rootRef: scrollRootRef,
  });

  const onClickCreate = () => {
    router.push('/activities/create');
  };

  // 실패하면 throw 해야 카드에서 모달이 닫히지 않음
  const handleDelete = async (id: number) => {
    try {
      await deleteMyActivity(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      const msg = e instanceof Error ? e.message : '삭제 실패';
      alert(msg);
      throw e;
    }
  };

  const isEmpty = useMemo(
    () => !isLoading && items.length === 0,
    [isLoading, items.length]
  );

  return (
    <>
      <section
        ref={scrollRootRef}
        className="flex flex-col gap-[30px] w-full max-w-[640px] h-[calc(100vh-200px)] overflow-y-auto overscroll-contain noScrollbar"
      >
        {/* 무한스크롤 상단에 헤더 고정 */}
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between py-[10px] flex-shrink-0">
          <div className="flex flex-col items-start justify-center gap-[10px]">
            <h1 className="text-h3 font-bold text-gray-950">내 체험 관리</h1>
            <p className="text-body text-gray-500">
              체험을 등록하거나 수정 및 삭제가 가능합니다.
            </p>
          </div>

          <Button
            type="button"
            onClick={onClickCreate}
            className="w-[138px] h-[48px] text-body-lg"
          >
            체험 등록하기
          </Button>
        </div>

        {/* 무한 스크롤 카드 리스트 */}
        <div className="flex flex-col gap-[24px]">
          {isEmpty ? (
            <div className="flex flex-col items-center">
              <figure className="w-[182px] h-[182px] flex items-center justify-center">
                <Earth />
              </figure>
              <p className="text-h4 text-gray-600">아직 등록한 체험이 없어요.</p>
            </div>
          ) : (
            <>
              {items.map((a) => (
                <MyActivitiesCard
                  key={a.id}
                  activity={{
                    id: a.id,
                    title: a.title,
                    rating: a.rating,
                    reviewCount: a.reviewCount,
                    price: a.price,
                    bannerImageUrl: a.bannerImageUrl,
                    onDelete: handleDelete,
                  }}
                />
              ))}

              <div ref={targetRef} className="h-10" />

              {isLoading && (
                <div className="py-6 text-center text-gray-500 text-body">
                  불러오는 중...
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* 무한스크롤 스크롤바 제거 */}
      <style jsx>{`
        .noScrollbar {
          -ms-overflow-style: none; /* IE/Edge */
          scrollbar-width: none; /* Firefox */
        }
        .noScrollbar::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
      `}</style>
    </>
  );
}

"use client";

import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll";
import ReservationCard from "@/src/components/Card/ReservationCard";
import { ReservationStatus } from "@/src/components/Card/StatusBadge";

interface Reservation {
  id: number;
  activity: {
    id: number;
    title: string;
    bannerImageUrl?: string;
  };
  status: ReservationStatus;
  reviewSubmitted?: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
}

interface ReservationListProps {
  items: Reservation[];
  hasNext: boolean;
  onLoadMore: () => void;
  onCancel?: (id: number) => void;
  onReview?: (id: number) => void;
}

export default function ReservationList({
  items,
  hasNext,
  onLoadMore,
  onCancel,
  onReview,
}: ReservationListProps) {
  const bottomRef = useInfiniteScroll({
    onIntersect: onLoadMore,
    disabled: !hasNext,
  });

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <ReservationCard
          key={item.id}
          {...item}
          reviewSubmitted={item.reviewSubmitted ?? false}
          onCancel={onCancel}
          onReview={onReview}
        />
      ))}

      {hasNext && <div ref={bottomRef} className="h-1" />}
    </div>
  );
}

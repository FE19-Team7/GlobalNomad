'use client';
import React from 'react';
import styles from './CalendarBadge.module.css';

export type StatusItem = {
  key: string;
  label: string;
  count: number;
  variant?: 'primary' | 'warning' | 'muted' | string;
};

export interface CalendarBadgeProps {
  dateLabel?: string | number;
  dot?: { visible: boolean; color?: string; offset?: { top?: number; right?: number } };
  statuses: StatusItem[];
  size?: 'sm' | 'md' | 'lg';
  onClickBadge?: (key: string, date?: string | number) => void;
  className?: string;
  dateKey?: string | number;
}

/* 상태별 색상 매핑 — 프로젝트 색상으로 교체 가능 */
const variantStyle: Record<string, { background: string; color: string }> = {
  primary: { background: '#E5F3FF', color: '#3D9EF2' }, // 예약
  warning: { background: '#FFF8DD', color: '#FFB051' }, // 승인
  muted: { background: 'rgba(237,238,242,1)', color: '#84858C' },  // 완료
};

export default function CalendarBadge({
  dateLabel = '',
  dot,
  statuses,
  size = 'md',
  onClickBadge,
  className,
  dateKey,
}: CalendarBadgeProps) {
  // 기본 도트 오프셋 (필요시 props로 조정)
  const dotTop = dot?.offset?.top ?? 6;
  const dotRight = dot?.offset?.right ?? 6;

  return (
    <div
      className={`${styles.root} ${className ?? ''}`}
      role="group"
      aria-label={`calendar cell ${dateLabel}`}
    >
      {/* 날짜 (상단 중앙) */}
      <div className={styles.date}>{dateLabel}</div>

      {/* 배지 리스트 (세로 스택, gap: 5px) */}
      <div className={styles.badgeList} role="list">
        {statuses.map((st) => {
          const vs = variantStyle[st.variant ?? 'primary'] ?? variantStyle.primary;
          return (
            <button
              key={st.key}
              type="button"
              className={styles.badge}
              onClick={() => onClickBadge?.(st.key, dateKey ?? dateLabel)}
              aria-label={`${st.label} ${st.count}건`}
              style={{ background: vs.background, color: vs.color }}
            >
              <span className={styles.badgeLabel}>{st.label}</span>
              <span className={styles.badgeCount}>{st.count}</span>
            </button>
          );
        })}
      </div>

      {/* 도트 (절대 위치, offset으로 미세조정) */}
      {dot?.visible && (
        <span
          className={styles.dot}
          style={{
            backgroundColor: dot.color ?? '#ff3b30',
            top: dotTop,
            right: dotRight,
            boxShadow: '0 0 0 6px rgba(255,59,48,0.08)',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
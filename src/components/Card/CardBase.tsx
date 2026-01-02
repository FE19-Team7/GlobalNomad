import { ReactNode } from "react";

type BorderRadius = 'sm' | 'md' | 'lg';
type BoxShadow = 'none' | 'xs' | 'sm' | 'md' | 'lg';

const RADIUS = {
  sm: 'rounded-[18px]',    // 모바일 ActivityCard 사용
  md: 'rounded-[24px]',    // ReviewCard 사용
  lg: 'rounded-[32px]',    // ActivityCard, MyActivitiesCard, ReservationCard 사용
} as const satisfies Record<BorderRadius, string>;

const SHADOW = {
  none: '',                                                    // 이미지 영역 (그림자 없음)
  xs: 'shadow-[0px_-4.5px_11.25px_0px_rgba(0,0,0,0.05)]',    // 모바일 텍스트 영역 (아주 약함)
  sm: 'shadow-[0px_-8px_20px_0px_rgba(0,0,0,0.05)]',         // 텍스트 영역 (약함)
  md: 'shadow-[0px_4px_24px_0px_rgba(156,180,202,0.20)]',    // ActivityCard, ReviewCard 바깥 (중간)
  lg: 'shadow-[0px_-8px_20px_0px_rgba(0,0,0,0.2)]',          // ReservationCard 바깥 (강함)
} as const satisfies Record<BoxShadow, string>;

interface CardBaseProps {
  width?: string | false;
  height?: string | false;
  children: ReactNode;
  rounded?: BorderRadius;
  boxShadow?: BoxShadow;
  overflow?: boolean;
  className?: string;
}

/**
 * 카드 베이스 컴포넌트
 * 
 * 카드의 기본 틀(둥근 모서리, 그림자, overflow)을 제공합니다.
 * 
 * @param width - 너비 (기본: 'w-full', false 시 너비 없음)
 * @param height - 높이 (기본: 'h-auto', false 시 높이 없음)
 * @param rounded - 둥근 모서리 크기 (기본: 'lg')
 * @param boxShadow - 그림자 크기 (기본: 'md')
 * @param overflow - overflow-hidden 적용 여부 (기본: true)
 * @param className - 추가 Tailwind 클래스 (width/height와 중복 주의)
 * @param children - 카드 내용
 * 
 * @example
 * // 기본 사용
 * <CardBase rounded="lg" boxShadow="md">
 *   <div>내용</div>
 * </CardBase>
 * 
 * @example
 * // 고정 크기
 * <CardBase width="w-[640px]" height="h-[200px]">
 *   <div>내용</div>
 * </CardBase>
 * 
 * @example
 * // 반응형 (기본값 제거 후 className으로 제어)
 * <CardBase width={false} height={false} className="w-full max-w-[640px]">
 *   <div>내용</div>
 * </CardBase>
 */
export default function CardBase({
  width,
  height,
  children,
  rounded = 'lg',
  boxShadow = 'md',
  overflow = true,
  className = '',
}: CardBaseProps) {
  const widthClass = width !== false ? (width || 'w-full') : '';
  const heightClass = height !== false ? (height || 'h-auto') : '';
  const shadowClass = boxShadow !== 'none' ? SHADOW[boxShadow] : '';
  const overflowClass = overflow ? 'overflow-hidden' : '';

  return (
    <div
      className={`${widthClass} ${heightClass} ${shadowClass} ${RADIUS[rounded]} ${overflowClass} bg-white ${className}`}
    >
      {children}
    </div>
  );
}

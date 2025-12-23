import { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * 버튼 변형 타입
 * @property primary - 배경색이 있는 주요 버튼
 * @property secondary - 테두리만 있는 보조 버튼
 */
export type ButtonVariant = 'primary' | 'secondary';

/**
 * 버튼 크기 타입
 * @property sm - 작은 크기 (120px 최소 너비)
 * @property md - 중간 크기 (160px 최소 너비)
 * @property lg - 큰 크기 (전체 너비)
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button 컴포넌트 Props
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /**
   * 버튼 스타일 변형
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * 버튼 크기
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * 로딩 상태 여부
   * @default false
   */
  loading?: boolean;

  /**
   * 로딩 중 점 애니메이션 표시 여부
   * @default true
   */
  showLoadingDots?: boolean;

  /**
   * 전체 너비 사용 여부
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 버튼 내용
   */
  children: ReactNode;

  href?: string; // 링크(페이지 이동 등)

  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

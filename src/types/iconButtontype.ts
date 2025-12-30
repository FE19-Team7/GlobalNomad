import { ReactNode, MouseEvent, Ref, ButtonHTMLAttributes } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 라벨 텍스트
   */
  label: string;

  /**
   * 아이콘 컴포넌트
   */
  icon?: ReactNode;

  /**
   * 링크 경로
   */
  href?: string;

  /**
   * 선택 상태
   */
  selected?:boolean;

  /**
   * 클릭 핸들러
   */
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

  /**
   * 비활성화 상태
   */
  disabled?:boolean;

  /**
   * 버튼 사이즈
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  className?: string;
}
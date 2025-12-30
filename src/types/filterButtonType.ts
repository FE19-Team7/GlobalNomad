import { ReactNode, MouseEventHandler, Ref, ButtonHTMLAttributes } from 'react';

export interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  /** 
   *  버튼 라벨 텍스트
  */
 label: string;

  /**
   * 선택 상태
   */
  selected?: boolean;

  /**
   * 클릭 핸들러
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;

  /**
   * 비활성화 상태
   */
  disabled?: boolean;

  /**
   * 버튼 사이즈
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 추가 CSS 클래스
   */
  className?: string;

  children?: ReactNode;

  ref?: Ref<HTMLButtonElement>;
}
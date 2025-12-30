import { ReactNode } from 'react';
import { ButtonProps } from './buttonType';

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'size'> {
  /**
   * 버튼 라벨 텍스트
   */
  label: string;

  /**
   * 아이콘 컴포넌트
   */
  icon?: ReactNode;

  /**
   * 버튼 사이즈
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}
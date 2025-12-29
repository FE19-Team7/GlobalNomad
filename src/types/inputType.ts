import { InputHTMLAttributes } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 인풋 라벨
   */
  label?: string;
  
  /**
   * 에러 메시지
   */
  error?: string;
  
  /**
   * 비밀번호 표시 여부 (눈 아이콘용)
   */
  showPassword?: boolean;
  
  /**
   * 눈 아이콘 클릭 핸들러
   */
  onTogglePassword?: () => void;
  
  /**
   * 전체 너비 사용 여부
   * @default false
   */
  fullWidth?: boolean;
}
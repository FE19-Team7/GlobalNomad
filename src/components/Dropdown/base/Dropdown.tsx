'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import ArrowDownIcon from '@/assets/icon_alt arrow_down.svg';

export type DropdownItem =
    | { type?: 'option'; label: string; value: string }         // 일반적인 옵션 선택
    | { type?: 'action'; label: string; onSelect: () => void }  // 특정 함수 실행
    | { type?: 'link'; label: string; href: string };           // 페이지 이동

export type DropdownProps = {
    label?: string;                     // 기본 표시 텍스트
    placeholder?: string;               // 값이 없고, label도 없을 때 기본값 텍스트
    items: DropdownItem[];              // 드롭다운 메뉴에 표시될 아이템 목록
    value?: string;                     // 현재 선택된 값
    onChange?: (value: string) => void; // 값이 변경될 때 호출되는 함수
    align?: 'start' | 'center' | 'end'; // 드롭다운 메뉴 정렬 방향
    disabled?: boolean;                 // 비활성화 여부
    className?: string;                 // 페이지에서 추가할 CSS
    buttonClassName?: string;           // 버튼에 추가할 CSS
    menuClassName?: string;             // 메뉴에 추가할 CSS
    itemClassName?: string;             // 아이템에 추가할 CSS
    showArrow?: boolean;                // 화살표 아이콘 표시 여부
    fullWidth?: boolean;                // 드롭다운이 부모 컨테이너의 전체 너비를 차지할지 여부(특정 드롭다운을 위함)
    renderLabel?: (value?: string) => React.ReactNode; // 커스텀 라벨 렌더링 함수
};

export default function Dropdown({
    label,
    placeholder = '선택',
    items,
    value,
    onChange,
    align = 'start',
    disabled = false,
    className = '',
    buttonClassName = '',
    menuClassName = '',
    itemClassName = '',
    showArrow = true,
    fullWidth = true,
    renderLabel,
}: DropdownProps) {
    const dropdownId = useId();                          // 고유 ID 생성
    const containerRef = useRef<HTMLDivElement>(null);   // 외부 클릭 감지 ref
    const [open, setOpen] = useState(false);             // 드롭다운 열림/닫힘 상태

    // 현재 선택된 값에 해당하는 label 찾기
    // -> item 중 value가 일치하는 아이템의 label
    // -> 없다면 props로 전달받은 label
    // -> 없다면 placeholder
    const selectedLabel =
        renderLabel ? renderLabel(value)
            : items.find(
                (item) =>
                    item.type !== 'action' &&
                    item.type !== 'link' &&
                    'value' in item &&
                    item.value === value
            )?.label ?? label ?? placeholder;

    // 플레이스홀더인지 여부
    const isPlaceholder = selectedLabel === placeholder

    // 드롭다운 토글
    const toggleDropdown = () => {
        setOpen((prev) => !prev);
    }

    // 아이템 선택 처리
    const handleSelect = (item: DropdownItem) => {
        if (item.type === 'action') {
            item.onSelect();
        } else if (item.type === 'link') {
            // 링크는 Link 컴포넌트가 처리하므로 여기서는 처리하지 않음
        } else if ('value' in item) {
            onChange?.(item.value);
        }

        setOpen(false);
    }

    // 외부 클릭시 메뉴 닫기 로직
    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    return (
        <div ref={containerRef} className={`relative ${className}`}>

            {/* 드롭다운을 열고 닫는 버튼 */}
            <button
                id={dropdownId}
                type="button"
                onClick={toggleDropdown}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`
                    flex items-center p-[10px] text-body-lg
                    ${fullWidth ? 'w-full justify-between' : 'w-fit'}
                    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    bg-transparent
                    ${buttonClassName}
                    `}
            >
                <span className={`${isPlaceholder
                    ? 'text-gray-400'
                    : 'text-gray-950'}`}>
                    {selectedLabel}
                </span>
                {showArrow && (
                    <ArrowDownIcon
                        className={`
                    w-5 h-5
                    ${open ? 'rotate-180' : 'rotate-0'}
                    ${disabled ? 'text-gray-300' : 'text-gray-950'}
                    `} />
                )}
            </button>

            {/* 드롭다운 메뉴 */}
            {open && (
                <ul
                    role="listbox"
                    aria-labelledby={dropdownId}
                    className={`
                            absolute z-50 shadow-sm bg-white
                            ${align === 'center' && 'left-1/2 -translate-x-1/2'}
                            ${align === 'start' && 'left-0'}
                            ${align === 'end' && 'right-0'}
                            ${menuClassName}
                            `}>
                    {items.map((item) => {
                        if (item.type === 'link') {
                            return (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={`block w-full px-4 py-2 text-center text-body border-b border-gray-100 hover:bg-primary-100 
                                            ${itemClassName}`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        }
                        return (
                            <li key={item.label}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(item)}
                                    className={`block w-full px-4 py-2 text-center text-body  border-b border-gray-100 hover:bg-primary-100 cursor-pointer 
                                        ${itemClassName}`}
                                >
                                    {item.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    )
}
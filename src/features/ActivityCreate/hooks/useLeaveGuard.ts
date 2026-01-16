'use client';

import { useEffect, useRef } from 'react';

type UseLeaveGuardArgs = {
  enabled: boolean;
  onAttemptLeave: () => void;
};

/**
 * 페이지 이탈 가드
 * - 브라우저 탭 닫기/새로고침: beforeunload
 * - 뒤로/앞으로: popstate
 * - 링크 이동: document click capture (a 태그)
 *
 * 주의:
 * - "진짜로 나가게" 하려면 (예: confirmLeave에서 history.back 호출 전)
 *   컴포넌트 쪽에서 enabled를 false로 바꾸는 플래그(allowLeaveOnce)를 사용해야 함.
 */
export function useLeaveGuard({ enabled, onAttemptLeave }: UseLeaveGuardArgs) {
  const enabledRef = useRef(enabled);
  const onAttemptLeaveRef = useRef(onAttemptLeave);

  // ref 갱신은 render 중 접근 대신 useEffect로
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    onAttemptLeaveRef.current = onAttemptLeave;
  }, [onAttemptLeave]);

  // 1) 새로고침/탭닫기 방지
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!enabledRef.current) return;
      e.preventDefault();
      e.returnValue = ''; // 크롬/사파리 요구사항
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled]);

  // 2) 뒤로가기(popstate) 방지
  useEffect(() => {
    if (!enabled) return;

    // 현재 히스토리 위치를 가드로 "잠금" (뒤로가기 시 popstate 발생)
    const GUARD_STATE = { __leave_guard__: true };
    history.pushState(GUARD_STATE, '');

    const handlePopState = () => {
      if (!enabledRef.current) return;

      // 나가려는 시도 -> 모달(컴포넌트)로 위임
      onAttemptLeaveRef.current?.();

      // 다시 현재 페이지로 잠금(뒤로가기 취소 효과)
      history.pushState(GUARD_STATE, '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [enabled]);

  // 3) 링크 클릭(a 태그) 방지 (Next Link도 결국 a 클릭 이벤트로 내려옴)
  useEffect(() => {
    if (!enabled) return;

    const handleClickCapture = (e: MouseEvent) => {
      if (!enabledRef.current) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const a = target.closest('a') as HTMLAnchorElement | null;
      if (!a) return;

      // 새 탭/다운로드/외부 링크 등은 가드 제외
      if (a.target === '_blank' || a.hasAttribute('download')) return;

      const href = a.getAttribute('href') ?? '';
      if (!href) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

      // 같은 페이지의 hash 이동(#)은 허용
      if (href.startsWith('#')) return;

      // 외부 도메인 이동은 막지 않음(원하면 여기서 막아도 됨)
      try {
        const url = new URL(a.href, window.location.href);
        if (url.origin !== window.location.origin) return;
      } catch {
        // 파싱 실패 시는 가드하지 않음
        return;
      }

      e.preventDefault();
      onAttemptLeaveRef.current?.();
    };

    document.addEventListener('click', handleClickCapture, true); // capture
    return () => document.removeEventListener('click', handleClickCapture, true);
  }, [enabled]);
}

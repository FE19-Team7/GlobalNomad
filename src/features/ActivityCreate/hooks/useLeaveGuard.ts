'use client';

import { useEffect, useRef } from 'react';

type UseLeaveGuardArgs = {
  enabled: boolean;
  onAttemptLeave: () => void;
};

export function useLeaveGuard({ enabled, onAttemptLeave }: UseLeaveGuardArgs) {
  const enabledRef = useRef(enabled);
  const onAttemptLeaveRef = useRef(onAttemptLeave);
  const allowLeaveOnceRef = useRef(false);

  // ref 갱신
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    onAttemptLeaveRef.current = onAttemptLeave;
  }, [onAttemptLeave]);

  const allowLeave = () => {
    allowLeaveOnceRef.current = true;
    enabledRef.current = false;
  };

  // 1) 새로고침/탭닫기 방지
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (allowLeaveOnceRef.current) return;
      if (!enabledRef.current) return;

      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled]);

  // 2) 뒤로가기(popstate) 방지
  useEffect(() => {
    if (!enabled) return;

    const GUARD_STATE = { __leave_guard__: true };
    history.pushState(GUARD_STATE, '');

    const handlePopState = () => {
      if (allowLeaveOnceRef.current) return;
      if (!enabledRef.current) return;

      onAttemptLeaveRef.current?.();

      // 다시 잠금
      history.pushState(GUARD_STATE, '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [enabled]);

  // 3) 링크 클릭 방지
  useEffect(() => {
    if (!enabled) return;

    const handleClickCapture = (e: MouseEvent) => {
      if (allowLeaveOnceRef.current) return;
      if (!enabledRef.current) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const a = target.closest('a') as HTMLAnchorElement | null;
      if (!a) return;

      if (a.target === '_blank' || a.hasAttribute('download')) return;

      const href = a.getAttribute('href') ?? '';
      if (!href) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href.startsWith('#')) return;

      try {
        const url = new URL(a.href, window.location.href);
        if (url.origin !== window.location.origin) return;
      } catch {
        return;
      }

      e.preventDefault();
      onAttemptLeaveRef.current?.();
    };

    document.addEventListener('click', handleClickCapture, true);
    return () => document.removeEventListener('click', handleClickCapture, true);
  }, [enabled]);

  return allowLeave;
}

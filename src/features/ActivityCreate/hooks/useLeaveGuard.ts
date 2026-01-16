'use client';

import { useEffect, useRef } from 'react';

type LeaveAction = 'back';

type UseLeaveGuardArgs = {
  enabled: boolean;
  onAttemptLeave: (action: LeaveAction) => void;
};

export function useLeaveGuard({ enabled, onAttemptLeave }: UseLeaveGuardArgs) {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    if (!enabled) return;

    // 새로고침/탭닫기
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!enabledRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };

    // 뒤로가기(popstate) - 모달 띄우고 history 복구
    const onPopState = () => {
      if (!enabledRef.current) return;
      // 뒤로가기를 "막고" 모달
      history.pushState(null, '', location.href);
      onAttemptLeave('back');
    };

    // popstate 가드용 pushState
    history.pushState(null, '', location.href);

    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('popstate', onPopState);
    };
  }, [enabled, onAttemptLeave]);
}

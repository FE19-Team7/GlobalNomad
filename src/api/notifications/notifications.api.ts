import { http } from '../http';
import {
    MyNotificationsResponse,
} from './notifications.types';

/**
 * 내 알림 리스트 조회
 * GET /my-notifications
 */
export const getMyNotifications = (
    cursorId?: number,
    size: number = 10
) => {
    return http.get<MyNotificationsResponse>('/my-notifications', {
        params: { cursorId, size },
    });
};

/**
 * 내 알림 삭제
 * DELETE /my-notifications/{notificationId}
 */
export const deleteMyNotification = (notificationId: number) => {
    return http.delete<void>(`/my-notifications/${notificationId}`);
};
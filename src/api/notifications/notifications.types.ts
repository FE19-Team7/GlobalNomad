// 알림
export interface Notification {
    id: number;
    teamId: string;
    userId: number;
    content: string;

    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

// 내 알림 리스트 응답
export interface MyNotificationsResponse {
    cursorId: number;
    totalCount: number;
    notifications: Notification[];
}
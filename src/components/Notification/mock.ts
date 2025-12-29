import { NotificationUIItem } from "@/src/components/Notification/types";

export const mockNotifications: NotificationUIItem[] = [
  {
    id: 1,
    content: "예약이 승인되었습니다.",
    createdAt: new Date(Date.now() - 60 * 1000).toISOString(),
    activityTitle: "함께 배운 즐거운 스트릿 댄스",
    scheduleText: "(2023-01-14 15:00~18:00)",
  },
  {
    id: 2,
    content: "예약이 거절되었습니다.",
    createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    activityTitle: "함께 배운 즐거운 스트릿 댄스",
    scheduleText: "(2023-01-14 15:00~18:00)",
  },
];

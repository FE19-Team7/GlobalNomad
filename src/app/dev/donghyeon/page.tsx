"use client";

import Calendar, { DaySummary } from "@/src/components/Calendar/Calendar";

const MOCK_SUMMARY: Record<string, DaySummary> = {
  "2026-01-08": { completed: 10, reserved: 0, approved: 0 },
  "2026-01-10": { reserved: 2, approved: 0, completed: 0 },
  "2026-01-11": { reserved: 2, approved: 8, completed: 0 },
};

export default function CalendarTestPage() {
  return (
    <div className="min-h-screen p-10">
      <Calendar summaryMap={MOCK_SUMMARY} />
    </div>
  );
}

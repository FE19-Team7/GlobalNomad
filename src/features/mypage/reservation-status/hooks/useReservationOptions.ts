"use client";

import { useMemo } from "react";
import { ReservationItem } from "@/src/components/Dropdown/ReservationsDropdown";
import { generateMockReservations } from "@/src/features/mypage/reservations/mocks/MockReservation";
import { mapReservationToDropdownItems } from "./mapReservationToDropdown";

export function useReservationOptions() {
  const items: ReservationItem[] = useMemo(() => {
    const reservations = generateMockReservations(20);
    return mapReservationToDropdownItems(reservations);
  }, []);

  return { items };
}

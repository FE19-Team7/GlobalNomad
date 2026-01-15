import { Reservation } from "@/src/features/mypage/reservations/mocks/MockReservation";
import { ReservationItem } from "@/src/components/Dropdown/ReservationsDropdown";

export const mapReservationToDropdownItems = (
  reservations: Reservation[]
): ReservationItem[] => {
  return reservations.map((r) => ({
    label: r.activity.title,
    value: String(r.id),
    reservedAt: r.date,
  }));
};

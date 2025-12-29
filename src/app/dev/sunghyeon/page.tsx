import ReservationCard from "@/src/components/ReservationCard/ReservationCard";

export default function SunghyeonPage() {
  return (
    <div>
      <ReservationCard
        id={1}
        activity={{
          id: 1,
          title: "동해 해돋이 방구석 직관",
          bannerImageUrl: "",
        }}
        status="completed"    // 예약 상태: 'pending' | 'confirmed' | 'canceled' | 'declined' | 'completed'
        totalPrice={25000}
        headCount={1}
        date="2026. 01. 01"
        startTime="05:30"
        endTime="06:30"
      />
    </div>
  );
}
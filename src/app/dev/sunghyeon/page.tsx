import ActivityCard from "@/src/components/Card/ActivityCard";
import MyActivitiesCard from "@/src/components/Card/MyActivitiesCard";
import ReservationCard from "@/src/components/Card/ReservationCard";
import PopularActivitiesList from "@/src/components/Card/PopularActivitiesList";

export default function SunghyeonPage() {
  return (
    <div className="flex flex-col justify-center gap-6">
      <div className="w-[262px] h-[366px]">
        <ActivityCard
          id={1}
          title="크리스마스 랜선 집들이"
          rating={4.9}
          reviewCount={10}
          price={25000}
        />
      </div>
      <div>
        <MyActivitiesCard
          activity={{
            id: 1,
            title: "크리스마스 랜선 집들이",
            rating: 4.9,
            reviewCount: 10,
            price: 25000,
          }}
        />
      </div>
      <div>
        <ReservationCard
          id={1}
          activity={{
            id: 1,
            title: "동해 해돋이 방구석 직관",
            bannerImageUrl: "",
          }}
          status="confirmed"
          totalPrice={25000}
          headCount={1}
          date="2026. 01. 01"
          startTime="05:30"
          endTime="06:30"
        />
        <ReservationCard
          id={2}
          activity={{
            id: 2,
            title: "자연 속에서 당일치기 캠핑하기",
            bannerImageUrl: "",
          }}
          status="completed"
          totalPrice={80000}
          headCount={2}
          date="2025. 11. 07"
          startTime="07:00"
          endTime="17:00"
        />
      </div>
      <div className="w-[1120px]">
        <PopularActivitiesList />
      </div>
    </div >
  );
}

import MyActivitiesCard from "@/src/components/MyActivitiesCard/MyActivitiesCard";

export default function SunghyeonPage() {
  return (
    <div>
      <MyActivitiesCard
        id={1}
        title="동해 해돋이 방구석 직관"
        rating={4.9}
        reviewCount={20}
        price={10000}
      />
    </div>
  );
}
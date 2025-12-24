import ActivityCard from "../../../components/ActivityCard/ActivityCard";

export default function SunghyeonPage() {
  return (
    <div className="flex flex-row gap-6">
      <ActivityCard
        id={1}
        title="크리스마스 랜선 집들이"
        rating={4.9}
        reviewCount={10}
        price={25000}
      />
    </div>
  );
}

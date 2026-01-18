import PopularActivitiesList from "@/src/components/Card/PopularActivitiesList";

export default function PopularActivitiesSection() {
  return (
    <section className="w-full h-[424px] mb-[80px] flex flex-col gap-5">
      <h2 className="h-[38px] flex items-center text-h1 font-bold">🔥 인기 체험</h2>
      <div>
        <PopularActivitiesList />
      </div>
    </section>
  );
}

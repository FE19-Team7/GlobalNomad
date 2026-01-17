import AllActivitiesList from "@/src/components/Card/AllActivitiesList";

export default function AllActivitiesSection() {
  return (
    <section className="w-full h-[964px] flex flex-col gap-[30px]">
      <div>
        <h2 className="h-[38px] flex items-center text-h1 font-bold">🛼 모든 체험</h2>
      </div>
      <div>
        <AllActivitiesList />
      </div>
    </section>
  );
}

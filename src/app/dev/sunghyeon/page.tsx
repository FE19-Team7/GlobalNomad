import StatusBadge from "@/src/components/StatusBadge/StatusBadge";

export default function SunghyeonPage() {
  return (
    <div className="flex gap-4">
      <StatusBadge status="confirmed" />
      <StatusBadge status="pending" />
      <StatusBadge status="cancelled" />
      <StatusBadge status="declined" />
      <StatusBadge status="completed" />
    </div>
  );
}
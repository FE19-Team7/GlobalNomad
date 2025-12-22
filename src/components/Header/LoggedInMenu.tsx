import BellIcon from "@/assets/icon_bell.svg";
import DefaultProfile from "@/assets/default profile.svg";

export default function LoggedInMenu() {
  return (
    <div className="flex items-center gap-4">
      <BellIcon />
      <div className="h-3.5 w-px bg-gray-100" />
      <DefaultProfile />
      <span className="text-sm text-gray-950">조동현</span>
    </div>
  );
}

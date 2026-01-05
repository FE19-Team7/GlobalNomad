import { PropsWithChildren } from "react";

export default function HeaderLayout({ children }: PropsWithChildren) {
  return (
    <header className="w-full h-20 md:h-20 lg:h-20">
      <div className="h-full px-6 md:px-[30px] lg:px-50 py-2.5 flex items-center">{children}</div>
    </header>
  );
}
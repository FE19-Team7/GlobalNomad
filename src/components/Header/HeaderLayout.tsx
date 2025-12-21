import { PropsWithChildren } from "react";

export default function HeaderLayout({ children }: PropsWithChildren) {
  return (
    <header className="w-full h-20">
      <div className="h-full px-50 py-2.5 flex items-center">{children}</div>
    </header>
  );
}

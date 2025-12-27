import { Footer } from "@/src/components/Footer/Footer";
import Header from "@/src/components/Header/Hedaer";
import type { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="w-full max-w-[964px] mx-auto flex flex-col gap-y-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

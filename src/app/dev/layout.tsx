import Header from "@/src/components/Header/Header";
import { Footer } from "@/src/components/Footer/Footer";
import { getUser } from "@/src/lib/server/getUser";
import type { PropsWithChildren } from "react";

export default async function RootLayout({ children }: PropsWithChildren) {
  const user = await getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header initialUser={user} />

      <main className="flex-1 py-12">
        <div className="w-full max-w-[964px] mx-auto flex flex-col gap-y-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

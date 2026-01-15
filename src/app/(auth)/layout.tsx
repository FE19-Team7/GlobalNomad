import Header from "@/src/components/Header/Header";
import { Footer } from "@/src/components/Footer/Footer";
import { getUser } from "@/src/lib/server/getUser";
import type { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Header initialUser={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

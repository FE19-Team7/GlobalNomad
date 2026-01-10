import Header from "@/src/components/Header/Hedaer";
import { Footer } from "@/src/components/Footer/Footer";
import MyPageLayout from "@/src/app/(auth)/mypage/MypageLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <MyPageLayout>{children}</MyPageLayout>
      <Footer />
    </div>
  );
}

import Header from '@/src/components/Header/Hedaer';
import { Footer } from '@/src/components/Footer/Footer';
import MyPageLayout from '@/src/app/(auth)/mypage/MyPageLayout';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <MyPageLayout>{children}</MyPageLayout>
      <Footer />
    </>
  );
}
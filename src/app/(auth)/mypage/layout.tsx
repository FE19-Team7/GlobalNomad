import MyPageLayout from "@/src/app/(auth)/mypage/MypageLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MyPageLayout>{children}</MyPageLayout>;
}
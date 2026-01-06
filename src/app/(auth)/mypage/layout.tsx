import MyPageLayout from "./MyPageLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MyPageLayout>{children}</MyPageLayout>;
}
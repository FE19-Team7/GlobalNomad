import { Suspense } from "react";
import PageClient from "./pageClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageClient />
    </Suspense>
  );
}

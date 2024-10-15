import { SignUpContainer } from "@/components/pages-containers/signup/register";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <SignUpContainer />
    </Suspense>
  );
}

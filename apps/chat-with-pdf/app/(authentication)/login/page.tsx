import { LoginContainer } from "@/components/pages-containers/login/login-container";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContainer />
    </Suspense>
  );
}

import { useState } from "react";
import { authService } from "../services/authService";

export function useLoginSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const submitLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      await authService.login(email, password);
      return true;
    } catch (err) {
      console.error(err);
      setLoginError("로그인에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitLogin, isLoading, loginError };
}

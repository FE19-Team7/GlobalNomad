import { useState } from "react";
import { authService } from "../services/authService";

type SignupData = {
  email: string;
  password: string;
  nickname: string;
};

export function useSignupSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const submitSignup = async (signupData: SignupData) => {
    setIsLoading(true);
    setSignupError(null);

    try {
      await authService.signup(signupData);
      return true;
    } catch (err) {
      console.error("SIGNUP ERROR:", err);

      if (err instanceof Error) {
        setSignupError(err.message);
      } else {
        setSignupError("회원가입에 실패했습니다.");
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitSignup,
    isLoading,
    signupError,
  };
}

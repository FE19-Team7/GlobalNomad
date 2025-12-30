import { useState } from "react";
import {
  isValidEmail,
  isValidPassword,
} from "@/src/features/public/utils/validators";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  /* =========================
     이메일 핸들러
  ========================= */

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setEmail(v);

    if (emailError && isValidEmail(v)) {
      setEmailError("");
    }
  };

  // focus out 시 검증
  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setEmailError("");
  };

  const handleEmailClear = () => {
    setEmail("");
    setEmailError("");
  };

  /* =========================
     비밀번호 핸들러
  ========================= */

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\s+/g, "");
    setPassword(v);

    if (passwordError && isValidPassword(v)) {
      setPasswordError("");
    }
  };

  // focus out 시 검증
  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      return;
    }

    if (!isValidPassword(password)) {
      setPasswordError("비밀번호는 8자 이상 입력해주세요.");
      return;
    }

    setPasswordError("");
  };

  /* =========================
     전체 유효성
  ========================= */
  const isFormValid = isValidEmail(email) && isValidPassword(password);

  return {
    email,
    emailError,
    handleEmailChange,
    handleEmailBlur,
    handleEmailClear,

    password,
    passwordError,
    handlePasswordChange,
    handlePasswordBlur,

    isFormValid,
  };
}

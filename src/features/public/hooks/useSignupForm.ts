import { useState } from "react";
import {
  isValidEmail,
  isValidPassword,
} from "@/src/features/public/utils/validators";

export function useSignupForm() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmError, setPasswordConfirmError] = useState<
    string | null
  >(null);

  // ===== validation (메시지 책임은 훅) =====
  const validateEmail = (value: string) => {
    if (!value) return "이메일을 입력해주세요.";
    if (!isValidEmail(value)) return "올바른 이메일 형식이 아닙니다.";
    return null;
  };

  const validateNickname = (value: string) => {
    if (!value) return "닉네임을 입력해주세요.";
    if (value.length < 2) return "닉네임은 2자 이상이어야 합니다.";
    return null;
  };

  const validatePassword = (value: string) => {
    if (!value) return "비밀번호를 입력해주세요.";
    if (!isValidPassword(value)) return "비밀번호는 8자 이상이어야 합니다.";
    return null;
  };

  const validatePasswordConfirm = (value: string) => {
    if (!value) return "비밀번호 확인을 입력해주세요.";
    if (value !== password) return "비밀번호가 일치하지 않습니다.";
    return null;
  };

  // ===== handlers =====
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setNicknameError(null);
  };

  const handleNicknameBlur = () => {
    setNicknameError(validateNickname(nickname));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(null);
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password));
  };

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirm(e.target.value);
    setPasswordConfirmError(null);
  };

  const handlePasswordConfirmBlur = () => {
    setPasswordConfirmError(validatePasswordConfirm(passwordConfirm));
  };

  const isFormValid =
    !validateEmail(email) &&
    !validateNickname(nickname) &&
    !validatePassword(password) &&
    !validatePasswordConfirm(passwordConfirm);

  return {
    email,
    nickname,
    password,
    passwordConfirm,

    emailError,
    nicknameError,
    passwordError,
    passwordConfirmError,

    handleEmailChange,
    handleEmailBlur,
    handleNicknameChange,
    handleNicknameBlur,
    handlePasswordChange,
    handlePasswordBlur,
    handlePasswordConfirmChange,
    handlePasswordConfirmBlur,

    isFormValid,
  };
}

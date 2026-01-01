"use client";

import { useState } from "react";
import Link from "next/link";
import LogoIcon from "@/src/assets/LoginLogo.svg";
import KakaoIcon from "@/src/assets/icon_kakao.svg";
import Button from "@/src/components/button/button";
import Input from "@/src/components/Input/Input";
import { useSignupForm } from "@/src/features/public/hooks/useSignupForm";

export default function SignupPage() {
  const signupForm = useSignupForm();
  const [showPassword, setShowPassword] = useState(false);

  const {
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
  } = signupForm;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-105 flex-col items-center justify-center px-4">
        <Link href="/" className="cursor-pointer select-none mb-6">
          <LogoIcon />
        </Link>

        <form className="w-full flex flex-col pt-5 gap-3">
          <div className="flex flex-col pb-7.5">
            <Input
              label="이메일"
              placeholder="이메일을 입력해 주세요"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              error={emailError || undefined}
            />

            <Input
              label="닉네임"
              placeholder="닉네임을 입력해 주세요"
              value={nickname}
              onChange={handleNicknameChange}
              onBlur={handleNicknameBlur}
              error={nicknameError || undefined}
            />

            <Input
              label="비밀번호"
              type={showPassword ? "text" : "password"}
              placeholder="8자 이상 입력해 주세요"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={passwordError || undefined}
              onTogglePassword={() => setShowPassword((prev) => !prev)}
            />

            <Input
              label="비밀번호 확인"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 한 번 더 입력해 주세요"
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              onBlur={handlePasswordConfirmBlur}
              error={passwordConfirmError || undefined}
            />
          </div>

          <Button
            variant="primary"
            fullWidth
            disabled={!isFormValid}
            className="mt-4"
          >
            회원가입하기
          </Button>

          <div className="flex w-full items-center gap-4 my-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-200">
              SNS 계정으로 회원가입하기
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <Button variant="secondary" fullWidth href="/oauth/signup/kakao">
            <KakaoIcon />
            카카오 회원가입
          </Button>

          <p className="mt-6 text-center text-sm text-gray-400">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="hover:underline">
              로그인하기
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

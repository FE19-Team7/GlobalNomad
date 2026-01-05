"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoIcon from "@/src/assets/LoginLogo.svg";
import KakaoIcon from "@/src/assets/icon_kakao.svg";
import Button from '@/src/components/Button/Button';
import Input from "@/src/components/Input/Input";
import CompleteModal from "@/src/components/Modal/CompleteModal";
import { useLoginForm } from "@/src/features/public/hooks/useLoginForm";
import { useLoginSubmit } from "@/src/features/public/hooks/useLoginSubmit";

export default function LoginPage() {
  const router = useRouter();
  const loginForm = useLoginForm();
  const { submitLogin } = useLoginSubmit();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    email,
    emailError,
    handleEmailChange,
    handleEmailBlur,
    password,
    passwordError,
    handlePasswordChange,
    handlePasswordBlur,
    isFormValid,
  } = loginForm;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return;

    const ok = await submitLogin(email, password);

    if (!ok) {
      setIsModalOpen(true);
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-105 flex-col items-center justify-center px-4">
        <Link href="/" className="cursor-pointer select-none">
          <LogoIcon />
        </Link>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col pt-10 gap-3"
        >
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
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={passwordError || undefined}
            />
          </div>

          <Button variant="primary" fullWidth disabled={!isFormValid}>
            로그인하기
          </Button>

          <div className="flex w-full items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-200">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <Button variant="secondary" fullWidth href="oauth/signup/kakao">
            <KakaoIcon />
            카카오 로그인
          </Button>

          <p className="mt-6 text-center text-sm text-gray-400">
            회원이 아니신가요?{" "}
            <Link href="/signup" className="hover:underline">
              회원가입하기
            </Link>
          </p>
        </form>
      </div>

      <CompleteModal
        isOpen={isModalOpen}
        message="비밀번호가 일치하지 않습니다."
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
import { useState, useEffect, useMemo } from 'react';
import { useLoginForm } from '@/src/features/public/hooks/useLoginForm';
import { isValidPassword } from '@/src/features/public/utils/validators';

interface useMyPageFormProps {
  initialNickname?: string;
  initialEmail?: string;
}

export function useMyPageForm({
  initialNickname = '',
  initialEmail = '',
}: useMyPageFormProps = {}) {
  const {
    email,
    emailError,
    handleEmailChange,
    handleEmailBlur,
  } = useLoginForm();

  // 초기값 설정을 위한 useEffect 
  useEffect(() => {
    if (initialEmail) {
      handleEmailChange({
        target: { value: initialEmail },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [initialEmail, handleEmailChange]);

  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameError, setNicknameError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // 초기값 저장
  const [initialValues] = useState({
    nickname: initialNickname,
    email: initialEmail,
  });

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    if (nicknameError && value.trim()) setNicknameError('');
  };

  const handleNicknameBlur = () => {
    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
    } else {
      setNicknameError('');
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '');
    setNewPassword(value);
    if (newPasswordError && isValidPassword(value)) setNewPasswordError('');
  };

  const handleNewPasswordBlur = () => {
    if (confirmPassword) {
      if (!newPassword) {
        setNewPasswordError('비밀번호를 입력해주세요.');
        return;
      }
      if (!isValidPassword(newPassword)) {
        setNewPasswordError('비밀번호는 8자 이상 입력해주세요.');
        return;
      }
    }
    setNewPasswordError('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '');
    setConfirmPassword(value);
    if (confirmPasswordError && value === newPassword) {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword) {
      if (newPassword) setConfirmPasswordError('비밀번호 확인을 입력해주세요.');
      return;
    }
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setConfirmPasswordError('');
  };

  const isModified = useMemo(() => {
    const hasBasicInfoChanged =
      nickname !== initialValues.nickname || email !== initialValues.email;

    const isPasswordChangeValid =
      newPassword &&
      confirmPassword &&
      !newPasswordError &&
      !confirmPasswordError &&
      newPassword === confirmPassword;

    return hasBasicInfoChanged || Boolean(isPasswordChangeValid);
  }, [nickname, email, initialValues, newPassword, confirmPassword, newPasswordError, confirmPasswordError]);

  const isFormValidValue = useMemo(() => {
    const isBasicInfoValid = nickname.trim() !== '' && !nicknameError && !emailError;
    if (newPassword || confirmPassword) {
      return (
        isBasicInfoValid &&
        isValidPassword(newPassword) &&
        newPassword === confirmPassword &&
        !newPasswordError &&
        !confirmPasswordError
      );
    }
    return isBasicInfoValid;
  }, [nickname, nicknameError, emailError, newPassword, confirmPassword, newPasswordError, confirmPasswordError]);

  const handleSubmit = () => {
    if (!isModified || !isFormValidValue) return false;

    const formData = {
      nickname,
      email,
      ...(newPassword ? { newPassword } : {}),
    };

    console.log('저장할 데이터:', formData);
    return true;
  };

  return {
    nickname,
    nicknameError,
    handleNicknameChange,
    handleNicknameBlur,
    email,
    emailError,
    handleEmailChange,
    handleEmailBlur,
    newPassword,
    newPasswordError,
    handleNewPasswordChange,
    handleNewPasswordBlur,
    confirmPassword,
    confirmPasswordError,
    handleConfirmPasswordChange,
    handleConfirmPasswordBlur,
    isModified,
    isFormValid: isFormValidValue,
    handleSubmit,
  };
}
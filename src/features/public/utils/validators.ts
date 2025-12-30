// 이메일 형식 + 허용 도메인 체크
export const isValidEmail = (value: string) => {
  if (!value) return false;

  const allowedDomains = ["naver.com", "daum.net", "gmail.com"];

  // 이메일 형식 체크
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value)) return false;

  // 도메인 추출
  const domain = value.split("@")[1];

  // 허용된 도메인인지 체크
  return allowedDomains.includes(domain);
};

// 비밀번호가 8자 이상인지 확인
export const isValidPassword = (value: string) => value.length >= 8;

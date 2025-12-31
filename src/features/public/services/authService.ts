export const authService = {
  login: async (email: string, password: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // 실패하면 에러 throw → LoginPage catch로 이동
    if (!res.ok) {
      throw new Error("LOGIN_FAILED");
    }

    return;
  },
};

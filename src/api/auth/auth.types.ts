// 로그인 요청 body
export interface LoginBody {
    email: string;
    password: string;
}

// 로그인 응답 user
export interface AuthUser {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

// 로그인 응답
export interface LoginResponse {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}

// 토큰 재발급 응답
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}
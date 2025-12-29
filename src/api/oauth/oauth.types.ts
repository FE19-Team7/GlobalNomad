// OAuth Provider
export type OauthProvider = 'google' | 'kakao';

// OAuth App 등록/수정 요청
export interface UpsertOauthAppBody {
    appKey: string;
    provider: OauthProvider;
}

// OAuth App 응답
export interface OauthApp {
    id: number;
    teamId: string;
    appKey: string;
    provider: OauthProvider;
    createdAt: string;
    updatedAt: string;
}

// OAuth 회원가입 요청
export interface OauthSignUpBody {
    nickname: string;
    redirectUri: string;
    token: string;
}

// OAuth 로그인 요청
export interface OauthSignInBody {
    redirectUri: string;
    token: string;
}

// OAuth 로그인/회원가입 응답 user
export interface OauthUser {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

// OAuth 로그인/회원가입 응답
export interface OauthAuthResponse {
    user: OauthUser;
    accessToken: string;
    refreshToken: string;
}
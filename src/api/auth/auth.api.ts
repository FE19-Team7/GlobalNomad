import { http } from '../http';
import {
    LoginBody,
    LoginResponse,
    RefreshTokenResponse,
} from './auth.types';

/**
 * 로그인
 * POST /auth/login
 */
export const login = (body: LoginBody) => {
    return http.post<LoginResponse>('/auth/login', body);
};

/**
 * 토큰 재발급
 * POST /auth/tokens
 */
export const refreshToken = () => {
    return http.post<RefreshTokenResponse>('/auth/tokens');
};
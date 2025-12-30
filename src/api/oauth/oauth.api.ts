import { http } from '../http';
import {
    UpsertOauthAppBody,
    OauthApp,
    OauthProvider,
    OauthSignUpBody,
    OauthSignInBody,
    OauthAuthResponse,
} from './oauth.types';

/**
 * OAuth App 등록/수정
 * POST /oauth/apps
 */
export const upsertOauthApp = (body: UpsertOauthAppBody) => {
    return http.post<OauthApp>('/oauth/apps', body);
};

/**
 * OAuth 회원가입
 * POST /oauth/sign-up/{provider}
 */
export const oauthSignUp = (
    provider: OauthProvider,
    body: OauthSignUpBody
) => {
    return http.post<OauthAuthResponse>(
        `/oauth/sign-up/${provider}`,
        body
    );
};

/**
 * OAuth 로그인
 * POST /oauth/sign-in/{provider}
 */
export const oauthSignIn = (
    provider: OauthProvider,
    body: OauthSignInBody
) => {
    return http.post<OauthAuthResponse>(
        `/oauth/sign-in/${provider}`,
        body
    );
};
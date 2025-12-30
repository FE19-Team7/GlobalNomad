import { http } from '../http';
import {
    CreateUserBody,
    CreateUserResponse,
    GetMeResponse,
    UpdateUserBody,
    UpdateUserResponse,
    UploadProfileImageResponse,
} from './users.types';

/**
 * 회원가입
 * POST /users
 */
export const signUp = (body: CreateUserBody) => {
    return http.post<CreateUserResponse>('/users', body);
};

/**
 * 내 정보 조회
 * GET /users/me
 */
export const getMe = () => {
    return http.get<GetMeResponse>('/users/me');
};

/**
 * 내 정보 수정
 * PATCH /users/me
 */
export const updateMe = (body: UpdateUserBody) => {
    return http.patch<UpdateUserResponse>('/users/me', body);
};

/**
 * 프로필 이미지 업로드
 * POST /users/me/image
 */
export const uploadProfileImage = (formData: FormData) => {
    return http.post<UploadProfileImageResponse>(
        '/users/me/image',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
};
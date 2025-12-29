// 사용자 기본 정보
export interface User {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

// 회원가입 요청 body
export interface CreateUserBody {
    email: string;
    nickname: string;
    password: string;
}

// 회원가입 응답
export type CreateUserResponse = User;

// 내 정보 조회 응답
export type GetMeResponse = User;

// 내 정보 수정 요청 body
export interface UpdateUserBody {
    nickname?: string;
    profileImageUrl?: string | null;
    newPassword?: string;
}

// 내 정보 수정 응답
export type UpdateUserResponse = User;

// 프로필 이미지 업로드 응답
export interface UploadProfileImageResponse {
    profileImageUrl: string;
}
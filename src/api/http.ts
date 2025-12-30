import axios from 'axios';

export const http = axios.create({
    baseURL: 'https://sp-globalnomad-api.vercel.app/19-7',
    headers: {
        'Content-Type': 'application/json',
    }
})

http.interceptors.request.use(
    (config) => {
        // SSR 환경에서는 LocalStorage 접근 금지
        if (typeof window === 'undefined') {
            return config;
        }

        const token = window.localStorage.getItem('accessToken');

        // 토큰이 존재하면 Authorization 헤더에 Bearer 토큰 추가
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 200은 성공, 400~409 에러 처리 구현 예정
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL이 설정되지 않았습니다.');
}

/**
 * 체험 이미지 업로드
 * POST /activities/image
 * 파일 -> URL 반환
 * 
 * @param file 업로드할 이미지 파일
 * @returns 업로드된 이미지 URL
 */
export async function uploadActivityImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_URL}/activities/image`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // 쿠키 기반 인증 대비
    });

    if (!res.ok) {
        let message = '이미지 업로드 실패';
        try {
            const error = await res.json();
            message = error.message ?? message;
        } catch {
            // JSON 파싱 실패 시 기본 메시지 유지
        }
        throw new Error(message);
    }

    const data: { activityImageUrl: string } = await res.json();
    return data.activityImageUrl;
}

/**
 * 체험 등록
 * POST /activities
 * 
 * 페이지에서 입력한 모든 데이터를 서버에 전달
 * 성공 시 생성된 체험 데이터 반환
 */
export async function createActivity(payload: {
    title: string;
    category: string;
    description: string;
    address: string;
    price: number;
    schedules: {
        date: string;
        startTime: string;
        endTime: string;
    }[];
    bannerImageUrl: string;
    subImageUrls: string[];
}) {
    const res = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include', // 로그인 쿠키 사용 시 대비
    });

    if (!res.ok) {
        let message = '체험 등록 실패';
        try {
            const error = await res.json();
            message = error.message ?? message;
        } catch {
            // JSON 파싱 실패 시 기본 메시지 유지
        }
        throw new Error(message);
    }

    return res.json();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 체험 이미지 업로드
 * POST /activities/image
 * 파일 -> URL 반환
 * 
 * @param file 업로드할 이미지 파일
 * @returns 업로드된 이미지 URL
 */
export async function uploadActivityImage(file: File): Promise<string>{
    if (!API_URL) {
        throw new Error('API URL이 설정되지 않았습니다.');
    }

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_URL}/activities/image`, {
       method: 'POST',
       body: formData, 
    });

    if (!res.ok) {
        throw new Error('이미지 업로드 실패');
    }

    const data = await res.json();
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
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || '체험 등록 실패');
    }

    return res.json();
}

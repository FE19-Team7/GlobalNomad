'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import ActivityForm from '@/src/features/ActivityCreate/components/ActivityForm';
import type { ActivityDetail } from '@/src/features/ActivityCreate/type';

import {
    uploadActivityImage,
    getActivityDetail,
    updateActivity,
} from '@/src/api/activities';

export default function ActivityEditPage() {
    const router = useRouter();
    const params = useParams<{ activityId: string }>();
    const activityId = Number(params.activityId);

    const [data, setData] = useState<ActivityDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                const detail = await getActivityDetail(activityId);
                if (mounted) setData(detail);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [activityId]);

    if (loading) return <div className="w-full max-w-[700px] mx-auto py-10">로딩중...</div>;
    if (!data) return <div className="w-full max-w-[700px] mx-auto py-10">데이터가 없습니다.</div>;

    return (
        <div className="flex flex-col gap-6 min-w-[700px] mx-auto">
            <h1 className="text-h4 font-bold">내 체험 수정</h1>
            <ActivityForm
                mode="edit"
                initialData={data}
                submitText="수정하기"
                successMessage="수정이 완료되었습니다."
                uploadImage={uploadActivityImage}
                // edit에서는 호출 안 됨(타입 때문에 전달만)
                onSubmitCreate={async () => {
                    throw new Error('onSubmitCreate should not be called in edit mode');
                }}
                onSubmitEdit={async ({ activityId, payload }) => {
                    await updateActivity(activityId, payload);
                }}
                onSuccessNavigate={() => {
                    router.push('/mypage/activities');
                }}
            />
        </div>
    );
}

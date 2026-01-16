'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import ActivityForm from '@/src/features/ActivityCreate/components/ActivityForm';
import {
  getActivityDetail,
  updateMyActivity,
  uploadActivityImage,
} from '@/src/features/ActivityCreate/api/activity';
import type { ActivityDetailForEdit } from '@/src/features/ActivityCreate/type';

export default function ActivityEditPage() {
  const router = useRouter();
  const params = useParams<{ activityId: string }>();

  const activityId = useMemo(() => Number(params.activityId), [params.activityId]);

  const [data, setData] = useState<ActivityDetailForEdit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(activityId)) return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await getActivityDetail(activityId);

        // API 응답 shape -> ActivityDetailForEdit 로 “필수 필드만” 정규화
        const normalized: ActivityDetailForEdit = {
          id: res.id,
          title: res.title,
          description: res.description,
          category: res.category,
          price: res.price,
          address: res.address,
          bannerImageUrl: res.bannerImageUrl,
          subImages: Array.isArray(res.subImages) ? res.subImages : [],
          schedules: Array.isArray(res.schedules) ? res.schedules : [],
        };

        if (alive) setData(normalized);
      } catch (e) {
        const msg = e instanceof Error ? e.message : '체험 정보를 불러오지 못했습니다.';
        alert(msg);
        router.back();
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [activityId, router]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-6 py-8">
        <h1 className="text-2xl font-bold mb-8">체험 수정</h1>
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="w-full max-w-[700px] mx-auto flex flex-col gap-6">
      <h1 className="text-h4 font-bold">내 체험 수정</h1>

      <ActivityForm
        mode="edit"
        initialData={data}
        submitText="수정하기"
        successMessage="체험이 수정되었습니다."
        uploadImage={uploadActivityImage}
        onSubmitCreate={async () => {
          // edit에서는 호출되지 않음
          throw new Error('잘못된 호출입니다.');
        }}
        onSubmitEdit={({ activityId, payload }) => updateMyActivity(activityId, payload)}
        onSuccessNavigate={() => router.push('/mypage/activities')}
      />
    </div>
  );
}

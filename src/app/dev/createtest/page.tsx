'use client';

import { useRouter } from 'next/navigation';
import ActivityForm from '@/src/features/ActivityCreate/components/ActivityForm';
import { uploadActivityImage, createActivity } from '@/src/api/activities';

export default function ActivityCreatePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 min-w-[700px] mx-auto">
      <h1 className="text-h4 font-bold">내 체험 등록</h1>
      <ActivityForm
        mode="create"
        submitText="등록하기"
        successMessage="등록이 완료되었습니다."
        uploadImage={uploadActivityImage}
        onSubmitCreate={async (payload) => {
          await createActivity(payload);
        }}
        // create에서는 호출 안 됨(타입 때문에 전달만)
        onSubmitEdit={async () => {
          throw new Error('onSubmitEdit should not be called in create mode');
        }}
        onSuccessNavigate={() => {
          // 등록 후 목록으로
          router.push('/mypage/activities');
        }}
      />
    </div>
  );
}

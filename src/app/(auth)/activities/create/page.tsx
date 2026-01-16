'use client';

import { useRouter } from 'next/navigation';

import ActivityForm from '@/src/features/ActivityCreate/components/ActivityForm';
import {
  uploadActivityImage,
  createActivity,
} from '@/src/features/ActivityCreate/api/activity';

export default function ActivityCreatePage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-[700px] mx-auto flex flex-col gap-6">
      <h1 className="text-h4 font-bold">내 체험 등록</h1>

      <ActivityForm
        mode="create"
        submitText="등록하기"
        successMessage="등록이 완료되었습니다."
        uploadImage={uploadActivityImage}
        onSubmitCreate={createActivity}
        onSubmitEdit={async () => {
          // create에서는 호출되지 않음
          throw new Error('잘못된 호출입니다.');
        }}
        onSuccessNavigate={() => router.push('/mypage/activities')}
      />
    </div>
  );
}

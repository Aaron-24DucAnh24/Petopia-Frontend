import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { OtherUserPage } from '@/src/components/user/OtherUserPage';
import { UserSkeleton } from '@/src/components/user/UserSkeleton';
import { getOtherUserServer } from '@/src/services/user.server';
import { IUserInfoResponse } from '@/src/interfaces/user';

export const metadata: Metadata = {
  title: 'Hồ sơ người dùng - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default function Page({ params }: { params: { userId: string } }) {
  return (
    <Suspense fallback={<UserSkeleton />}>
      <OtherUserPageContent userId={params.userId} />
    </Suspense>
  );
}

async function OtherUserPageContent({ userId }: { userId: string }) {
  let userInfo: IUserInfoResponse;
  try {
    userInfo = await getOtherUserServer(userId);
  } catch {
    notFound();
  }

  return <OtherUserPage userId={userId} userInfo={userInfo} />;
}

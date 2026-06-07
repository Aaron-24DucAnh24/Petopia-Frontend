import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { UserSkeleton } from '@/src/components/user/UserSkeleton';
import { UserPage } from '@/src/components/user/UserPage';
import { getCurrentUserServer, getPreUpgradeServer } from '@/src/services/user.server';
import { IUserInfoResponse } from '@/src/interfaces/user';

export const metadata: Metadata = {
  title: 'Hồ sơ người dùng - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default function Page() {
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserPageContent />
    </Suspense>
  );
}

async function UserPageContent() {
  let userInfo: IUserInfoResponse;
  try {
    userInfo = await getCurrentUserServer();
  } catch {
    redirect('/login');
  }

  let allowUpgrade = false;
  try {
    allowUpgrade = await getPreUpgradeServer();
  } catch { /* non-critical */ }

  return <UserPage userInfo={userInfo} allowUpgrade={allowUpgrade} />;
}

import { Suspense } from 'react';
import { Metadata } from 'next';
import { UpgradeRequestsPage } from '@/src/components/user/UpgradeRequestsPage';
import { UpgradeRequestsSkeleton } from '@/src/components/user/UpgradeRequestsSkeleton';
import { getUpgradeRequestsServer } from '@/src/services/user.server';
import { IUpgradeResponse } from '@/src/interfaces/org';

export const metadata: Metadata = {
  title: 'Đơn xác minh tổ chức - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default function Page() {
  return (
    <Suspense fallback={<UpgradeRequestsSkeleton />}>
      <UpgradePageContent />
    </Suspense>
  );
}

async function UpgradePageContent() {
  let initialData: IUpgradeResponse[] = [];
  try {
    initialData = await getUpgradeRequestsServer();
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_REDIRECT')) throw error;
  }

  return <UpgradeRequestsPage initialData={initialData} />;
}

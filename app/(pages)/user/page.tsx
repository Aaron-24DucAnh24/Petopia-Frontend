import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { UserSkeleton } from '@/src/components/user/UserSkeleton';
import { UserPage } from '@/src/components/user/UserPage';
import { getCurrentUserServer, getUpgradeRequestsServer } from '@/src/services/user.server';
import { getPetsByUserServer } from '@/src/services/pet.server';
import { getUserPostsServer } from '@/src/services/post.server';
import { getBlogsByUserServer } from '@/src/services/blog.server';
import { IApiResponse } from '@/src/interfaces/common';
import { IUserInfoResponse } from '@/src/interfaces/user';
import { IPetResponse } from '@/src/interfaces/pet';
import { IGetPostResponse } from '@/src/interfaces/post';
import { IBlogCardResponse } from '@/src/interfaces/blog';
import { IUpgradeResponse } from '@/src/interfaces/org';

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

  let initialPets: IApiResponse<IPetResponse[]> | undefined;
  try {
    initialPets = await getPetsByUserServer(userInfo.id);
  } catch { /* non-critical */ }

  let initialPosts: IApiResponse<IGetPostResponse[]> | undefined;
  try {
    initialPosts = await getUserPostsServer(userInfo.id);
  } catch { /* non-critical */ }

  let initialBlogs: IApiResponse<IBlogCardResponse[]> | undefined;
  try {
    initialBlogs = await getBlogsByUserServer(userInfo.id);
  } catch { /* non-critical */ }

  let initialUpgrades: IUpgradeResponse[] = [];
  try {
    initialUpgrades = await getUpgradeRequestsServer();
  } catch { /* non-critical */ }

  return (
    <UserPage
      userInfo={userInfo}
      initialPets={initialPets}
      initialPosts={initialPosts}
      initialBlogs={initialBlogs}
      initialUpgrades={initialUpgrades}
    />
  );
}

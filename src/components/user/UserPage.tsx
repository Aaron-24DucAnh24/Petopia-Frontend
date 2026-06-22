'use client';
import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { STATIC_URLS, USER_ROLE } from '../../utils/constants';
import { IApiResponse } from '@/src/interfaces/common';
import { IUserInfoResponse } from '@/src/interfaces/user';
import { IPetResponse } from '@/src/interfaces/pet';
import { IGetPostResponse } from '@/src/interfaces/post';
import { IBlogCardResponse } from '@/src/interfaces/blog';
import { IUpgradeResponse } from '@/src/interfaces/org';
import { UserAvatar } from './UserAvatar';
import { UserRoleName } from './UserRoleName';
import { UserInformationBlock } from './UserInformationBlock';
import { UserUpdateForm } from './UserUpdateForm';
import { PostGrid } from '../post/PostGrid';
import { PetGrid } from '../pet/PetGrid';
import { UserBlogGrid } from '../blog/UserBlogGrid';
import { UserUpgradeGrid } from './UserUpgradeGrid';
import { UserCreditCardGrid } from './UserCreditCardGrid';
import { UserPageSidebar, UserSection } from './UserPageSidebar';
import { QueryProvider } from '../providers/QueryProvider';
import { ValueTextManager } from '@/src/utils/ValueTextManager';
import { FiEdit2 } from 'react-icons/fi';

const VALID_SECTIONS: UserSection[] = ['profile', 'post', 'pet', 'blog', 'upgrade', 'creditcard'];

interface IUserPageProps {
  userInfo: IUserInfoResponse;
  initialPets?: IApiResponse<IPetResponse[]>;
  initialPosts?: IApiResponse<IGetPostResponse[]>;
  initialBlogs?: IApiResponse<IBlogCardResponse[]>;
  initialUpgrades: IUpgradeResponse[];
}

export const UserPage = QueryProvider(({
  userInfo,
  initialPets,
  initialPosts,
  initialBlogs,
  initialUpgrades,
}: IUserPageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showEdit, setShowEdit] = useState(false);
  const [image, setImage] = useState<string>(userInfo.image || STATIC_URLS.NO_AVATAR);

  const isOrg = userInfo.role === USER_ROLE.ORGANIZATION;
  const displayName = userInfo.attributes.organizationName ||
    `${userInfo.attributes.firstName} ${userInfo.attributes.lastName}`;
  const roleName = isOrg
    ? (ValueTextManager.OrganizationType.GetText(userInfo.attributes.type.toString()) ?? '')
    : 'Cá nhân';

  const rawTab = searchParams.get('tab') as UserSection | null;
  const activeSection: UserSection =
    rawTab && VALID_SECTIONS.includes(rawTab) ? rawTab : 'profile';

  const handleSectionChange = (section: UserSection) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', section);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    if (section !== 'profile') setShowEdit(false);
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 mt-8 pb-16">
      <div className="flex gap-5 items-start">
        <UserPageSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          displayName={displayName}
          roleName={roleName}
          image={image}
          isOrg={isOrg}
        />

        <main className="flex-1 min-w-0 bg-white shadow-xl rounded-2xl p-6">
          {activeSection === 'profile' && (
            <div>
              <div className="flex items-start justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <UserAvatar
                    image={image}
                    setImage={setImage}
                    containerClassName="h-24 w-24"
                  />
                  <UserRoleName
                    userName={displayName}
                    userRole={userInfo.role}
                    orgType={userInfo.attributes.type}
                    website={userInfo.attributes.website}
                  />
                </div>
                <button
                  onClick={() => setShowEdit(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
                >
                  <FiEdit2 size={13} />
                  {showEdit ? 'Huỷ' : 'Chỉnh sửa'}
                </button>
              </div>
              <UserInformationBlock userInfo={userInfo} visible={!showEdit} />
              <UserUpdateForm
                userInfo={userInfo}
                show={showEdit}
                onSuccess={() => router.refresh()}
                setShowEdit={setShowEdit}
              />
            </div>
          )}

          {activeSection === 'post' && (
            <PostGrid userId={userInfo.id} canCreate initialData={initialPosts} />
          )}

          {activeSection === 'pet' && (
            <PetGrid userId={userInfo.id} initialData={initialPets} />
          )}

          {activeSection === 'blog' && (
            <UserBlogGrid userId={userInfo.id} initialData={initialBlogs} />
          )}

          {activeSection === 'upgrade' && !isOrg && (
            <UserUpgradeGrid initialData={initialUpgrades} />
          )}

          {activeSection === 'creditcard' && (
            <UserCreditCardGrid />
          )}
        </main>
      </div>
    </div>
  );
});

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATIC_URLS } from '../../utils/constants';
import { IApiResponse } from '@/src/interfaces/common';
import { IUserInfoResponse } from '@/src/interfaces/user';
import { IPetResponse } from '@/src/interfaces/pet';
import { IGetPostResponse } from '@/src/interfaces/post';
import { IBlogCardResponse } from '@/src/interfaces/blog';
import { UserAvatar } from './UserAvatar';
import { UserRoleName } from './UserRoleName';
import { UserActionsBlock } from './UserActionsBlock';
import { UserInformationBlock } from './UserInformationBlock';
import { UserUpdateForm } from './UserUpdateForm';
import { PostGrid } from '../post/PostGrid';
import { PetGrid } from '../pet/PetGrid';
import { UserBlogGrid } from '../blog/UserBlogGrid';
import { QueryProvider } from '../providers/QueryProvider';

interface IUserPageProps {
  userInfo: IUserInfoResponse;
  initialPets?: IApiResponse<IPetResponse[]>;
  initialPosts?: IApiResponse<IGetPostResponse[]>;
  initialBlogs?: IApiResponse<IBlogCardResponse[]>;
}

export const UserPage = QueryProvider(({ userInfo, initialPets, initialPosts, initialBlogs }: IUserPageProps) => {
  const router = useRouter();

  const [showEdit, setShowEdit] = useState(false);
  const [image, setImage] = useState<string>(userInfo.image || STATIC_URLS.NO_AVATAR);

  return (
    <div>
      <div className="container max-w-3xl p-5 mx-auto shadow-2xl rounded-2xl mt-36">
        <div className="flex relative">
          <UserAvatar
            image={image}
            setImage={setImage} />
          <UserRoleName
            userName={userInfo.attributes.organizationName
              || (userInfo.attributes.firstName + ' ' + userInfo.attributes.lastName)}
            userRole={userInfo.role}
            orgType={userInfo.attributes.type}
            website={userInfo.attributes.website} />
        </div>
        <div className='-mt-20 space-y-2 relative'>
          <div className="flex justify-end">
            <UserActionsBlock
              setShowEdit={setShowEdit} />
          </div>

          <UserInformationBlock
            userInfo={userInfo}
            visible={!showEdit} />

          <UserUpdateForm
            userInfo={userInfo}
            show={showEdit}
            onSuccess={() => router.refresh()}
            setShowEdit={setShowEdit} />
        </div>
      </div>

      <div className="container max-w-3xl p-5 mx-auto shadow-2xl rounded-2xl mt-8">
        <PetGrid userId={userInfo.id} initialData={initialPets} />
      </div>

      <div className="container max-w-3xl p-5 mx-auto shadow-2xl rounded-2xl mt-8">
        <PostGrid userId={userInfo.id} canCreate initialData={initialPosts} />
      </div>

      <div className="container max-w-3xl p-5 mx-auto shadow-2xl rounded-2xl mt-8">
        <UserBlogGrid userId={userInfo.id} initialData={initialBlogs} />
      </div>
    </div>
  );
});

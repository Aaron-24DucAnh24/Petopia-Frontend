'use client';
import { useState } from 'react';
import { useQuery } from '../../utils/hooks';
import { IApiResponse } from '../../interfaces/common';
import { QUERY_KEYS, STATIC_URLS } from '../../utils/constants';
import { QueryProvider } from '../common/QueryProvider';
import { getPreUpgrade, getUserInfo } from '@/src/services/user.api';
import { UserSkeleton } from './UserSkeleton';
import { UserAvatar } from './UserAvatar';
import { UserRoleName } from './UserRoleName';
import { IUserInfoReponse } from '@/src/interfaces/user';
import { UserActionsBlock } from './UserActionsBlock';
import { UserInfomationBlock } from './UserInformationBlock';
import { UserUpdateForm } from './UserUpdateForm';
import Popup from 'reactjs-popup';
import { UserUpgradeForm } from './UserUpgradeForm';
import Button from '../common/button/Button';
import { UserPostCreateForm } from './UserPostCreateForm';
import { PostGrid } from '../post/PostGrid';
import { IGetPostResponse } from '@/src/interfaces/post';
import { getUserPosts } from '@/src/services/post.api';
import { useStores } from '@/src/stores';

export const UserPage = QueryProvider(() => {
  const { userStore } = useStores();

  // States
  const [showEdit, setShowEdit] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [userInfo, setUserInfo] = useState<IUserInfoReponse>();
  const [image, setImage] = useState<string>(STATIC_URLS.NO_AVATAR);
  const [allowUpgrade, setAllowUpgrade] = useState<boolean>(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<IGetPostResponse[]>([]);

  // Get user information
  const getUserQuery = useQuery<IApiResponse<IUserInfoReponse>>(
    [QUERY_KEYS.GET_CURRENT_USER],
    getUserInfo,
    {
      onSuccess: (res) => {
        setUserInfo(res.data.data);
        setImage(res.data.data.image);
      },
      refetchOnWindowFocus: false,
    }
  );

  const getUserPostsQuery = useQuery(
    [QUERY_KEYS.GET_USER_POSTS],
    () => getUserPosts(userStore.userContext!.id),
    {
      enabled: !!userStore.userContext?.id,
      onSuccess: (res: any) => setPosts(res.data.data ?? []),
      refetchOnWindowFocus: false,
    }
  );

  // Check if can upgrade account
  useQuery<IApiResponse<boolean>>(
    [QUERY_KEYS.GET_PRE_UPGRADE],
    getPreUpgrade,
    {
      onSuccess: (res) => {
        setAllowUpgrade(res.data.data);
      },
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div>
      {getUserQuery.isLoading && <UserSkeleton />}

      {!getUserQuery.isLoading && userInfo && (
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
            <UserActionsBlock
              setShowEdit={setShowEdit}
              setShowUpgrade={setShowUpgrade}
              allowUpgrade={allowUpgrade} />

            <UserInfomationBlock
              userInfo={userInfo}
              visible={!showEdit} />

            <UserUpdateForm
              userInfo={userInfo!}
              show={showEdit}
              onSuccess={() => getUserQuery.refetch()}
              setShowEdit={setShowEdit} />

            <Popup
              modal
              open={showUpgrade}
              onClose={() => setShowUpgrade(false)}
              overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}>
              <UserUpgradeForm
                onClose={() => setShowUpgrade(false)}
                onSuccess={() => setAllowUpgrade(false)} />
            </Popup>
          </div>
        </div>
      )}

      <div className="container max-w-3xl p-5 mx-auto shadow-2xl rounded-2xl mt-8">
        {posts.length > 0 && (
          <PostGrid posts={posts} query={getUserPostsQuery as any} />
        )}
        <div className="mt-4">
          <Button name={'Tạo mới'} action={() => setShowCreatePost(true)} />
        </div>
        <Popup
          modal
          open={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <UserPostCreateForm onSuccess={() => {
            setShowCreatePost(false);
            getUserPostsQuery.refetch();
          }} />
        </Popup>
      </div>
    </div>
  );
});

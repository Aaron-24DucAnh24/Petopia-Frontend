'use client';
import { useState } from 'react';
import { useQuery } from '../../utils/hooks';
import { IApiResponse } from '../../interfaces/common';
import { QUERY_KEYS, STATIC_URLS } from '../../utils/constants';
import { QueryProvider } from '../providers/QueryProvider';
import { getPreUpgrade, getUserInfo } from '@/src/services/user.api';
import { UserSkeleton } from './UserSkeleton';
import { UserAvatar } from './UserAvatar';
import { UserRoleName } from './UserRoleName';
import { IUserInfoResponse } from '@/src/interfaces/user';
import { UserActionsBlock } from './UserActionsBlock';
import { UserInformationBlock } from './UserInformationBlock';
import { UserUpdateForm } from './UserUpdateForm';
import { ConfirmCloseModal } from '../ui/ConfirmCloseModal';
import { UserUpgradeForm } from './UserUpgradeForm';
import { PostGrid } from '../post/PostGrid';
import { useStores } from '@/src/stores';

export const UserPage = QueryProvider(() => {
  const { userStore } = useStores();

  const [showEdit, setShowEdit] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [userInfo, setUserInfo] = useState<IUserInfoResponse>();
  const [image, setImage] = useState<string>(STATIC_URLS.NO_AVATAR);
  const [allowUpgrade, setAllowUpgrade] = useState<boolean>(false);

  const getUserQuery = useQuery<IApiResponse<IUserInfoResponse>>(
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
            <div className="flex justify-end">
              <UserActionsBlock
                setShowEdit={setShowEdit}
                setShowUpgrade={setShowUpgrade}
                allowUpgrade={allowUpgrade} />
            </div>

            <UserInformationBlock
              userInfo={userInfo}
              visible={!showEdit} />

            <UserUpdateForm
              userInfo={userInfo!}
              show={showEdit}
              onSuccess={() => getUserQuery.refetch()}
              setShowEdit={setShowEdit} />

            <ConfirmCloseModal open={showUpgrade} onClose={() => setShowUpgrade(false)}>
              <UserUpgradeForm
                onClose={() => setShowUpgrade(false)}
                onSuccess={() => setAllowUpgrade(false)} />
            </ConfirmCloseModal>
          </div>
        </div>
      )}

      <div className="container max-w-3xl p-5 mx-auto shadow-2xl rounded-2xl mt-8">
        <PostGrid userId={userStore.userContext?.id ?? ''} canCreate />
      </div>
    </div>
  );
});

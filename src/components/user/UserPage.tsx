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

export const UserPage = QueryProvider(() => {
  // States
  const [showEdit, setShowEdit] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [userInfo, setUserInfo] = useState<IUserInfoReponse>();
  const [image, setImage] = useState<string>(STATIC_URLS.NO_AVATAR);
  const [allowUpgrade, setAllowUpgrade] = useState<boolean>(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

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
        <Button name={'Tạo mới'} action={() => setShowCreatePost(true)} />
        <Popup
          modal
          open={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <UserPostCreateForm onSuccess={() => setShowCreatePost(false)} />
        </Popup>
      </div>
    </div>
  );
});

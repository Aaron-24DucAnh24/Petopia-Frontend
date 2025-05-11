'use client';
import { useState } from 'react';
import { useQuery } from '../../utils/hooks';
import { IApiResponse } from '../../interfaces/common';
import { QUERY_KEYS, STATIC_URLS } from '../../utils/constants';
import { QueryProvider } from '../general/QueryProvider';
import { getPreUpgrade, getUserInfo } from '@/src/services/user.api';
import UserSkeleton from '../general/UserSkeleton';
import TabbedTable from './TabbedTable';
import { AvatarBlock } from './AvatarBlock';
import { NameRoleBlock } from './NameRoleBlock';
import { IUserInfoReponse } from '@/src/interfaces/user';
import { ActionsBlock } from './ActionsBlock';
import { UserInfomationBlock } from './UserInformationBlock';
import { UserUpdateForm } from './UserUpdateForm';
import Popup from 'reactjs-popup';
import { UserUpgradeForm } from './UserUpgradeForm';

export const UserInformation = QueryProvider(() => {
  // STATES
  const [showEdit, setShowEdit] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [userInfo, setUserInfo] = useState<IUserInfoReponse>();
  const [image, setImage] = useState<string>(STATIC_URLS.NO_AVATAR);
  const [allowUpgrade, setAllowUpgrade] = useState<boolean>(false);

  // QUERIES
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
            <AvatarBlock
              image={image}
              setImage={setImage} />
            <NameRoleBlock
              userName={userInfo.attributes.organizationName
                || (userInfo.attributes.firstName + ' ' + userInfo.attributes.lastName)}
              userRole={userInfo.role}
              orgType={userInfo.attributes.type}
              website={userInfo.attributes.website} />
          </div>
          <div className='-mt-20 space-y-2 relative'>
            <ActionsBlock
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
      <TabbedTable userInfo={userInfo} />
    </div>
  );
});

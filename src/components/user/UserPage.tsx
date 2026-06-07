'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATIC_URLS } from '../../utils/constants';
import { IUserInfoResponse } from '@/src/interfaces/user';
import { UserAvatar } from './UserAvatar';
import { UserRoleName } from './UserRoleName';
import { UserActionsBlock } from './UserActionsBlock';
import { UserInformationBlock } from './UserInformationBlock';
import { UserUpdateForm } from './UserUpdateForm';
import { ConfirmCloseModal } from '../ui/ConfirmCloseModal';
import { UserUpgradeForm } from './UserUpgradeForm';
import { PostGrid } from '../post/PostGrid';
import { QueryProvider } from '../providers/QueryProvider';

interface IUserPageProps {
  userInfo: IUserInfoResponse;
  allowUpgrade: boolean;
}

export const UserPage = QueryProvider(({ userInfo, allowUpgrade: initialAllowUpgrade }: IUserPageProps) => {
  const router = useRouter();

  const [showEdit, setShowEdit] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [image, setImage] = useState<string>(userInfo.image || STATIC_URLS.NO_AVATAR);
  const [allowUpgrade, setAllowUpgrade] = useState(initialAllowUpgrade);

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
              setShowEdit={setShowEdit}
              setShowUpgrade={setShowUpgrade}
              allowUpgrade={allowUpgrade} />
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

      <ConfirmCloseModal open={showUpgrade} onClose={() => setShowUpgrade(false)}>
        <UserUpgradeForm
          onClose={() => setShowUpgrade(false)}
          onSuccess={() => {
            setAllowUpgrade(false);
            router.refresh();
          }} />
      </ConfirmCloseModal>

      <div className="container max-w-3xl p-5 mx-auto shadow-2xl rounded-2xl mt-8">
        <PostGrid userId={userInfo.id} canCreate />
      </div>
    </div>
  );
});

'use client';
import { useState } from 'react';
import { QueryProvider } from '../common/QueryProvider';
import { getOtherUserInfo } from '@/src/services/user.api';
import { IUserInfoReponse } from '@/src/interfaces/user';
import { IApiResponse } from '@/src/interfaces/common';
import { useQuery } from '@/src/utils/hooks';
import {
  QUERY_KEYS,
  REPORT_ENTITY,
  STATIC_URLS,
} from '@/src/utils/constants';
import Image from 'next/image';
import { ReportBlock } from '../common/ReportBlock';
import { UserInfomationBlock } from './UserInformationBlock';
import { UserSkeleton } from './UserSkeleton';
import { UserRoleName } from './UserRoleName';

export const OtherUserPage = QueryProvider(({ userId }: { userId: string }) => {
  // STATES
  const [userInfo, setUserInfo] = useState<IUserInfoReponse>();

  // QUERIES
  const getUserQuery = useQuery<IApiResponse<IUserInfoReponse>>(
    [QUERY_KEYS.GET_OTHER_USER],
    () => getOtherUserInfo({ userId: userId }),
    {
      onSuccess: (res) => {
        setUserInfo(res.data.data);
      },
      onError: () => {
        window.location.replace('/not-found');
      },
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  return (
    <>
      {getUserQuery.isLoading && <UserSkeleton />}

      {!getUserQuery.isLoading && userInfo && (
        <div className="container max-w-3xl p-5 mx-auto shadow-2xl rounded-2xl mt-36">
          <div className="flex relative md:-mb-10">
            <div className="relative h-32 w-32 md:h-52 md:w-52 bottom-10 md:bottom-20">
              <Image
                src={userInfo.image || STATIC_URLS.NO_AVATAR}
                alt="Picture of the author"
                fill
                objectFit="cover"
                className="rounded-full"
                quality={50} />
            </div>
            <UserRoleName
              userName={userInfo.attributes.organizationName
                || (userInfo.attributes.firstName + ' ' + userInfo.attributes.lastName)}
              userRole={userInfo.role}
              orgType={userInfo.attributes.type}
              website={userInfo.attributes.website} />
          </div>

          <UserInfomationBlock userInfo={userInfo} visible />

          <div className="mt-3 flex justify-end">
            <ReportBlock id={userId} type={REPORT_ENTITY.User} />
          </div>
        </div>
      )}
    </>
  );
}
);

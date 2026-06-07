'use client';
import { IUserInfoResponse } from '@/src/interfaces/user';
import { STATIC_URLS, REPORT_ENTITY } from '@/src/utils/constants';
import Image from 'next/image';
import { ReportBlock } from '../ui/ReportBlock';
import { UserInformationBlock } from './UserInformationBlock';
import { UserRoleName } from './UserRoleName';

interface IOtherUserPageProps {
  userId: string;
  userInfo: IUserInfoResponse;
}

export const OtherUserPage = ({ userId, userInfo }: IOtherUserPageProps) => {
  return (
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

      <UserInformationBlock userInfo={userInfo} visible />

      <div className="mt-3 flex justify-end">
        <ReportBlock id={userId} type={REPORT_ENTITY.User} />
      </div>
    </div>
  );
};

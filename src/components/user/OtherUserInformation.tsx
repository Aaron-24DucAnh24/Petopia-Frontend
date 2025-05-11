'use client';
import { useState } from 'react';
import { QueryProvider } from '../general/QueryProvider';
import ListCards from './ListCards';
import { getOtherUserInfo } from '@/src/services/user.api';
import { IUserInfoReponse } from '@/src/interfaces/user';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { useQuery } from '@/src/utils/hooks';
import {
  QUERY_KEYS,
  REPORT_ENTITY,
  STATIC_URLS,
} from '@/src/utils/constants';
import { useForm } from 'react-hook-form';
import { IPetResponse } from '@/src/interfaces/pet';
import { getPetsByUser } from '@/src/services/pet.api';
import Pagination from '../general/Pagination';
import UserSkeleton from '../general/UserSkeleton';
import { NameRoleBlock } from './NameRoleBlock';
import Image from 'next/image';
import { ReportBlock } from '../general/ReportBlock';
import { UserInfomationBlock } from './UserInformationBlock';

export const OtherUserInformation = QueryProvider(({ userId }: { userId: string }) => {
  // STATES
  const [userInfo, setUserInfo] = useState<IUserInfoReponse>();
  const [pets, setPets] = useState<IPetResponse[]>([]);

  // FORMS
  const paginationForm = useForm<IPaginationModel>({
    defaultValues: {
      pageIndex: 1,
      pageNumber: 1,
    },
  });

  // QUERIES
  const getUserQuery = useQuery<IApiResponse<IUserInfoReponse>>(
    [QUERY_KEYS.GET_OTHER_USER],
    () => getOtherUserInfo({ userId: userId }),
    {
      onSuccess: (res) => {
        setUserInfo(res.data.data);
      },
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const getPetsQuery = useQuery<IApiResponse<IPetResponse[]>>(
    [QUERY_KEYS.GET_PETS, getUserQuery.isLoading, paginationForm.watch('pageIndex')],
    () =>
      getPetsByUser({
        pageIndex: paginationForm.getValues('pageIndex'),
        pageSize: 6,
        orderBy: '',
        filter: userId,
      }),
    {
      onSuccess: (res) => {
        setPets(res.data.data);
        paginationForm.setValue('pageNumber', res.data.pageNumber!);
      },
      refetchOnWindowFocus: false,
      enabled: !getUserQuery.isLoading,
    }
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
            <NameRoleBlock
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

      {!!pets.length && <ListCards title="Danh sách thú cưng" data={pets} />}

      <div className="flex items-center justify-center my-5">
        <Pagination
          paginationForm={paginationForm}
          disable={getPetsQuery.isFetching}
          show={pets.length !== 0 && paginationForm.getValues('pageNumber') != 1} />
      </div>
    </>
  );
}
);

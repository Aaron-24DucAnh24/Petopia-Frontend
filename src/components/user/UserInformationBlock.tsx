import { IUserInfoReponse } from '@/src/interfaces/user';
import { format } from 'date-fns';
import Testimonials from '../general/Testimonials';
import { USER_ROLE } from '@/src/utils/constants';
import { ValueTextManager } from '@/src/utils/ValueTextManager';
import Link from 'next/link';
import { StringUtil } from '@/src/utils/StringUtil';

interface IUserInformationBlock {
  userInfo: IUserInfoReponse,
  visible: boolean,
}

export const UserInfomationBlock = (props: IUserInformationBlock) => {
  const { userInfo, visible } = props;

  if (!visible) return <></>;

  return (
    <>
      <Testimonials
        description={userInfo.attributes.description}
        show={userInfo.role === USER_ROLE.ORGANIZATION} />

      <div className="md:px-5 md:py-2 border w-full rounded-xl divide-y-2">
        {
          userInfo.role === USER_ROLE.ORGANIZATION
            ? (
              <>
                <div className='grid grid-cols-3 py-2'>
                  <div className=" text-gray-500 text-md">
                    Tên tổ chức:
                  </div>
                  <div className="ml-auto text-md md:text-lg font-medium tracking-wide truncate col-span-2 whitespace-normal text-right w-full">
                    {userInfo.attributes.organizationName}
                  </div>
                </div>

                <div className='grid grid-cols-3 py-2'>
                  <div className=" text-gray-500 text-md">
                    Loại hình:
                  </div>
                  <div className="ml-auto text-md md:text-lg font-medium tracking-wide truncate col-span-2 whitespace-normal text-right w-full">
                    {ValueTextManager.OrganizationType.GetText(userInfo.attributes.type.toString())}
                  </div>
                </div>

                <div className='grid grid-cols-3 py-2'>
                  <div className=" text-gray-500 text-md">
                    Website:
                  </div>
                  <Link
                    className="ml-auto text-md md:text-lg font-medium tracking-wide truncate col-span-2 whitespace-normal text-right w-full italic text-blue-600"
                    href={userInfo.attributes.website}
                    target="_blank"
                    rel="noopener noreferrer" >
                    {StringUtil.GetDomainName(userInfo.attributes.website)}
                  </Link>
                </div>
              </>
            )
            : (
              <>
                <div className='grid grid-cols-3 py-2'>
                  <div className=" text-gray-500 text-md">
                    Họ tên:
                  </div>
                  <div className="ml-auto text-md md:text-lg font-medium tracking-wide truncate col-span-2 whitespace-normal text-right w-full">
                    {userInfo.attributes.firstName + ' ' + userInfo.attributes.lastName}
                  </div>
                </div>

                <div className='grid grid-cols-3 py-2'>
                  <div className=" text-gray-500 text-md">
                    Ngày sinh:
                  </div>
                  <div className="ml-auto text-md md:text-lg font-medium tracking-wide truncate col-span-2 whitespace-normal text-right w-full">
                    {format(userInfo.birthDate, 'yyyy/MM/dd') || 'Chưa rõ'}
                  </div>
                </div>
              </>
            )
        }

        <div className='grid grid-cols-3 py-2'>
          <div className=" text-gray-500 text-md">
            Email:
          </div>
          <div className="ml-auto text-md md:text-lg font-medium tracking-wide truncate col-span-2 whitespace-normal text-right w-full">
            {userInfo.email || 'Chưa rõ'}
          </div>
        </div>

        <div className="grid grid-cols-3 py-2">
          <div className=" text-gray-500 text-md">
            Số điện thoại:
          </div>
          <div className="ml-auto text-md md:text-lg font-medium tracking-wide truncate col-span-2 whitespace-normal text-right w-full">
            {userInfo.phone || 'Chưa rõ'}
          </div>
        </div>

        <div className="grid grid-cols-3 py-2">
          <div className=" text-gray-500 text-md">
            Địa chỉ:
          </div>
          <div className="ml-auto text-md md:text-lg font-medium tracking-wide truncate col-span-2 whitespace-normal text-right w-full">
            {userInfo.address || 'Chưa rõ'}
          </div>
        </div>
      </div>
    </>
  );
};

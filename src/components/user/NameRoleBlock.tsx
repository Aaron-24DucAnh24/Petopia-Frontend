import { ORG_TYPE, USER_ROLE } from '@/src/utils/constants';
import { ValueTextManager } from '@/src/utils/ValueTextManager';
import Link from 'next/link';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { IoChevronForwardCircleSharp } from 'react-icons/io5';

interface INameRoleBlock {
  userRole: USER_ROLE;
  userName: string;
  orgType: ORG_TYPE;
  website: string;
}

export const NameRoleBlock = (props: INameRoleBlock) => {
  const { userRole, userName, orgType, website } = props;

  return (
    <div className="flex-1 pl-5">
      <div className='flex items-center mb-1'>
        <h1 className="font-bold text-xl md:text-3xl w-fit flex">
          {userName}
        </h1>
        {userRole !== USER_ROLE.STANDARD_USER && (
          <div className="flex justify-center ml-2 items-center bg-blue-600 text-xs h-6 rounded-full px-2 py-1 text-white space-x-1">
            {userRole === USER_ROLE.ORGANIZATION &&
              <p>{ValueTextManager.OrganizationType.GetText(orgType.toString())}</p>
            }
            {userRole === USER_ROLE.SYSTEM_ADMIN &&
              <p>{ValueTextManager.UserRole.GetText(userRole.toString())}</p>
            }
            <RiVerifiedBadgeFill size={12} color="white" />
          </div>
        )}
      </div>
      {userRole === USER_ROLE.ORGANIZATION && (
        <Link
          className='px-4 py-1 bg-yellow-300 rounded-3xl font-semibold shadow-lg flex w-fit items-center text-sm hover:bg-yellow-400'
          href={website}
          target="_blank"
          rel="noopener noreferrer" >
          Website
          <IoChevronForwardCircleSharp size={14} className='ml-1' />
        </Link>
      )}
    </div>
  );
};

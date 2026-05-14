import { IUserInfoResponse } from '@/src/interfaces/user';
import { format } from 'date-fns';
import { USER_ROLE } from '@/src/utils/constants';
import { ValueTextManager } from '@/src/utils/ValueTextManager';
import Link from 'next/link';
import { StringUtil } from '@/src/utils/StringUtil';
import Testimonials from '../common/Testimonials';
import { FiUser, FiCalendar, FiMail, FiPhone, FiMapPin, FiLink, FiBriefcase, FiTag } from 'react-icons/fi';

interface IUserInformationBlock {
  userInfo: IUserInfoResponse,
  visible: boolean,
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="mt-0.5 w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide leading-none mb-1">{label}</p>
        <div className="text-sm font-medium text-gray-800 break-words">{children}</div>
      </div>
    </div>
  );
}

export const UserInfomationBlock = (props: IUserInformationBlock) => {
  const { userInfo, visible } = props;

  if (!visible) return <></>;

  return (
    <>
      <Testimonials
        description={userInfo.attributes.description}
        show={userInfo.role === USER_ROLE.ORGANIZATION} />

      <div className="w-full rounded-2xl border border-gray-100 bg-white shadow-sm px-4 py-1">
        {userInfo.role === USER_ROLE.ORGANIZATION ? (
          <>
            <InfoRow icon={<FiBriefcase size={16} />} label="Tên tổ chức">
              {userInfo.attributes.organizationName || 'Chưa rõ'}
            </InfoRow>
            <InfoRow icon={<FiTag size={16} />} label="Loại hình">
              {ValueTextManager.OrganizationType.GetText(userInfo.attributes.type.toString()) || 'Chưa rõ'}
            </InfoRow>
            <InfoRow icon={<FiLink size={16} />} label="Website">
              {userInfo.attributes.website ? (
                <Link
                  href={userInfo.attributes.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {StringUtil.GetDomainName(userInfo.attributes.website)}
                </Link>
              ) : 'Chưa rõ'}
            </InfoRow>
          </>
        ) : (
          <>
            <InfoRow icon={<FiUser size={16} />} label="Họ tên">
              {userInfo.attributes.firstName + ' ' + userInfo.attributes.lastName}
            </InfoRow>
            <InfoRow icon={<FiCalendar size={16} />} label="Ngày sinh">
              {format(userInfo.birthDate, 'dd/MM/yyyy') || 'Chưa rõ'}
            </InfoRow>
          </>
        )}
        <InfoRow icon={<FiMail size={16} />} label="Email">
          {userInfo.email || 'Chưa rõ'}
        </InfoRow>
        <InfoRow icon={<FiPhone size={16} />} label="Số điện thoại">
          {userInfo.phone || 'Chưa rõ'}
        </InfoRow>
        <InfoRow icon={<FiMapPin size={16} />} label="Địa chỉ">
          {userInfo.address || 'Chưa rõ'}
        </InfoRow>
      </div>
    </>
  );
};

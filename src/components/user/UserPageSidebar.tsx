'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FiUser, FiFileText, FiBookOpen, FiAward, FiCreditCard, FiLock } from 'react-icons/fi';
import { MdPets } from 'react-icons/md';

export type UserSection = 'profile' | 'post' | 'pet' | 'blog' | 'upgrade' | 'creditcard';

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ active, onClick, icon, label }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-sm rounded-xl transition-colors text-left ${
        active
          ? 'bg-orange-50 text-orange-600 font-medium'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

interface IUserPageSidebarProps {
  activeSection: UserSection;
  onSectionChange: (section: UserSection) => void;
  displayName: string;
  roleName: string;
  image: string;
  isOrg: boolean;
}

export function UserPageSidebar({
  activeSection,
  onSectionChange,
  displayName,
  roleName,
  image,
  isOrg,
}: IUserPageSidebarProps) {
  return (
    <aside className="w-52 flex-shrink-0 bg-white shadow-xl rounded-2xl py-4 px-2 sticky top-24">
      <div className="flex flex-col items-center px-2 pb-4 mb-2 border-b border-gray-100">
        <div className="relative h-16 w-16 mb-2 rounded-full overflow-hidden">
          <Image src={image} alt={displayName} fill className="object-cover" />
        </div>
        <p className="text-sm font-semibold text-gray-800 text-center leading-tight w-full truncate px-1">
          {displayName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{roleName}</p>
      </div>

      <nav className="space-y-0.5">
        <NavItem
          active={activeSection === 'profile'}
          onClick={() => onSectionChange('profile')}
          icon={<FiUser size={15} />}
          label="Hồ sơ"
        />
        <NavItem
          active={activeSection === 'post'}
          onClick={() => onSectionChange('post')}
          icon={<FiFileText size={15} />}
          label="Bài đăng"
        />
        <NavItem
          active={activeSection === 'pet'}
          onClick={() => onSectionChange('pet')}
          icon={<MdPets size={15} />}
          label="Thú cưng"
        />
        <NavItem
          active={activeSection === 'blog'}
          onClick={() => onSectionChange('blog')}
          icon={<FiBookOpen size={15} />}
          label="Blog"
        />

        <div className="my-2 mx-1 border-t border-gray-100" />

        {!isOrg && (
          <NavItem
            active={activeSection === 'upgrade'}
            onClick={() => onSectionChange('upgrade')}
            icon={<FiAward size={15} />}
            label="Xác minh tổ chức"
          />
        )}
        <NavItem
          active={activeSection === 'creditcard'}
          onClick={() => onSectionChange('creditcard')}
          icon={<FiCreditCard size={15} />}
          label="Thẻ ngân hàng"
        />

        <div className="my-2 mx-1 border-t border-gray-100" />

        <Link
          href="/user/change-password"
          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm rounded-xl transition-colors text-left text-gray-600 hover:bg-gray-50 hover:text-gray-800"
        >
          <FiLock size={15} />
          Đổi mật khẩu
        </Link>
      </nav>
    </aside>
  );
}

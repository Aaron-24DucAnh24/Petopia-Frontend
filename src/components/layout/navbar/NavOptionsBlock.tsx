'use client';
import { IApiResponse } from '@/src/interfaces/common';
import { ICurrentUserCoreResponse } from '@/src/interfaces/user';
import { logout } from '@/src/services/authentication.api';
import { COOKIES_NAME, USER_ROLE } from '@/src/utils/constants';
import { useMutation } from '@/src/utils/hooks';
import { userStore } from '@/src/stores/user.store';
import { deleteCookie } from 'cookies-next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { FaNewspaper, FaPaw, FaFeather, FaUser, FaShield } from 'react-icons/fa6';
import { NavCreateMenu } from './NavCreateMenu';

interface INavOptionsBlock {
  isOpenMenu: boolean;
  setIsOpenMenu: Dispatch<SetStateAction<boolean>>;
  userContext: ICurrentUserCoreResponse | null;
}

export const NavOptionsBlock = (props: INavOptionsBlock) => {
  const { isOpenMenu, setIsOpenMenu, userContext } = props;
  const pathname = usePathname();

  const isLoggedIn = !!userContext;
  const isAdmin = userContext?.role === USER_ROLE.SYSTEM_ADMIN;

  const activeTab = 'bg-yellow-300 rounded-full font-medium text-black';
  const inactiveTab = 'text-gray-600 hover:bg-yellow-50 rounded-full transition-colors';

  const logoutMutation = useMutation<IApiResponse<boolean>, undefined>(logout, {
    onSuccess: () => {
      deleteCookie(COOKIES_NAME.ACCESS_TOKEN_SERVER);
      deleteCookie(COOKIES_NAME.REDIRECT);
      deleteCookie(COOKIES_NAME.REFRESH_TOKEN_SERVER);
      userStore.clearUserContext();
      window.location.replace('/login');
    },
  });

  return (
    <div
      className={`items-center ${isOpenMenu ? '' : 'hidden'} justify-between w-full md:flex md:w-auto md:order-1`}>
      <ul
          className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-1 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white md:items-center"
          onClick={() => setIsOpenMenu(false)}>
          <li>
            <Link
              test-id="home-link"
              href="/"
              className={`flex items-center gap-1.5 py-1.5 px-3 ${pathname === '/' ? activeTab : inactiveTab} rounded-full`}
              aria-current="page">
              <FaNewspaper size={13} />
              Bài đăng
            </Link>
          </li>
          <li>
            <Link
              test-id="search-link"
              href="/search"
              className={`flex items-center gap-1.5 py-1.5 px-3 ${pathname === '/search' ? activeTab : inactiveTab} rounded-full`}>
              <FaPaw size={13} />
              Thú cưng
            </Link>
          </li>
          <li>
            <Link
              test-id="blog-link"
              href="/blog"
              className={`flex items-center gap-1.5 py-1.5 px-3 ${pathname === '/blog' ? activeTab : inactiveTab} rounded-full`}>
              <FaFeather size={13} />
              Blog
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 py-1.5 px-3 ${pathname.startsWith('/admin') ? activeTab : inactiveTab} rounded-full`}>
                <FaShield size={13} />
                Admin
              </Link>
            </li>
          )}
          {isLoggedIn && (
            <>
              {/* Desktop: create-new button + dropdown (mobile equivalent lives in the header row) */}
              <li className="relative hidden md:block" onClick={(e) => e.stopPropagation()}>
                <NavCreateMenu userContext={userContext} />
              </li>
              <li>
                <Link
                  href="/user"
                  className="flex items-center gap-2 py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hidden cursor-pointer">
                  <FaUser size={13} />
                  Hồ sơ
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hidden cursor-pointer">
                    <FaShield size={13} />
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <a
                  onClick={() => logoutMutation.mutate(undefined)}
                  className="block py-2 px-3 text-yellow-500 rounded hover:bg-gray-100 md:hidden cursor-pointer">
                  Đăng xuất
                </a>
              </li>
            </>
          )}
      </ul>
    </div>
  );
};

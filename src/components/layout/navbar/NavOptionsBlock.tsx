'use client';
import { IApiResponse } from '@/src/interfaces/common';
import { ICurrentUserCoreResponse } from '@/src/interfaces/user';
import { logout } from '@/src/services/authentication.api';
import { COOKIES_NAME, USER_ROLE } from '@/src/utils/constants';
import { useClickOutside, useMutation } from '@/src/utils/hooks';
import { userStore } from '@/src/stores/user.store';
import { deleteCookie } from 'cookies-next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { FaNewspaper, FaPaw, FaFeather, FaPlus, FaUser, FaShield } from 'react-icons/fa6';
import { UserPostCreateForm } from '@/src/components/user/UserPostCreateForm';
import PetProfileForm from '@/src/components/pet/PetProfileForm';
import { ConfirmCloseModal } from '@/src/components/ui/ConfirmCloseModal';

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
  const isOrgOrAdmin = userContext?.role === USER_ROLE.ORGANIZATION || userContext?.role === USER_ROLE.SYSTEM_ADMIN;

  const activeTab = 'bg-yellow-300 rounded-full font-medium text-black';
  const inactiveTab = 'text-gray-600 hover:bg-yellow-50 rounded-full transition-colors';

  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const createButtonRef = useRef<HTMLButtonElement>(null);
  const createDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(() => setIsOpenCreate(false), [createButtonRef, createDropdownRef]);

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
    <>
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
              {/* Desktop: dropdown trigger */}
              <li className="relative hidden md:block" onClick={(e) => e.stopPropagation()}>
                <button
                  ref={createButtonRef}
                  test-id="create-new-button"
                  onClick={() => setIsOpenCreate(!isOpenCreate)}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-yellow-300 rounded-full hover:bg-yellow-400 transition-colors font-medium text-black">
                  <FaPlus size={12} />
                  Tạo mới
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpenCreate && (
                  <div
                    ref={createDropdownRef}
                    className="absolute top-full left-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      test-id="create-post-option"
                      onClick={() => { setIsOpenCreate(false); setIsPostModalOpen(true); }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 transition-colors">
                      <FaNewspaper size={13} />
                      Tạo bài đăng
                    </button>
                    <button
                      onClick={() => { setIsOpenCreate(false); setIsPetModalOpen(true); }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 transition-colors">
                      <FaPaw size={13} />
                      Tạo thú cưng
                    </button>
                    {isOrgOrAdmin && (
                      <Link
                        href="/blog/new"
                        onClick={() => setIsOpenCreate(false)}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 transition-colors">
                        <FaFeather size={13} />
                        Tạo blog
                      </Link>
                    )}
                  </div>
                )}
              </li>
              {/* Mobile: direct items */}
              <li className="md:hidden">
                <button
                  onClick={() => { setIsOpenMenu(false); setIsPostModalOpen(true); }}
                  className="flex items-center gap-2 w-full text-left py-2 px-3 text-gray-700 rounded hover:bg-gray-100">
                  <FaNewspaper size={13} />
                  Tạo bài đăng
                </button>
              </li>
              <li className="md:hidden">
                <button
                  onClick={() => { setIsOpenMenu(false); setIsPetModalOpen(true); }}
                  className="flex items-center gap-2 w-full text-left py-2 px-3 text-gray-700 rounded hover:bg-gray-100">
                  <FaPaw size={13} />
                  Tạo thú cưng
                </button>
              </li>
              {isOrgOrAdmin && (
                <li className="md:hidden">
                  <Link
                    href="/blog/new"
                    onClick={() => setIsOpenMenu(false)}
                    className="flex items-center gap-2 py-2 px-3 text-gray-700 rounded hover:bg-gray-100">
                    <FaFeather size={13} />
                    Tạo blog
                  </Link>
                </li>
              )}
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

      {isLoggedIn && (
        <ConfirmCloseModal
          open={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}>
          <UserPostCreateForm onSuccess={() => setIsPostModalOpen(false)} />
        </ConfirmCloseModal>
      )}

      {isLoggedIn && (
        <ConfirmCloseModal
          open={isPetModalOpen}
          onClose={() => setIsPetModalOpen(false)}
          contentStyle={{ width: '90vw', maxWidth: '900px', padding: 0, borderRadius: '12px' }}>
          <div className="bg-white rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
            <PetProfileForm />
          </div>
        </ConfirmCloseModal>
      )}
    </>
  );
};

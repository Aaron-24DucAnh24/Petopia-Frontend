'use client';
import { useState } from 'react';
import { ICurrentUserCoreResponse } from '@/src/interfaces/user';
import { INotificationResponse } from '@/src/interfaces/notification';
import { QueryProvider } from '../../providers/QueryProvider';
import { NavProfileBlock } from './NavProfileBlock';
import { NavOptionsBlock } from './NavOptionsBlock';
import Link from 'next/link';

interface INavbar {
  userContext: ICurrentUserCoreResponse | null;
  notifications: INotificationResponse[];
}

export const Navbar = QueryProvider(({ userContext, notifications }: INavbar) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <nav className="border-b border-gray-100 shadow-sm w-full fixed top-0 bg-white z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl whitespace-nowrap ">
            <span className="text-yellow-300">Pet</span>opia
          </span>
        </Link>
        {userContext
          ? (<NavProfileBlock
            name={userContext.name}
            image={userContext.image}
            email={userContext.email}
            notifications={notifications} />)
          : (<div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <Link href="/register">
              <button className="mx-4">Đăng kí</button>
            </Link>
            <Link href="/login">
              <button
                test-id="login-button"
                className="text-black bg-yellow-300 rounded-full py-2 px-4 hover:bg-yellow-400"
              >
                Đăng nhập
              </button>
            </Link>
          </div>
          )}
        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
          onClick={() => setIsOpenMenu(!isOpenMenu)}>
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <NavOptionsBlock
          isOpenMenu={isOpenMenu}
          setIsOpenMenu={setIsOpenMenu}
          userContext={userContext} />
      </div>
    </nav>
  );
});

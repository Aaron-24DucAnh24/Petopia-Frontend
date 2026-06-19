'use client';
import { ICurrentUserCoreResponse } from '@/src/interfaces/user';
import Image from 'next/image';
import { STATIC_URLS } from '@/src/utils/constants';

interface IAdminHeaderProps {
  title: string;
  subtitle?: string;
  userContext: ICurrentUserCoreResponse | null;
}

export function AdminHeader({ title, subtitle, userContext }: IAdminHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {userContext && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{userContext.name}</p>
            <p className="text-xs text-gray-400">Quản trị viên</p>
          </div>
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-amber-400">
            <Image
              src={userContext.image || STATIC_URLS.NO_AVATAR}
              alt={userContext.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
    </header>
  );
}

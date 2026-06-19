'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@/src/utils/hooks';
import { QUERY_KEYS, USER_ROLE, STATIC_URLS } from '@/src/utils/constants';
import { IAdminUserResponse, IAdminSearchFilter } from '@/src/interfaces/admin';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { getAdminUsers, deactivateUser, activateUser } from '@/src/services/admin.api';
import { AxiosResponse } from 'axios';
import { AdminSearchBar } from './AdminSearchBar';
import { AdminStatusBadge } from './AdminStatusBadge';
import { AdminToggleButton } from './AdminToggleButton';
import Pagination from '@/src/components/ui/Pagination';
import Image from 'next/image';
import { QueryProvider } from '../providers/QueryProvider';
import { formatDate } from '@/src/helpers/formatDate';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { ValueTextManager } from '@/src/utils/ValueTextManager';

const ROLE_COLORS: Record<USER_ROLE, string> = {
  [USER_ROLE.STANDARD_USER]: 'bg-gray-100 text-gray-600',
  [USER_ROLE.SYSTEM_ADMIN]: 'bg-red-100 text-red-700',
  [USER_ROLE.ORGANIZATION]: 'bg-purple-100 text-purple-700',
};

const PAGE_SIZE = 10;

export const AdminUsersList = QueryProvider(() => {
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const paginationForm = useForm<IPaginationModel>({ defaultValues: { pageIndex: 1, pageNumber: 1 } });
  const pageIndex = paginationForm.watch('pageIndex');

  const filter: IAdminSearchFilter = { keyword: keyword || undefined, isActive: statusFilter };

  const { data, refetch, isLoading } = useQuery<IApiResponse<IAdminUserResponse[]>>(
    [QUERY_KEYS.ADMIN_USERS, pageIndex, keyword, statusFilter],
    () => getAdminUsers({ pageIndex, pageSize: PAGE_SIZE, filter }),
    {
      onSuccess: (res: AxiosResponse<IApiResponse<IAdminUserResponse[]>>) => {
        const total = res.data.totalNumber ?? 0;
        paginationForm.setValue('pageNumber', Math.max(1, Math.ceil(total / PAGE_SIZE)));
      },
    }
  );

  const deactivateMutation = useMutation(deactivateUser, { onSuccess: () => refetch() });
  const activateMutation = useMutation(activateUser, { onSuccess: () => refetch() });

  const users = (data as AxiosResponse<IApiResponse<IAdminUserResponse[]>>)?.data?.data ?? [];

  const handleSearch = (val: string) => {
    setKeyword(val);
    paginationForm.setValue('pageIndex', 1);
  };

  const handleStatusChange = (val: boolean | undefined) => {
    setStatusFilter(val);
    paginationForm.setValue('pageIndex', 1);
  };

  const handleToggle = async (user: IAdminUserResponse) => {
    if (user.isActive) {
      await deactivateMutation.mutateAsync(user.id);
    } else {
      await activateMutation.mutateAsync(user.id);
    }
  };

  return (
    <div>
      <AdminSearchBar
        value={keyword}
        onChange={handleSearch}
        placeholder="Tìm theo tên, email..."
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Người dùng</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Vai trò</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ngày tạo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={user.image || STATIC_URLS.NO_AVATAR}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-800 truncate max-w-[120px]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell truncate max-w-[180px]">{user.email}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                        {ValueTextManager.UserRole.GetText(String(user.role)) ?? 'Không xác định'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs">{formatDate(user.isCreatedAt)}</td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge isActive={user.isActive} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/user/${user.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-amber-500 transition-colors"
                          title="Xem trang người dùng"
                        >
                          <FaExternalLinkAlt className="w-3 h-3" />
                        </a>
                        {user.role !== USER_ROLE.SYSTEM_ADMIN && (
                          <AdminToggleButton
                            isActive={user.isActive}
                            onToggle={() => handleToggle(user)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        paginationForm={paginationForm}
        disable={isLoading}
        show={paginationForm.watch('pageNumber') > 1}
      />
    </div>
  );
});

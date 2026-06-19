'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@/src/utils/hooks';
import { QUERY_KEYS } from '@/src/utils/constants';
import { IAdminPostResponse, IAdminSearchFilter } from '@/src/interfaces/admin';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { getAdminPosts, deactivatePost, activatePost } from '@/src/services/admin.api';
import { AxiosResponse } from 'axios';
import { AdminSearchBar } from './AdminSearchBar';
import { AdminStatusBadge } from './AdminStatusBadge';
import { AdminToggleButton } from './AdminToggleButton';
import Pagination from '@/src/components/ui/Pagination';
import { QueryProvider } from '../providers/QueryProvider';
import { formatDate } from '@/src/helpers/formatDate';
import { FaHeart } from 'react-icons/fa';

const PAGE_SIZE = 10;

export const AdminPostsList = QueryProvider(() => {
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const paginationForm = useForm<IPaginationModel>({ defaultValues: { pageIndex: 1, pageNumber: 1 } });
  const pageIndex = paginationForm.watch('pageIndex');

  const { data, refetch, isLoading } = useQuery<IApiResponse<IAdminPostResponse[]>>(
    [QUERY_KEYS.ADMIN_POSTS, pageIndex, keyword, statusFilter],
    () => getAdminPosts({ pageIndex, pageSize: PAGE_SIZE, filter: { keyword: keyword || undefined, isActive: statusFilter } }),
    {
      onSuccess: (res: AxiosResponse<IApiResponse<IAdminPostResponse[]>>) => {
        const total = res.data.totalNumber ?? 0;
        paginationForm.setValue('pageNumber', Math.max(1, Math.ceil(total / PAGE_SIZE)));
      },
    }
  );

  const deactivateMutation = useMutation(deactivatePost, { onSuccess: () => refetch() });
  const activateMutation = useMutation(activatePost, { onSuccess: () => refetch() });

  const posts = (data as AxiosResponse<IApiResponse<IAdminPostResponse[]>>)?.data?.data ?? [];

  const handleSearch = (val: string) => {
    setKeyword(val);
    paginationForm.setValue('pageIndex', 1);
  };

  const handleStatusChange = (val: boolean | undefined) => {
    setStatusFilter(val);
    paginationForm.setValue('pageIndex', 1);
  };

  const handleToggle = async (post: IAdminPostResponse) => {
    if (post.isActive) {
      await deactivateMutation.mutateAsync(post.id);
    } else {
      await activateMutation.mutateAsync(post.id);
    }
  };

  return (
    <div>
      <AdminSearchBar
        value={keyword}
        onChange={handleSearch}
        placeholder="Tìm theo nội dung, tên người đăng..."
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nội dung</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Người đăng</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Lượt thích</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ngày đăng</th>
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
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    Không tìm thấy bài đăng nào.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-gray-700 truncate">{post.content}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{post.userName}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="flex items-center gap-1 text-pink-500 font-medium">
                        <FaHeart className="w-3 h-3" />{post.like}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs">{formatDate(post.isCreatedAt)}</td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge isActive={post.isActive} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AdminToggleButton
                        isActive={post.isActive}
                        onToggle={() => handleToggle(post)}
                      />
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

'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@/src/utils/hooks';
import { BLOG_CATEGORIES, QUERY_KEYS } from '@/src/utils/constants';
import { IAdminBlogResponse, IAdminSearchFilter } from '@/src/interfaces/admin';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { getAdminBlogs, deactivateBlog, activateBlog } from '@/src/services/admin.api';
import { AxiosResponse } from 'axios';
import { AdminSearchBar } from './AdminSearchBar';
import { AdminStatusBadge } from './AdminStatusBadge';
import { AdminToggleButton } from './AdminToggleButton';
import Pagination from '@/src/components/ui/Pagination';
import { QueryProvider } from '../providers/QueryProvider';
import { formatDate } from '@/src/helpers/formatDate';
import { FaEye, FaExternalLinkAlt } from 'react-icons/fa';
import { ValueTextManager } from '@/src/utils/ValueTextManager';

const CATEGORY_COLORS: Record<BLOG_CATEGORIES, string> = {
  [BLOG_CATEGORIES.HEALTH]: 'bg-green-100 text-green-700',
  [BLOG_CATEGORIES.TRAINING]: 'bg-blue-100 text-blue-700',
  [BLOG_CATEGORIES.PRODUCT]: 'bg-purple-100 text-purple-700',
  [BLOG_CATEGORIES.ART]: 'bg-pink-100 text-pink-700',
};

const PAGE_SIZE = 10;

export const AdminBlogsList = QueryProvider(() => {
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const paginationForm = useForm<IPaginationModel>({ defaultValues: { pageIndex: 1, pageNumber: 1 } });
  const pageIndex = paginationForm.watch('pageIndex');

  const { data, refetch, isLoading } = useQuery<IApiResponse<IAdminBlogResponse[]>>(
    [QUERY_KEYS.ADMIN_BLOGS, pageIndex, keyword, statusFilter],
    () => getAdminBlogs({ pageIndex, pageSize: PAGE_SIZE, filter: { keyword: keyword || undefined, isActive: statusFilter } }),
    {
      onSuccess: (res: AxiosResponse<IApiResponse<IAdminBlogResponse[]>>) => {
        const total = res.data.totalNumber ?? 0;
        paginationForm.setValue('pageNumber', Math.max(1, Math.ceil(total / PAGE_SIZE)));
      },
    }
  );

  const deactivateMutation = useMutation(deactivateBlog, { onSuccess: () => refetch() });
  const activateMutation = useMutation(activateBlog, { onSuccess: () => refetch() });

  const blogs = (data as AxiosResponse<IApiResponse<IAdminBlogResponse[]>>)?.data?.data ?? [];

  const handleSearch = (val: string) => {
    setKeyword(val);
    paginationForm.setValue('pageIndex', 1);
  };

  const handleStatusChange = (val: boolean | undefined) => {
    setStatusFilter(val);
    paginationForm.setValue('pageIndex', 1);
  };

  const handleToggle = async (blog: IAdminBlogResponse) => {
    if (blog.isActive) {
      await deactivateMutation.mutateAsync(blog.id);
    } else {
      await activateMutation.mutateAsync(blog.id);
    }
  };

  return (
    <div>
      <AdminSearchBar
        value={keyword}
        onChange={handleSearch}
        placeholder="Tìm theo tiêu đề, tên tác giả..."
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Danh mục</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Tác giả</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Lượt xem</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ngày đăng</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    Không tìm thấy blog nào.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 max-w-[180px]">
                      <p className="font-medium text-gray-800 truncate">{blog.title}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[blog.category] ?? 'bg-gray-100 text-gray-600'}`}>
                        {ValueTextManager.BlogCategory.GetText(String(blog.category)) ?? 'Khác'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 truncate max-w-[120px]">{blog.userName}</span>
                        <a
                          href={`/user/${blog.userId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 hover:text-amber-500 transition-colors shrink-0"
                          title="Xem trang người dùng"
                        >
                          <FaExternalLinkAlt className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="flex items-center gap-1 text-gray-500">
                        <FaEye className="w-3 h-3" />{blog.view?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs">{formatDate(blog.isCreatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <AdminStatusBadge isActive={blog.isActive} />
                        {blog.advertisingDate && (
                          new Date(blog.advertisingDate) > new Date()
                            ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 font-medium whitespace-nowrap">
                                Đến {formatDate(blog.advertisingDate)}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 font-medium whitespace-nowrap">
                                HH {formatDate(blog.advertisingDate)}
                              </span>
                            )
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/blog/${blog.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-amber-500 transition-colors"
                          title="Xem trang blog"
                        >
                          <FaExternalLinkAlt className="w-3 h-3" />
                        </a>
                        <AdminToggleButton
                          isActive={blog.isActive}
                          onToggle={() => handleToggle(blog)}
                        />
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

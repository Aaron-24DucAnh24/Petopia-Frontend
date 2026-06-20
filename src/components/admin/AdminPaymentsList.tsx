'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@/src/utils/hooks';
import { QUERY_KEYS, ADMIN_PAGE_SIZE } from '@/src/utils/constants';
import { IAdminPaymentResponse, IAdminSearchFilter } from '@/src/interfaces/admin';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { getAdminPayments } from '@/src/services/admin.api';
import { AxiosResponse } from 'axios';
import { AdminSearchBar } from './AdminSearchBar';
import Pagination from '@/src/components/ui/Pagination';
import { QueryProvider } from '../providers/QueryProvider';
import { formatDate } from '@/src/helpers/formatDate';
import { FaExternalLinkAlt } from 'react-icons/fa';

export const AdminPaymentsList = QueryProvider(() => {
  const [keyword, setKeyword] = useState('');
  const paginationForm = useForm<IPaginationModel>({ defaultValues: { pageIndex: 1, pageNumber: 1 } });
  const pageIndex = paginationForm.watch('pageIndex');

  const { data, isLoading } = useQuery<IApiResponse<IAdminPaymentResponse[]>>(
    [QUERY_KEYS.ADMIN_PAYMENTS, pageIndex, keyword],
    () => getAdminPayments({ pageIndex, pageSize: ADMIN_PAGE_SIZE, filter: { keyword: keyword || undefined } }),
    {
      onSuccess: (res: AxiosResponse<IApiResponse<IAdminPaymentResponse[]>>) => {
        const total = res.data.totalNumber ?? 0;
        paginationForm.setValue('pageNumber', Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)));
      },
    }
  );

  const payments = (data as AxiosResponse<IApiResponse<IAdminPaymentResponse[]>>)?.data?.data ?? [];

  const handleSearch = (val: string) => {
    setKeyword(val);
    paginationForm.setValue('pageIndex', 1);
  };

  return (
    <div>
      <AdminSearchBar
        value={keyword}
        onChange={handleSearch}
        placeholder="Tìm theo blog, người dùng..."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Blog</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Người mua</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Thời hạn</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Số tiền</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ngày giao dịch</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    Không tìm thấy giao dịch nào.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 max-w-[180px]">
                      <p className="font-medium text-gray-800 truncate">{payment.blogTitle}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{payment.userName}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {payment.monthDuration} tháng
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-teal-600">
                        {payment.amount?.toLocaleString()} VND
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs">{formatDate(payment.isCreatedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/blog/${payment.blogId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-amber-500 transition-colors inline-flex"
                        title="Xem trang blog"
                      >
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
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

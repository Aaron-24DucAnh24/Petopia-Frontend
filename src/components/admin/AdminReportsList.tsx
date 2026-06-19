'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@/src/utils/hooks';
import { QUERY_KEYS, REPORT_ENTITY } from '@/src/utils/constants';
import { IAdminReportResponse, IAdminSearchFilter } from '@/src/interfaces/admin';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { getAdminReports, resolveReport } from '@/src/services/admin.api';
import { AxiosResponse } from 'axios';
import Pagination from '@/src/components/ui/Pagination';
import { QueryProvider } from '../providers/QueryProvider';
import { formatDate } from '@/src/helpers/formatDate';
import { Alert } from '@/src/components/ui/Alert';

const ENTITY_LABELS: Record<REPORT_ENTITY, string> = {
  [REPORT_ENTITY.User]: 'Người dùng',
  [REPORT_ENTITY.Pet]: 'Thú cưng',
  [REPORT_ENTITY.Blog]: 'Blog',
};

const ENTITY_COLORS: Record<REPORT_ENTITY, string> = {
  [REPORT_ENTITY.User]: 'bg-blue-100 text-blue-700',
  [REPORT_ENTITY.Pet]: 'bg-amber-100 text-amber-700',
  [REPORT_ENTITY.Blog]: 'bg-pink-100 text-pink-700',
};

const PAGE_SIZE = 10;

export const AdminReportsList = QueryProvider(() => {
  const [resolvedFilter, setResolvedFilter] = useState<boolean | undefined>(undefined);
  const [pendingReport, setPendingReport] = useState<IAdminReportResponse | null>(null);
  const paginationForm = useForm<IPaginationModel>({ defaultValues: { pageIndex: 1, pageNumber: 1 } });
  const pageIndex = paginationForm.watch('pageIndex');

  const { data, refetch, isLoading } = useQuery<IApiResponse<IAdminReportResponse[]>>(
    [QUERY_KEYS.ADMIN_REPORTS, pageIndex, resolvedFilter],
    () => getAdminReports({ pageIndex, pageSize: PAGE_SIZE, filter: { isActive: resolvedFilter === undefined ? undefined : !resolvedFilter } }),
    {
      onSuccess: (res: AxiosResponse<IApiResponse<IAdminReportResponse[]>>) => {
        const total = res.data.totalNumber ?? 0;
        paginationForm.setValue('pageNumber', Math.max(1, Math.ceil(total / PAGE_SIZE)));
      },
    }
  );

  const resolveMutation = useMutation(resolveReport, { onSuccess: () => refetch() });

  const reports = (data as AxiosResponse<IApiResponse<IAdminReportResponse[]>>)?.data?.data ?? [];

  const handleResolvedChange = (val: boolean | undefined) => {
    setResolvedFilter(val);
    paginationForm.setValue('pageIndex', 1);
  };

  const handleResolve = (report: IAdminReportResponse) => {
    setPendingReport(report);
  };

  const handleConfirmResolve = async () => {
    if (!pendingReport) return;
    await resolveMutation.mutateAsync({ targetId: pendingReport.targetId, targetType: pendingReport.targetType });
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-xs text-gray-500">
        <span>Lọc:</span>
        {[
          { label: 'Tất cả', val: undefined },
          { label: 'Chưa giải quyết', val: false },
          { label: 'Đã giải quyết', val: true },
        ].map(({ label, val }) => (
          <button
            key={String(val)}
            onClick={() => handleResolvedChange(val)}
            className={`px-3 py-1 rounded-full transition-colors ${
              resolvedFilter === val
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Đối tượng bị báo cáo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Loại</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Số lượng báo cáo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Báo cáo gần nhất</th>
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
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    Không tìm thấy báo cáo nào.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={`${report.targetType}-${report.targetId}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800 font-mono text-xs">
                      {report.targetId.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ENTITY_COLORS[report.targetType] ?? 'bg-gray-100 text-gray-600'}`}>
                        {ENTITY_LABELS[report.targetType] ?? 'Không xác định'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {report.spamCount > 0 && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
                            Spam ×{report.spamCount}
                          </span>
                        )}
                        {report.scamCount > 0 && (
                          <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                            Lừa đảo ×{report.scamCount}
                          </span>
                        )}
                        {report.inappropriateCount > 0 && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                            Không phù hợp ×{report.inappropriateCount}
                          </span>
                        )}
                        {report.otherCount > 0 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            Khác ×{report.otherCount}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-gray-700 ml-1">
                          ({report.totalCount})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs">{formatDate(report.lastReportAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.isResolved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${report.isResolved ? 'bg-green-500' : 'bg-orange-400'}`} />
                        {report.isResolved ? 'Đã giải quyết' : 'Chờ xử lý'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!report.isResolved && (
                        <button
                          onClick={() => handleResolve(report)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 transition-colors"
                        >
                          Giải quyết
                        </button>
                      )}
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

      <Alert
        show={!!pendingReport}
        setShow={(show) => { if (!show) setPendingReport(null); }}
        failed={false}
        title="Xác nhận giải quyết báo cáo"
        message="Tất cả báo cáo về đối tượng này sẽ được đánh dấu đã giải quyết. Bạn có chắc chắn không?"
        action={handleConfirmResolve}
        showCancel
      />
    </div>
  );
});

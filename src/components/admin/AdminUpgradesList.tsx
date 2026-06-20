'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@/src/utils/hooks';
import { QUERY_KEYS, UPGRADE_STATUS, ORG_TYPE, STATIC_URLS, ADMIN_PAGE_SIZE } from '@/src/utils/constants';
import { IAdminUpgradeResponse, IAdminSearchFilter } from '@/src/interfaces/admin';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { getAdminUpgrades, approveUpgrade, rejectUpgrade } from '@/src/services/admin.api';
import { AxiosResponse } from 'axios';
import Pagination from '@/src/components/ui/Pagination';
import { QueryProvider } from '../providers/QueryProvider';
import { AdminSearchBar } from './AdminSearchBar';
import { formatDate } from '@/src/helpers/formatDate';
import { Alert } from '@/src/components/ui/Alert';
import { UpgradeRequestDetail } from '@/src/components/user/UpgradeRequestDetail';
import Popup from 'reactjs-popup';
import { UPGRADE_MODAL_STYLE } from '@/src/components/user/UpgradeRequestDetailModal';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { FaEye } from 'react-icons/fa';
import { ValueTextManager } from '@/src/utils/ValueTextManager';

const STATUS_OPTIONS: { label: string; value: UPGRADE_STATUS | undefined }[] = [
  { label: 'Tất cả', value: undefined },
  { label: 'Chờ duyệt', value: UPGRADE_STATUS.PENDING },
  { label: 'Đã duyệt', value: UPGRADE_STATUS.APPROVED },
  { label: 'Từ chối', value: UPGRADE_STATUS.REJECTED },
  { label: 'Đã hủy', value: UPGRADE_STATUS.CANCELLED },
];

const STATUS_COLORS: Record<UPGRADE_STATUS, string> = {
  [UPGRADE_STATUS.PENDING]: 'bg-yellow-100 text-yellow-700',
  [UPGRADE_STATUS.APPROVED]: 'bg-green-100 text-green-700',
  [UPGRADE_STATUS.REJECTED]: 'bg-red-100 text-red-700',
  [UPGRADE_STATUS.CANCELLED]: 'bg-gray-100 text-gray-500',
};

const ORG_TYPE_COLORS: Record<ORG_TYPE, string> = {
  [ORG_TYPE.RESCUE]: 'bg-green-100 text-green-700',
  [ORG_TYPE.BUSINESS]: 'bg-blue-100 text-blue-700',
  [ORG_TYPE.VET]: 'bg-teal-100 text-teal-700',
  [ORG_TYPE.OTHER]: 'bg-gray-100 text-gray-600',
};

export const AdminUpgradesList = QueryProvider(() => {
  const [statusFilter, setStatusFilter] = useState<UPGRADE_STATUS | undefined>(undefined);
  const [selectedRequest, setSelectedRequest] = useState<IAdminUpgradeResponse | null>(null);
  const [pendingApprove, setPendingApprove] = useState<IAdminUpgradeResponse | null>(null);
  const [pendingReject, setPendingReject] = useState<IAdminUpgradeResponse | null>(null);
  const [keyword, setKeyword] = useState('');
  const paginationForm = useForm<IPaginationModel>({ defaultValues: { pageIndex: 1, pageNumber: 1 } });
  const pageIndex = paginationForm.watch('pageIndex');

  const filter: IAdminSearchFilter = {
    keyword: keyword || undefined,
    upgradeStatus: statusFilter,
  };

  const { data, refetch, isLoading } = useQuery<IApiResponse<IAdminUpgradeResponse[]>>(
    [QUERY_KEYS.ADMIN_UPGRADES, pageIndex, keyword, statusFilter],
    () => getAdminUpgrades({ pageIndex, pageSize: ADMIN_PAGE_SIZE, filter }),
    {
      onSuccess: (res: AxiosResponse<IApiResponse<IAdminUpgradeResponse[]>>) => {
        const total = res.data.totalNumber ?? 0;
        paginationForm.setValue('pageNumber', Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)));
      },
    }
  );

  const approveMutation = useMutation(approveUpgrade, { onSuccess: () => refetch() });
  const rejectMutation = useMutation(rejectUpgrade, { onSuccess: () => refetch() });

  const requests = (data as AxiosResponse<IApiResponse<IAdminUpgradeResponse[]>>)?.data?.data ?? [];

  const handleKeywordChange = (val: string) => {
    setKeyword(val);
    paginationForm.setValue('pageIndex', 1);
  };

  const handleStatusChange = (val: UPGRADE_STATUS | undefined) => {
    setStatusFilter(val);
    paginationForm.setValue('pageIndex', 1);
  };

  const detailAsUpgradeResponse = selectedRequest
    ? {
        id: selectedRequest.id,
        status: selectedRequest.status,
        isCreatedAt: selectedRequest.isCreatedAt,
        entityName: selectedRequest.entityName,
        email: selectedRequest.email,
        organizationName: selectedRequest.organizationName,
        phone: selectedRequest.phone,
        address: selectedRequest.address,
        website: selectedRequest.website,
        taxCode: selectedRequest.taxCode,
        type: selectedRequest.type,
        description: selectedRequest.description,
      }
    : null;

  return (
    <div>
      <AdminSearchBar
        value={keyword}
        onChange={handleKeywordChange}
        placeholder="Tìm theo tên tổ chức, tên pháp nhân, email..."
      />

      <div className="mb-6 flex items-center gap-2 text-sm">
        {STATUS_OPTIONS.map(({ label, value }) => (
          <button
            key={String(value)}
            onClick={() => handleStatusChange(value)}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              statusFilter === value
                ? 'bg-yellow-300 text-black'
                : 'text-gray-600 hover:bg-yellow-50'
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Người nộp</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Tên tổ chức</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Loại</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ngày gửi</th>
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
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    Không có yêu cầu nào.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={req.userImage || STATIC_URLS.NO_AVATAR}
                            alt={req.userName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-800 truncate max-w-[120px]">{req.userName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell truncate max-w-[160px]">{req.organizationName}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${ORG_TYPE_COLORS[req.type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {ValueTextManager.OrganizationType.GetText(String(req.type)) ?? 'Khác'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs">{formatDate(req.isCreatedAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[req.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {ValueTextManager.UpgradeStatus.GetText(String(req.status)) ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="p-1.5 text-gray-400 hover:text-amber-500 transition-colors"
                          title="Xem chi tiết"
                        >
                          <FaEye className="w-3.5 h-3.5" />
                        </button>
                        {req.status === UPGRADE_STATUS.PENDING && (
                          <>
                            <button
                              onClick={() => setPendingApprove(req)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 transition-colors"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => setPendingReject(req)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                            >
                              Từ chối
                            </button>
                          </>
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

      {/* Detail modal */}
      <Popup
        modal
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)', zIndex: 500 }}
        contentStyle={UPGRADE_MODAL_STYLE}
        closeOnDocumentClick
        closeOnEscape
      >
        <button
          type="button"
          className="absolute top-3 right-3 z-20 p-1.5 bg-white/90 rounded-full hover:bg-gray-100 shadow-sm"
          onClick={() => setSelectedRequest(null)}
        >
          <IoClose size={18} />
        </button>
        {detailAsUpgradeResponse && (
          <UpgradeRequestDetail request={detailAsUpgradeResponse} />
        )}
      </Popup>

      {/* Approve confirmation */}
      <Alert
        show={!!pendingApprove}
        setShow={(show) => { if (!show) setPendingApprove(null); }}
        failed={false}
        title="Xác nhận duyệt yêu cầu"
        message={`Duyệt yêu cầu xác minh của "${pendingApprove?.organizationName}"? Tài khoản người dùng sẽ được nâng cấp lên Tổ chức.`}
        action={() => pendingApprove && approveMutation.mutateAsync(pendingApprove.id)}
        showCancel
      />

      {/* Reject confirmation */}
      <Alert
        show={!!pendingReject}
        setShow={(show) => { if (!show) setPendingReject(null); }}
        failed={true}
        title="Xác nhận từ chối yêu cầu"
        message={`Từ chối yêu cầu xác minh của "${pendingReject?.organizationName}"?`}
        action={() => pendingReject && rejectMutation.mutateAsync(pendingReject.id)}
        showCancel
      />
    </div>
  );
});

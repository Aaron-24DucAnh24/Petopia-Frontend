'use client';
import { useState } from 'react';
import { useQuery } from '@/src/utils/hooks';
import { QUERY_KEYS } from '@/src/utils/constants';
import { IApiResponse } from '@/src/interfaces/common';
import { IUpgradeResponse } from '@/src/interfaces/org';
import { getUpgradeRequests } from '@/src/services/user.api';
import { QueryProvider } from '../providers/QueryProvider';
import { ConfirmCloseModal } from '../ui/ConfirmCloseModal';
import { UserUpgradeForm } from './UserUpgradeForm';
import { UpgradeRequestDetailModal, UPGRADE_MODAL_STYLE } from './UpgradeRequestDetailModal';
import { UpgradeStatusBadge } from './UpgradeStatusBadge';
import { formatDate } from '@/src/helpers/formatDate';
import { FiPlusCircle } from 'react-icons/fi';

export const UpgradeRequestsPage = QueryProvider(() => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [requests, setRequests] = useState<IUpgradeResponse[]>([]);

  const { isLoading, refetch } = useQuery<IApiResponse<IUpgradeResponse[]>>(
    [QUERY_KEYS.GET_UPGRADE_REQUESTS],
    () => getUpgradeRequests(),
    {
      onSuccess: (res) => {
        setRequests(res.data.data ?? []);
      },
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="container max-w-3xl p-5 mx-auto shadow-2xl rounded-2xl mt-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-base font-semibold text-gray-700 uppercase tracking-widest">
          Đơn xác minh tổ chức
        </h2>
        <div className="flex-1 h-px bg-gray-200" />
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
        >
          <FiPlusCircle size={16} />
          Tạo đơn mới
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">Bạn chưa có đơn xác minh nào.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <button
              key={req.id}
              onClick={() => setSelectedRequestId(req.id)}
              className="w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">{req.organizationName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{req.entityName}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <UpgradeStatusBadge status={req.status} />
                  <span className="text-xs text-gray-400">{formatDate(req.isCreatedAt)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <ConfirmCloseModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        contentStyle={UPGRADE_MODAL_STYLE}
      >
        <UserUpgradeForm
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            refetch();
            setShowCreate(false);
          }}
        />
      </ConfirmCloseModal>

      <UpgradeRequestDetailModal
        requestId={selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        onSuccess={() => {
          refetch();
          setSelectedRequestId(null);
        }}
      />
    </div>
  );
});

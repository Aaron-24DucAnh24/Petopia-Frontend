'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IUpgradeResponse } from '@/src/interfaces/org';
import { ConfirmCloseModal } from '../ui/ConfirmCloseModal';
import { UserUpgradeForm } from './UserUpgradeForm';
import { UpgradeRequestDetailModal, UPGRADE_MODAL_STYLE } from './UpgradeRequestDetailModal';
import { UpgradeStatusBadge } from './UpgradeStatusBadge';
import { formatDate } from '@/src/helpers/formatDate';
import { AddButton } from '../ui/button/AddButton';

interface IUserUpgradeGridProps {
  initialData: IUpgradeResponse[];
}

export function UserUpgradeGrid({ initialData }: IUserUpgradeGridProps) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const handleSuccess = () => {
    setShowCreate(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-base font-semibold text-gray-700 uppercase tracking-widest">
          Đơn xác minh tổ chức
        </h2>
        <div className="flex-1 h-px bg-gray-200" />
        <AddButton onClick={() => setShowCreate(true)} title="Tạo đơn mới" />
      </div>

      {initialData.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">Bạn chưa có đơn xác minh nào.</p>
      ) : (
        <div className="space-y-3">
          {initialData.map((req) => (
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
          onSuccess={handleSuccess}
        />
      </ConfirmCloseModal>

      <UpgradeRequestDetailModal
        requestId={selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        onSuccess={() => {
          setSelectedRequestId(null);
          router.refresh();
        }}
      />
    </>
  );
}

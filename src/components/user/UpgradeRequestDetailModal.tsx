'use client';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import Popup from 'reactjs-popup';
import { useQuery, useMutation } from '@/src/utils/hooks';
import { QUERY_KEYS, UPGRADE_STATUS } from '@/src/utils/constants';
import { IApiResponse } from '@/src/interfaces/common';
import { IUpgradeResponse } from '@/src/interfaces/org';
import { getUpgradeRequestById, cancelUpgradeRequest } from '@/src/services/user.api';
import { UpgradeRequestDetail } from './UpgradeRequestDetail';
import { Alert } from '../ui/Alert';

interface IUpgradeRequestDetailModal {
  requestId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const UPGRADE_MODAL_STYLE: React.CSSProperties = {
  width: '90vw',
  maxWidth: '48rem',
  height: '88vh',
  position: 'relative',
};

function LoadingSkeleton() {
  return (
    <div className="w-full h-full flex flex-col rounded-2xl bg-yellow-100 p-5">
      <div className="h-6 w-48 bg-yellow-200 rounded animate-pulse mb-4" />
      <div className="flex-1 bg-gray-50 rounded-lg p-4 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function UpgradeRequestDetailModal({ requestId, onClose, onSuccess }: IUpgradeRequestDetailModal) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelError, setShowCancelError] = useState(false);

  const { data, isLoading } = useQuery<IApiResponse<IUpgradeResponse>>(
    [QUERY_KEYS.GET_UPGRADE_REQUEST_DETAIL, requestId],
    () => getUpgradeRequestById(requestId!),
    {
      enabled: !!requestId,
      refetchOnWindowFocus: false,
    }
  );

  const cancelMutation = useMutation<IApiResponse<boolean>, string>(
    cancelUpgradeRequest,
    {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
      onError: () => {
        setShowCancelError(true);
      },
    }
  );

  const request = data?.data.data;
  const isPending = request?.status === UPGRADE_STATUS.PENDING;

  return (
    <>
      <Popup
        modal
        open={!!requestId}
        onClose={onClose}
        overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)', zIndex: 500 }}
        contentStyle={UPGRADE_MODAL_STYLE}
        closeOnDocumentClick={!showCancelConfirm}
        closeOnEscape={!showCancelConfirm}
      >
        <button
          type="button"
          className="absolute top-3 right-3 z-20 p-1.5 bg-white/90 rounded-full hover:bg-gray-100 shadow-sm"
          onClick={onClose}
        >
          <IoClose size={18} />
        </button>
        {isLoading || !request ? (
          <LoadingSkeleton />
        ) : (
          <UpgradeRequestDetail
            request={request}
            onCancelRequest={isPending ? () => setShowCancelConfirm(true) : undefined}
          />
        )}
      </Popup>

      <Alert
        show={showCancelConfirm}
        setShow={setShowCancelConfirm}
        title="Xác nhận hủy yêu cầu"
        message="Bạn có chắc muốn hủy yêu cầu xác minh này không?"
        failed={true}
        showCancel={true}
        action={() => {
          if (requestId) cancelMutation.mutate(requestId);
        }}
      />

      <Alert
        show={showCancelError}
        setShow={setShowCancelError}
        title="Hủy yêu cầu thất bại"
        message="Đã xảy ra lỗi khi hủy yêu cầu. Vui lòng thử lại."
        failed={true}
      />
    </>
  );
}

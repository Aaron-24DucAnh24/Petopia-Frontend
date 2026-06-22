'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ISavedCardResponse, IVaultCardRequest } from '@/src/interfaces/payment';
import { IApiResponse } from '@/src/interfaces/common';
import { getSavedCards, vaultCard, deleteSavedCard } from '@/src/services/payment.api';
import { useQuery, useMutation } from '@/src/utils/hooks';
import { QUERY_KEYS } from '@/src/utils/constants';
import { QueryProvider } from '../providers/QueryProvider';
import { ConfirmCloseModal } from '../ui/ConfirmCloseModal';
import PaymentDropIn from '../payment/PaymentDropIn';
import { Alert } from '../ui/Alert';
import { AddButton } from '../ui/button/AddButton';
import { FaTrash, FaPlus } from 'react-icons/fa';

const MAX_CARDS = 5;

const CARD_BG_CLASSES = [
  'bg-slate-800',
  'bg-blue-900',
  'bg-violet-900',
  'bg-teal-800',
  'bg-stone-800',
];

const ADD_CARD_MODAL_STYLE: React.CSSProperties = {
  width: '90vw',
  maxWidth: '480px',
  borderRadius: '16px',
  background: 'white',
  padding: '28px 24px 24px',
};

export const UserCreditCardGrid = QueryProvider(() => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [nonce, setNonce] = useState('');
  const [pendingDeleteToken, setPendingDeleteToken] = useState<string | null>(null);
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertFail, setAlertFail] = useState(false);

  const { data, refetch, isLoading } = useQuery<IApiResponse<ISavedCardResponse[]>>(
    [QUERY_KEYS.GET_SAVED_CARDS],
    getSavedCards,
    { refetchOnWindowFocus: false }
  );

  const cards: ISavedCardResponse[] = data?.data.data ?? [];

  const vaultCardMutation = useMutation<IApiResponse<void>, IVaultCardRequest>(
    vaultCard,
    {
      onSuccess: () => {
        setNonce('');
        setShowAddModal(false);
        setAlertFail(false);
        setAlertMessage('Thêm thẻ thành công.');
        setAlertShow(true);
        refetch();
      },
      onError: () => {
        setNonce('');
        setAlertFail(true);
        setAlertMessage('Không thể lưu thẻ. Vui lòng thử lại.');
        setAlertShow(true);
      },
    }
  );

  const deleteCardMutation = useMutation<IApiResponse<void>, string>(
    deleteSavedCard,
    {
      onSuccess: () => {
        setAlertFail(false);
        setAlertMessage('Xóa thẻ thành công.');
        setAlertShow(true);
        refetch();
      },
      onError: () => {
        setAlertFail(true);
        setAlertMessage('Không thể xóa thẻ. Vui lòng thử lại.');
        setAlertShow(true);
      },
    }
  );

  useEffect(() => {
    if (!nonce) return;
    vaultCardMutation.mutate({ nonce });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce]);

  const handleOpenAddModal = () => {
    setModalKey(k => k + 1);
    setShowAddModal(true);
  };

  const isProcessing = vaultCardMutation.isLoading || deleteCardMutation.isLoading;

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-base font-semibold text-gray-700 uppercase tracking-widest">
          Thẻ ngân hàng
        </h2>
        <div className="flex-1 h-px bg-gray-200" />
        {cards.length < MAX_CARDS && (
          <AddButton onClick={handleOpenAddModal} title="Thêm thẻ" />
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-2xl min-h-[130px]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <div
              key={card.token}
              className={`relative rounded-2xl p-4 min-h-[130px] flex flex-col justify-between text-white ${CARD_BG_CLASSES[index % CARD_BG_CLASSES.length]}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt={card.cardType}
                      width={36}
                      height={22}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-7 h-5 bg-yellow-400 rounded-sm opacity-80" />
                  )}
                </div>
                <button
                  onClick={() => setPendingDeleteToken(card.token)}
                  disabled={isProcessing}
                  className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
                  title="Xóa thẻ"
                >
                  <FaTrash className="w-2.5 h-2.5 text-white/70" />
                </button>
              </div>

              <div>
                <p className="text-xs font-mono tracking-widest text-white/70 mb-2">
                  •••• •••• •••• {card.last4}
                </p>
                <div className="flex justify-between items-end">
                  <p className="text-xs font-medium text-white/90 uppercase truncate max-w-[65%]">
                    {card.cardholderName}
                  </p>
                  <p className="text-xs text-white/60">
                    {card.expirationMonth}/{card.expirationYear}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {cards.length < MAX_CARDS && (
            <button
              onClick={handleOpenAddModal}
              className="rounded-2xl border-2 border-dashed border-gray-200 min-h-[130px] flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-orange-300 hover:text-orange-400 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Thêm thẻ mới</span>
              <span className="text-xs text-gray-400">
                Còn {MAX_CARDS - cards.length} thẻ có thể thêm
              </span>
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 text-right mt-3">Tối đa {MAX_CARDS} thẻ</p>

      {/* Add card modal */}
      <ConfirmCloseModal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setNonce(''); }}
        contentStyle={ADD_CARD_MODAL_STYLE}
      >
        <h3 className="text-base font-semibold text-gray-700 mb-4">Thêm thẻ mới</h3>
        {vaultCardMutation.isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            <span className="ml-3 text-sm text-gray-500">Đang lưu thẻ...</span>
          </div>
        ) : (
          <PaymentDropIn key={modalKey} setNonce={setNonce} />
        )}
      </ConfirmCloseModal>

      {/* Delete confirmation */}
      <Alert
        show={!!pendingDeleteToken}
        setShow={(v) => { if (!v) setPendingDeleteToken(null); }}
        title="Xác nhận xóa thẻ"
        message="Bạn có chắc muốn xóa thẻ này không?"
        failed={true}
        showCancel={true}
        action={() => {
          if (pendingDeleteToken) deleteCardMutation.mutate(pendingDeleteToken);
          setPendingDeleteToken(null);
        }}
      />

      {/* Action result */}
      <Alert
        message={alertMessage}
        show={alertShow}
        setShow={setAlertShow}
        failed={alertFail}
        showCancel={false}
      />
    </>
  );
});

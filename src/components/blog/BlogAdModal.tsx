'use client';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@/src/utils/hooks';
import { QueryProvider } from '../providers/QueryProvider';
import { createPayment, getAdTypes, getSavedCards, vaultCard, deleteSavedCard } from '@/src/services/payment.api';
import { IApiResponse } from '@/src/interfaces/common';
import { ICreatePaymentRequest, IPaymentTypesResponse, ISavedCardResponse } from '@/src/interfaces/payment';
import { QUERY_KEYS } from '@/src/utils/constants';
import PaymentDropIn from '../payment/PaymentDropIn';
import SavedCardSelector from '../payment/SavedCardSelector';
import QueryButton from '../ui/button/QueryButton';
import { Alert } from '../ui/Alert';
import { AxiosResponse } from 'axios';

interface BlogAdModalProps {
  blogId: string;
  show: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export const BlogAdModal = QueryProvider(({ blogId, show, onClose, onPaymentSuccess }: BlogAdModalProps) => {
  const [paymentTypes, setPaymentTypes] = useState<IPaymentTypesResponse[]>([]);
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertFailed, setAlertFailed] = useState(false);
  const [selectedCardToken, setSelectedCardToken] = useState<string | null | undefined>(undefined);
  const [saveNewCard, setSaveNewCard] = useState(false);

  const paymentForm = useForm<ICreatePaymentRequest>({
    defaultValues: { blogId, advertisementId: '', nonce: undefined, paymentMethodToken: undefined },
  });

  useQuery<IApiResponse<IPaymentTypesResponse[]>>(
    [QUERY_KEYS.GET_AD_TYPES],
    () => getAdTypes(),
    {
      onSuccess: (data) => setPaymentTypes(data.data.data),
      onError: () => {
        setAlertFailed(true);
        setAlertMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
        setAlertShow(true);
      },
      refetchOnWindowFocus: false,
    }
  );

  const { data: savedCardsData, refetch: refetchCards } = useQuery<IApiResponse<ISavedCardResponse[]>>(
    [QUERY_KEYS.GET_SAVED_CARDS],
    () => getSavedCards(),
    {
      onSuccess: (res: AxiosResponse<IApiResponse<ISavedCardResponse[]>>) => {
        const cards = res.data.data ?? [];
        if (cards.length > 0 && selectedCardToken === undefined) {
          setSelectedCardToken(cards[0].token);
        } else if (cards.length === 0) {
          setSelectedCardToken(null);
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const savedCards = (savedCardsData as AxiosResponse<IApiResponse<ISavedCardResponse[]>>)?.data?.data ?? [];

  const vaultCardMutation = useMutation(vaultCard, {
    onSuccess: () => refetchCards(),
    onError: () => {
      setAlertMessage('Không thể lưu thẻ. Vui lòng thử lại.');
      setAlertFailed(true);
      setAlertShow(true);
    },
  });

  const deleteCardMutation = useMutation(deleteSavedCard, {
    onSuccess: () => {
      refetchCards();
      setSelectedCardToken(null);
    },
    onError: () => {
      setAlertMessage('Không thể xóa thẻ.');
      setAlertFailed(true);
      setAlertShow(true);
    },
  });

  const createPaymentMutation = useMutation<IApiResponse<boolean>, ICreatePaymentRequest>(
    createPayment,
    {
      onError: () => {
        paymentForm.setValue('nonce', undefined);
        paymentForm.setValue('paymentMethodToken', undefined);
        setAlertMessage('Thanh toán thất bại.');
        setAlertFailed(true);
        setAlertShow(true);
      },
      onSuccess: () => {
        onPaymentSuccess?.();
        setAlertMessage('Thanh toán thành công. Xem hoá đơn được gửi qua email.');
        setAlertFailed(false);
        setAlertShow(true);
      },
    }
  );

  const selectedId = paymentForm.watch('advertisementId');
  const nonce = paymentForm.watch('nonce');
  const usingSavedCard = selectedCardToken !== null && selectedCardToken !== undefined;
  const showPayBtn = !!selectedId && (usingSavedCard || !!nonce);

  const handlePay = async () => {
    if (usingSavedCard) {
      createPaymentMutation.mutate({
        blogId,
        advertisementId: paymentForm.getValues('advertisementId'),
        paymentMethodToken: selectedCardToken!,
      });
    } else {
      const currentNonce = paymentForm.getValues('nonce');
      if (saveNewCard && currentNonce && savedCards.length < 5) {
        try {
          const result = await vaultCardMutation.mutateAsync({ nonce: currentNonce });
          const vaultedToken = (result as AxiosResponse<IApiResponse<ISavedCardResponse>>).data.data.token;
          createPaymentMutation.mutate({
            blogId,
            advertisementId: paymentForm.getValues('advertisementId'),
            paymentMethodToken: vaultedToken,
          });
        } catch {
          // Vault failed — vaultCardMutation.onError already surfaces the error;
          // do not attempt payment with the now-consumed nonce.
        }
      } else {
        createPaymentMutation.mutate(paymentForm.getValues());
      }
    }
  };

  return (
    <Popup
      open={show}
      modal
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}
      onClose={onClose}
    >
      <div className="container max-w-xs md:max-w-4xl rounded-2xl bg-white p-6 overflow-auto max-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quảng cáo bài viết</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <p className="mb-6 text-gray-500 text-sm text-center">
          Hãy để bài viết của bạn được mọi người trên Petopia biết đến nhiều hơn với dịch vụ quảng cáo của chúng tôi.
        </p>

        <div className="space-y-4 lg:grid lg:grid-cols-4 sm:gap-4 xl:gap-6 lg:space-y-0 mb-6">
          {paymentTypes.map((pt, index) => (
            <div
              key={pt.id}
              test-id={`payment-type-${index}`}
              className={`flex flex-col p-4 mx-auto max-w-lg text-center text-gray-900 rounded-lg border shadow hover:bg-gray-100 cursor-pointer ${selectedId === pt.id ? 'border-yellow-400 bg-gray-100' : 'border-gray-200'}`}
              onClick={() => paymentForm.setValue('advertisementId', pt.id)}
            >
              <h3 className="mb-2 text-xl font-semibold">{pt.monthDuration} tháng</h3>
              <p className="font-light text-gray-500 sm:text-sm h-8">{pt.description}</p>
              <div className="flex justify-center items-baseline my-4">
                <span className="text-2xl font-extrabold">
                  {pt.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND
                </span>
              </div>
            </div>
          ))}
        </div>

        {savedCards.length > 0 && (
          <SavedCardSelector
            cards={savedCards}
            selectedToken={selectedCardToken ?? null}
            onSelect={(token) => {
              setSelectedCardToken(token);
              if (token) {
                paymentForm.setValue('nonce', undefined);
              }
            }}
            onDelete={(token) => deleteCardMutation.mutate(token)}
            isDeleting={deleteCardMutation.isLoading}
          />
        )}

        {(selectedCardToken === null || savedCards.length === 0) && (
          <>
            <PaymentDropIn setNonce={(nonce) => paymentForm.setValue('nonce', nonce)} />
            {savedCards.length < 5 && (
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveNewCard}
                  onChange={(e) => setSaveNewCard(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                />
                <span className="text-sm text-gray-600">Lưu thẻ cho lần sau</span>
              </label>
            )}
          </>
        )}

        {showPayBtn && (
          <div className="flex justify-center mt-6">
            <div className="w-48">
              <QueryButton
                name="Thanh toán"
                isLoading={createPaymentMutation.isLoading || vaultCardMutation.isLoading}
                action={handlePay}
              />
            </div>
          </div>
        )}

        <Alert
          message={alertMessage}
          show={alertShow}
          setShow={setAlertShow}
          failed={alertFailed}
          action={alertFailed ? () => setAlertShow(false) : onClose}
          showCancel={false}
        />
      </div>
    </Popup>
  );
});

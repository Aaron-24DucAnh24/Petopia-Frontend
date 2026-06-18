'use client';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@/src/utils/hooks';
import { QueryProvider } from '../providers/QueryProvider';
import { createPayment, getAdTypes } from '@/src/services/payment.api';
import { IApiResponse } from '@/src/interfaces/common';
import { ICreatePaymentRequest, IPaymentTypesResponse } from '@/src/interfaces/payment';
import { QUERY_KEYS } from '@/src/utils/constants';
import PaymentDropIn from '../payment/PaymentDropIn';
import QueryButton from '../ui/button/QueryButton';
import { Alert } from '../ui/Alert';

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

  const paymentForm = useForm<ICreatePaymentRequest>({
    defaultValues: { blogId, advertisementId: '', nonce: '' },
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

  const createPaymentMutation = useMutation<IApiResponse<boolean>, ICreatePaymentRequest>(
    createPayment,
    {
      onError: () => {
        paymentForm.setValue('nonce', '');
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
  const showBtn = !!nonce && !!selectedId;

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

        <PaymentDropIn setNonce={(nonce) => paymentForm.setValue('nonce', nonce)} />

        {showBtn && (
          <div className="flex justify-center mt-6">
            <div className="w-48">
              <QueryButton
                name="Thanh toán"
                isLoading={createPaymentMutation.isLoading}
                action={() => createPaymentMutation.mutate(paymentForm.getValues())}
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

'use client';

import { Alert } from '@/src/components/common/general/Alert';
import { QueryProvider } from '@/src/components/common/provider/QueryProvider';
import { getErrorMessage } from '@/src/helpers/getErrorMessage';
import { IApiResponse } from '@/src/interfaces/common';
import { forgotPassword } from '@/src/services/user.api';
import { useMutation } from '@/src/utils/hooks';
import { StringUtil } from '@/src/utils/StringUtil';
import { FormEvent, useState } from 'react';

const ForgotPasswordPage = QueryProvider(() => {
  // States
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [alertShow, setAlertShow] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertFailed, setAlertFailed] = useState<boolean>(false);

  // Queries
  const forgotPasswordMutation = useMutation<IApiResponse<boolean>, string>(
    forgotPassword,
    {
      onError: (error) => {
        setAlertMessage(getErrorMessage(error.data.errorCode.toString()));
        setAlertFailed(true);
        setAlertShow(true);
      },
      onSuccess: () => {
        setAlertMessage('Kiểm tra email của bạn để đặt lại mật khẩu');
        setAlertFailed(false);
        setAlertShow(true);
      },
    }
  );

  // Handlers
  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!StringUtil.IsEmail(email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    forgotPasswordMutation.mutate(email);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-yellow-300">
      <div className="max-w-lg bg-white p-5 rounded-lg shadow-lg">
        <h1 className="font-bold text-lg text-center my-4">
          Hãy nhập email của bạn để đặt lại mật khẩu!
        </h1>
        <form className="flex justify-center w-full" onSubmit={handleOnSubmit}>
          <input
            className="bg-gray-50 border border-gray-300 flex-1 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-2/3 p-2.5 :bg-gray-700 "
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required />
          <button
            className="border border-black p-3 rounded-lg font-bold shadow-md bg-yellow-300 hover:bg-yellow-400 ml-2"
            type='submit'>
            Xác nhận
          </button>
        </form>
        <span className='text-sm text-red-500 mt-2'>{error}</span>
      </div>
      <Alert
        message={alertMessage}
        show={alertShow}
        setShow={setAlertShow}
        failed={alertFailed} />
    </div>
  );
});

export default ForgotPasswordPage;
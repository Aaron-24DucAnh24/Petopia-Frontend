'use client';
import { IApiResponse } from '@/src/interfaces/common';
import { IChangePasswordRequest } from '@/src/interfaces/user';
import { changePassword } from '@/src/services/user.api';
import { useMutation } from '@/src/utils/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getErrorMessage } from '@/src/helpers/getErrorMessage';
import { QueryProvider } from '@/src/components/common/provider/QueryProvider';
import { Alert } from '@/src/components/common/general/Alert';
import QueryButton from '@/src/components/common/button/QueryButton';
import { StringUtil } from '@/src/utils/StringUtil';

const page = QueryProvider(() => {
  // STATES
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertFailed, setAlertFailed] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // FORMS
  const { getValues, setValue } = useForm<IChangePasswordRequest>({
    defaultValues: {
      newPassword: '',
      oldPassword: '',
    },
  });

  // HANDLERS
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!StringUtil.IsPassword(getValues().newPassword)) {
      setError('Vui lòng nhập mật khẩu tổi thiểu 8 ký tự');
      return;
    }
    changePasswordMutation.mutate(getValues());
  };

  const handleCloseAlert = () => {
    !alertFailed && window.location.replace('/user');
  };

  // QUERIES
  const changePasswordMutation = useMutation<
    IApiResponse<boolean>,
    IChangePasswordRequest>(changePassword, {
      onError: (err) => {
        const message = getErrorMessage(err.data.errorCode.toString());
        setAlertFailed(true);
        setAlertMessage(message);
        setShowAlert(true);
      },
      onSuccess: () => {
        setShowAlert(true);
        setAlertFailed(false);
        setAlertMessage('Đổi mật khẩu thành công');
        setShowAlert(true);
      },
    });

  return (
    <div className="flex flex-col items-center justify-center h-fit-screen">
      <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div>
            <h2 className="">
              <span className="text-yellow-300 font-bold">Pet</span>opia xin
              chào
            </h2>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl ">
              Đổi mật khẩu
            </h1>
          </div>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="old-password"
                className="block mb-2 w-fit block mb-2 text-sm font-medium text-gray-900  ">
                Mật khẩu cũ
              </label>
              <input
                type="password"
                id="old-password"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                onChange={(e) => {
                  setValue('oldPassword', e.target.value);
                }}
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block mb-2 w-fit block mb-2 text-sm font-medium text-gray-900  ">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="new-password"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                onChange={(e) => {
                  setValue('newPassword', e.target.value);
                }} />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <QueryButton
              name={'Đổi mật khẩu'}
              isLoading={changePasswordMutation.isLoading} />
          </form>
        </div>
      </div>
      <Alert
        message={alertMessage}
        show={showAlert}
        setShow={setShowAlert}
        failed={alertFailed}
        action={handleCloseAlert} />
    </div>
  );
});

export default page;

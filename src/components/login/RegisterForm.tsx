'use client';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from '../general/Alert';
import { GoogleRecaptcha } from './GoogleRecaptcha';
import { QueryProvider } from '../general/QueryProvider';
import { IRegisterForm, IRegisterRequest } from '@/src/interfaces/authentication';
import { useMutation } from '@/src/utils/hooks';
import { register } from '@/src/services/authentication.api';
import { IApiResponse } from '@/src/interfaces/common';
import { getErrorMessage } from '@/src/helpers/getErrorMessage';
import { publish } from '@/src/services/event';
import { EVENT_NAMES } from '@/src/utils/constants';
import { DatePicker } from '../general/DatePicker';
import { ValidatorManager } from '@/src/utils/ValidatorManager';
import QueryButton from '../general/QueryButton';

export default QueryProvider(() => {
  // STATES
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertFailed, setAlertFailed] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // REGISTER FORM
  const { getValues, setValue, watch } = useForm<IRegisterForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      googleRecaptchaToken: '',
      birthDate: null,
    },
  });

  // HANDLERS
  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validatingResult = ValidatorManager.userRegisterValidator.validate(getValues());
    setErrors(validatingResult.errors);

    if (validatingResult.isValid) {
      registerMutation.mutate(getValues());
    }
  };

  // REGISTER MUTATION
  const registerMutation = useMutation<IApiResponse<boolean>, IRegisterRequest>(
    register,
    {
      onError: (err) => {
        const message = getErrorMessage(err.data.errorCode.toString());
        setAlertFailed(true);
        setAlertMessage(message);
        setShowAlert(true);
        publish(EVENT_NAMES.RESET_RECAPTCHA);
      },
      onSuccess: () => {
        setShowAlert(true);
        setAlertFailed(false);
        setAlertMessage('Kiểm tra Email của bạn để hoàn thành đăng ký.');
        setShowAlert(true);
      }
    }
  );

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-white rounded-lg shadow w-full sm:max-w-xl h-[90%] overflow-auto">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-full">
          <div className="flex justify-between">
            <div>
              <h2 className="">
                <span className="text-yellow-300 font-bold">Pet</span>opia xin chào
              </h2>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl ">
                Đăng ký
              </h1>
            </div>
            <div>
              <p>Đã có tài khoản?</p>
              <Link className="text-yellow-600" href="/login">
                Đăng nhập
              </Link>
            </div>
          </div>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="text"
                className="block mb-2 text-sm font-medium text-gray-900 ">
                Họ
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                type="text"
                id="lastName"
                onChange={(e) => setValue('lastName', e.target.value)} />
              <span className="text-sm text-red-500 mt-2">{errors['lastName']}</span>
            </div>

            <div>
              <label
                htmlFor="text"
                className="block mb-2 text-sm font-medium text-gray-900 ">
                Tên
              </label>
              <input
                type="text"
                id="firstName"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                onChange={(e) => setValue('firstName', e.target.value)} />
              <span className="text-sm text-red-500 mt-2">{errors['firstName']}</span>
            </div>

            <div>
              <label
                htmlFor="text"
                className="block mb-2 text-sm font-medium text-gray-900 ">
                Ngày sinh
              </label>
              <DatePicker
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5"
                value={watch('birthDate')}
                onChange={(date) => setValue('birthDate', date)} />
              <span className="text-sm text-red-500 mt-2">{errors['birthDate']}</span>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 ">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                onChange={(e) => setValue('email', e.target.value)} />
              <span className="text-sm text-red-500 mt-2">{errors['email']}</span>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 ">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                onChange={(e) => setValue('password', e.target.value)} />
              <span className="text-sm text-red-500 mt-2">{errors['password']}</span>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 ">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                onChange={(e) => setValue('confirmPassword', e.target.value)} />
              <span className="text-sm text-red-500 mt-2">{errors['confirmPassword']}</span>
            </div>

            <GoogleRecaptcha setToken={(value) => setValue('googleRecaptchaToken', value)} />

            <QueryButton
              name={'Đăng ký'}
              isLoading={registerMutation.isLoading} />
          </form>
        </div>
      </div>
      <Alert
        message={alertMessage}
        show={showAlert}
        setShow={setShowAlert}
        failed={alertFailed} />
    </div>
  );
});

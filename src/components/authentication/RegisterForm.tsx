'use client';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from '../common/general/Alert';
import { GoogleRecaptcha } from './GoogleRecaptcha';
import { QueryProvider } from '../common/provider/QueryProvider';
import { IRegisterForm, IRegisterRequest } from '@/src/interfaces/authentication';
import { useMutation } from '@/src/utils/hooks';
import { register } from '@/src/services/authentication.api';
import { IApiResponse } from '@/src/interfaces/common';
import { getErrorMessage } from '@/src/helpers/getErrorMessage';
import { publish } from '@/src/services/event';
import { EVENT_NAMES } from '@/src/utils/constants';
import { DatePicker } from '../common/input/DatePicker';
import { ValidatorManager } from '@/src/utils/ValidatorManager';
import QueryButton from '../common/button/QueryButton';
import { Input } from '../common/input/Input';

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
                htmlFor="inputLastName"
                className="w-fit block mb-2 text-sm font-medium text-gray-900  ">
                Họ
              </label>
              <Input
                id='inputLastName'
                containerClassName='col-span-2'
                onChange={(value) => setValue('lastName', value)}
                value={watch('lastName')}
                error={errors['lastName']} />
            </div>

            <div>
              <label
                htmlFor="text"
                className="w-fit block mb-2 text-sm font-medium text-gray-900  ">
                Tên
              </label>
              <Input
                id='inputFirstName'
                containerClassName='col-span-2'
                onChange={(value) => setValue('firstName', value)}
                value={watch('firstName')}
                error={errors['firstName']} />
            </div>

            <div>
              <label
                htmlFor="dpBirthDate"
                className="w-fit block mb-2 text-sm font-medium text-gray-900  ">
                Ngày sinh
              </label>
              <DatePicker
                id='dpBirthDate'
                value={watch('birthDate')}
                onChange={(date) => setValue('birthDate', date)} />
              <span className="text-sm text-red-500 mt-2">{errors['birthDate']}</span>
            </div>

            <div>
              <label
                htmlFor="inputEmail"
                className="w-fit block mb-2 text-sm font-medium text-gray-900  ">
                Email
              </label>
              <Input
                id='inputEmail'
                containerClassName='col-span-2'
                onChange={(value) => setValue('email', value)}
                value={watch('email')}
                error={errors['email']} />
            </div>

            <div>
              <label
                htmlFor="inputPassword"
                className="w-fit block mb-2 text-sm font-medium text-gray-900  ">
                Mật khẩu
              </label>
              <Input
                id='inputPassword'
                type='password'
                containerClassName='col-span-2'
                onChange={(value) => setValue('password', value)}
                value={watch('password')}
                error={errors['password']} />
            </div>

            <div>
              <label
                htmlFor="inputConfirmPassword"
                className="w-fit block mb-2 text-sm font-medium text-gray-900  ">
                Nhập lại mật khẩu
              </label>
              <Input
                id='inputConfirmPassword'
                type='password'
                containerClassName='col-span-2'
                onChange={(value) => setValue('confirmPassword', value)}
                value={watch('confirmPassword')}
                error={errors['confirmPassword']} />
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

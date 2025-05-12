import { useForm } from 'react-hook-form';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { useMutation, useQuery } from '../../utils/hooks';
import { IApiResponse } from '../../interfaces/common';
import { updateUser } from '../../services/user.api';
import { Alert } from '../common/general/Alert';
import QueryButton from '../common/button/QueryButton';
import { IUserInfoReponse, IUserUpdate } from '@/src/interfaces/user';
import { getErrorMessage } from '@/src/helpers/getErrorMessage';
import Button from '../common/button/Button';
import { ILocationRequest, ILocationResponse } from '@/src/interfaces/pet';
import { LOCATION_LEVEL, ORG_TYPE, PET_ORG_TYPE_OPTION, QUERY_KEYS, USER_ROLE } from '@/src/utils/constants';
import { getProvince } from '@/src/services/pet.api';
import { AddressInput } from './AddressInput';
import { useStores } from '@/src/stores';
import { DatePicker } from '../common/input/DatePicker';
import { ValidatorManager } from '@/src/utils/ValidatorManager';
import { ValueText } from '@/src/utils/ValueText';
import { SelectInput } from '../common/input/SelectInput';
import { Input } from '../common/input/Input';

interface IUserUpdateForm {
  userInfo: IUserInfoReponse;
  show: boolean;
  onSuccess: () => void;
  setShowEdit: Dispatch<SetStateAction<boolean>>,
}

export const UserUpdateForm = (props: IUserUpdateForm) => {
  const {
    userInfo,
    show,
    onSuccess,
    setShowEdit,
  } = props;

  // STATES
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertShow, setAlertShow] = useState<boolean>(false);
  const [alertFail, setAlertFail] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<ILocationResponse[]>([]);
  const [districts, setDistricts] = useState<ILocationResponse[]>([]);
  const [wards, setWards] = useState<ILocationResponse[]>([]);
  const { userStore } = useStores();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // FORMS
  const {
    getValues,
    setValue,
    watch,
    formState: { isDirty },
    reset } = useForm<IUserUpdate>({
      defaultValues: {
        phone: userInfo?.phone || '',
        provinceCode: userInfo?.provinceCode || '',
        districtCode: userInfo?.districtCode || '',
        lastName: userInfo?.attributes.lastName || '',
        firstName: userInfo?.attributes.firstName || '',
        website: userInfo?.attributes.website || '',
        description: userInfo?.attributes.description || '',
        wardCode: userInfo?.wardCode || '',
        street: userInfo?.street || '',
        birthDate: userInfo?.birthDate || new Date(),
        organizationName: userInfo?.attributes.organizationName || '',
        type: userInfo?.attributes.type || ORG_TYPE.OTHER,
      },
    });

  const locationForm = useForm<ILocationRequest>({
    defaultValues: { Level: LOCATION_LEVEL.PROVINCE },
  });

  const updateUserMutation = useMutation<IApiResponse<IUserInfoReponse>, IUserUpdate>(
    updateUser,
    {
      onError: (err) => {
        setAlertMessage(getErrorMessage(err.data.errorCode.toString()));
        setAlertFail(true);
        setAlertShow(true);
      },
      onSuccess: async () => {
        setAlertMessage('Cập nhật thông tin thành công');
        setAlertFail(false);
        setAlertShow(true);
        reset(getValues());
        onSuccess();
        await userStore.fetchUserContext();
      },
    });

  const locationQuery = useQuery<IApiResponse<ILocationResponse[]>>(
    [
      QUERY_KEYS.GET_LOCATION,
      locationForm.watch('Code'),
      locationForm.watch('Level'),
    ],
    () => getProvince(locationForm.getValues()),
    {
      onSuccess: (res) => {
        switch (locationForm.getValues('Level')) {
          case LOCATION_LEVEL.PROVINCE:
            setProvinces(res.data.data);
            if (watch('provinceCode')) {
              locationForm.setValue('Code', watch('provinceCode'));
              locationForm.setValue('Level', LOCATION_LEVEL.DISTRICT);
            }
            break;
          case LOCATION_LEVEL.DISTRICT:
            setDistricts(res.data.data);
            setWards([]);
            if (watch('districtCode')) {
              locationForm.setValue('Code', watch('districtCode'));
              locationForm.setValue('Level', LOCATION_LEVEL.WARD);
            }
            break;
          case LOCATION_LEVEL.WARD:
            setWards(res.data.data);
            break;
        }
      },
      refetchOnWindowFocus: false,
      enabled: show,
    }
  );

  // HANDLERS
  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    if (locationQuery.isLoading) return;
    event.preventDefault();

    console.log(getValues());

    const validatingResult = userInfo.role === USER_ROLE.ORGANIZATION
      ? ValidatorManager.userUpdateOrganizationValidator.validate(getValues())
      : ValidatorManager.userUpdateIndividualValidator.validate(getValues());
    setErrors(validatingResult.errors);

    if (validatingResult.isValid) {
      updateUserMutation.mutateAsync(getValues());
    }
  };

  const handleLocationChange = (level: LOCATION_LEVEL, code: string) => {
    switch (level) {
      case LOCATION_LEVEL.PROVINCE:
        if (code != getValues('provinceCode')) {
          setValue('provinceCode', code, { shouldDirty: true });
          setValue('districtCode', '', { shouldDirty: true });
          setValue('wardCode', '', { shouldDirty: true });
          locationForm.setValue('Code', code);
          locationForm.setValue('Level', LOCATION_LEVEL.DISTRICT);
        }
        break;
      case LOCATION_LEVEL.DISTRICT:
        if (code != getValues('districtCode')) {
          setValue('districtCode', code, { shouldDirty: true });
          setValue('wardCode', '', { shouldDirty: true });
          locationForm.setValue('Code', code);
          locationForm.setValue('Level', LOCATION_LEVEL.WARD);
        }
        break;
      case LOCATION_LEVEL.WARD:
        if (code != getValues('wardCode')) {
          setValue('wardCode', code, { shouldDirty: true });
        }
        break;
    }
  };

  if (!show) return <></>;

  return (
    <>
      <form
        className="md:px-5 md:py-2 border w-full rounded-xl divide-y-2"
        onSubmit={handleSubmit}>
        {
          userInfo.role === USER_ROLE.ORGANIZATION
            ? (
              <>
                <div className='grid grid-cols-3 py-2'>
                  <label className="text-gray-500 text-md flex items-center">
                    Tên tổ chức:
                  </label>
                  <Input
                    id='inputOrganizationName'
                    containerClassName='col-span-2 flex flex-row'
                    onChange={(value) => setValue('organizationName', value, { shouldDirty: true })}
                    value={watch('organizationName')}
                    error={errors['organizationName']} />
                </div>

                <div className='grid grid-cols-3 py-2'>
                  <label className="text-gray-500 text-md flex items-center">
                    Loại hình:
                  </label>
                  <div className='col-span-2'>
                    <SelectInput
                      onChange={(value) => setValue('type', parseInt(value), { shouldDirty: true })}
                      options={new ValueText(PET_ORG_TYPE_OPTION.map(option => ({ value: option.value.toString(), text: option.label })))}
                      defaultValue={watch('type').toString()} />
                    <span className="text-sm text-red-500 mt-2">{errors['type']}</span>
                  </div>
                </div>

                <div className='grid grid-cols-3 py-2'>
                  <label className="text-gray-500 text-md flex items-center">
                    Mô tả:
                  </label>
                  <div className='col-span-2'>
                    <textarea
                      className="border-gray-300 border-2 bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-yellow-400 focus:outline-none focus:ring-0 focus:bg-white min-h-[80px]"
                      test-id="user-profile-org-desc"
                      id="orgDesc"
                      value={watch('description')}
                      onChange={(e) => {
                        setValue('description', e.target.value, { shouldDirty: true });
                      }} />
                    <span className="text-sm text-red-500 mt-2">{errors['description']}</span>
                  </div>
                </div>

                <div className='grid grid-cols-3 py-2'>
                  <label className="text-gray-500 text-md flex items-center">
                    Website:
                  </label>
                  <Input
                    id='inputWebsite'
                    containerClassName='col-span-2 flex flex-row'
                    onChange={(value) => setValue('website', value, { shouldDirty: true })}
                    value={watch('website')}
                    error={errors['website']} />
                </div>
              </>
            )
            : (
              <>
                <div className='grid grid-cols-3 py-2'>
                  <label className="text-gray-500 text-md flex items-center">
                    Họ:
                  </label>
                  <Input
                    id='inputFirstName'
                    containerClassName='col-span-2 flex flex-row'
                    onChange={(value) => setValue('firstName', value, { shouldDirty: true })}
                    value={watch('firstName')}
                    error={errors['firstName']} />
                </div>


                <div className='grid grid-cols-3 py-2'>
                  <label className="text-gray-500 text-md flex items-center">
                    Tên:
                  </label>
                  <Input
                    id='inputLastName'
                    containerClassName='col-span-2 flex flex-row'
                    onChange={(value) => setValue('lastName', value, { shouldDirty: true })}
                    value={watch('lastName')}
                    error={errors['lastName']} />
                </div>


                <div className='grid grid-cols-3 py-2'>
                  <label className="text-gray-500 text-md flex items-center">
                    Ngày sinh:
                  </label>
                  <div className='col-span-2'>
                    <DatePicker
                      id='dpBirthDate'
                      value={watch('birthDate')}
                      onChange={(date) => date && setValue('birthDate', date, { shouldDirty: true })} />
                    <span className="text-sm text-red-500 mt-2">{errors['birthDate']}</span>
                  </div>
                </div>
              </>
            )
        }

        <div className='grid grid-cols-3 py-2'>
          <label className="text-gray-500 text-md flex items-center">
            Số điện thoại:
          </label>
          <Input
            id='inputPhone'
            type='tel'
            containerClassName='col-span-2 flex flex-row'
            onChange={(value) => setValue('phone', value, { shouldDirty: true })}
            value={watch('phone')}
            error={errors['phone']} />
        </div>


        <div className='grid grid-cols-3 py-2'>
          <label className="text-gray-500 text-md flex items-center">
            Tỉnh/thành phố:
          </label>
          <div className="col-span-2">
            <AddressInput
              testId="province-input-dropdown"
              options={new ValueText(provinces.map(province => ({ text: province.name, value: province.code })))}
              onChange={handleLocationChange}
              value={watch('provinceCode')}
              level={LOCATION_LEVEL.PROVINCE}
              isLoading={locationQuery.isLoading} />
            <span className="text-sm text-red-500 mt-2">{errors['provinceCode']}</span>
          </div>
        </div>


        <div className='grid grid-cols-3 py-2'>
          <label className="text-gray-500 text-md flex items-center">
            Quận/huyện:
          </label>
          <div className="col-span-2">
            <AddressInput
              testId="district-input-dropdown"
              options={new ValueText(districts.map(district => ({ text: district.name, value: district.code })))}
              onChange={handleLocationChange}
              value={watch('districtCode')}
              level={LOCATION_LEVEL.DISTRICT}
              isLoading={locationQuery.isLoading} />
            <span className="text-sm text-red-500 mt-2">{errors['districtCode']}</span>
          </div>
        </div>


        <div className='grid grid-cols-3 py-2'>
          <label className="text-gray-500 text-md flex items-center">
            Xã/phường:
          </label>
          <div className="col-span-2">
            <AddressInput
              testId="ward-input-dropdown"
              options={new ValueText(wards.map(ward => ({ text: ward.name, value: ward.code })))}
              onChange={handleLocationChange}
              value={watch('wardCode')}
              level={LOCATION_LEVEL.WARD}
              isLoading={locationQuery.isLoading} />
            <span className="text-sm text-red-500 mt-2">{errors['wardCode']}</span>
          </div>
        </div>

        <div className='grid grid-cols-3 py-2'>
          <label className="text-gray-500 text-md flex items-center">
            Địa chỉ chi tiết:
          </label>
          <Input
            id='inputStreet'
            containerClassName='col-span-2 flex flex-row'
            onChange={(value) => setValue('street', value, { shouldDirty: true })}
            value={watch('street')}
            error={errors['street']} />
        </div>


        <div className="flex justify-center border-none mt-2 space-x-2">
          <QueryButton
            testId="user-update-button"
            name={'Xác nhận'}
            isLoading={updateUserMutation.isLoading || locationQuery.isLoading}
            isDisabled={!isDirty} />
          <Button
            name={'Huỷ'}
            action={() => setShowEdit(false)} />
        </div>
      </form>

      <Alert
        message={alertMessage}
        show={alertShow}
        setShow={setAlertShow}
        failed={alertFail}
        action={() => !alertFail && setShowEdit(false)}
        showCancel={false} />
    </>
  );
};

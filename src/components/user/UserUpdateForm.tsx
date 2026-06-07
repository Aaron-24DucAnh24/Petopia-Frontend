'use client';
import { useForm } from 'react-hook-form';
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { useMutation, useQuery } from '../../utils/hooks';
import { IApiResponse } from '../../interfaces/common';
import { updateUser } from '../../services/user.api';
import { Alert } from '../ui/Alert';
import QueryButton from '../ui/button/QueryButton';
import { IUserInfoResponse, IUserUpdate } from '@/src/interfaces/user';
import { getErrorMessage } from '@/src/helpers/getErrorMessage';
import Button from '../ui/button/Button';
import { ILocationRequest, ILocationResponse } from '@/src/interfaces/pet';
import { LOCATION_LEVEL, ORG_TYPE, PET_ORG_TYPE_OPTION, QUERY_KEYS, USER_ROLE } from '@/src/utils/constants';
import { getProvince } from '@/src/services/pet.api';
import { UserAddressInput } from './UserAddressInput';
import { useStores } from '@/src/stores';
import { DatePicker } from '../ui/input/DatePicker';
import { ValidatorManager } from '@/src/utils/ValidatorManager';
import { ValueText } from '@/src/utils/ValueText';
import { SelectInput } from '../ui/input/SelectInput';
import { Input } from '../ui/input/Input';
import { HTMLArea } from '../ui/input/HTMLArea';
import { FiUser, FiCalendar, FiPhone, FiMapPin, FiLink, FiBriefcase, FiTag, FiAlignLeft } from 'react-icons/fi';

function FieldRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="mt-1 w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide leading-none mb-2">{label}</p>
        {children}
      </div>
    </div>
  );
}

interface IUserUpdateForm {
  userInfo: IUserInfoResponse;
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

  const updateUserMutation = useMutation<IApiResponse<IUserInfoResponse>, IUserUpdate>(
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
        className="w-full rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-100"
        onSubmit={handleSubmit}>

        {userInfo.role === USER_ROLE.ORGANIZATION ? (
          <>
            <FieldRow icon={<FiBriefcase size={16} />} label="Tên tổ chức">
              <Input
                id='inputOrganizationName'
                onChange={(value) => setValue('organizationName', value, { shouldDirty: true })}
                value={watch('organizationName')}
                error={errors['organizationName']} />
            </FieldRow>

            <FieldRow icon={<FiTag size={16} />} label="Loại hình">
              <SelectInput
                id='inputOrganizationType'
                onChange={(value) => setValue('type', parseInt(value), { shouldDirty: true })}
                options={new ValueText(PET_ORG_TYPE_OPTION.map(option => ({ value: option.value.toString(), text: option.label })))}
                defaultValue={watch('type').toString()} />
              <span className="text-sm text-red-500 mt-1">{errors['type']}</span>
            </FieldRow>

            <FieldRow icon={<FiAlignLeft size={16} />} label="Mô tả">
              <HTMLArea
                id='inputDescription'
                value={watch('description')}
                setValue={(html) => setValue('description', html, { shouldDirty: true })} />
              <span className="text-sm text-red-500 mt-1">{errors['description']}</span>
            </FieldRow>

            <FieldRow icon={<FiLink size={16} />} label="Website">
              <Input
                id='inputWebsite'
                onChange={(value) => setValue('website', value, { shouldDirty: true })}
                value={watch('website')}
                error={errors['website']} />
            </FieldRow>
          </>
        ) : (
          <>
            <FieldRow icon={<FiUser size={16} />} label="Họ">
              <Input
                id='inputFirstName'
                onChange={(value) => setValue('firstName', value, { shouldDirty: true })}
                value={watch('firstName')}
                error={errors['firstName']} />
            </FieldRow>

            <FieldRow icon={<FiUser size={16} />} label="Tên">
              <Input
                id='inputLastName'
                onChange={(value) => setValue('lastName', value, { shouldDirty: true })}
                value={watch('lastName')}
                error={errors['lastName']} />
            </FieldRow>

            <FieldRow icon={<FiCalendar size={16} />} label="Ngày sinh">
              <DatePicker
                id='dpBirthDate'
                value={watch('birthDate')}
                onChange={(date) => date && setValue('birthDate', date, { shouldDirty: true })} />
              <span className="text-sm text-red-500 mt-1">{errors['birthDate']}</span>
            </FieldRow>
          </>
        )}

        <FieldRow icon={<FiPhone size={16} />} label="Số điện thoại">
          <Input
            id='inputPhone'
            type='tel'
            onChange={(value) => setValue('phone', value, { shouldDirty: true })}
            value={watch('phone')}
            error={errors['phone']} />
        </FieldRow>

        <FieldRow icon={<FiMapPin size={16} />} label="Tỉnh/thành phố">
          <UserAddressInput
            testId="province-input-dropdown"
            options={new ValueText(provinces.map(p => ({ text: p.name, value: p.code })))}
            onChange={handleLocationChange}
            value={watch('provinceCode')}
            level={LOCATION_LEVEL.PROVINCE}
            isLoading={locationQuery.isLoading} />
          <span className="text-sm text-red-500 mt-1">{errors['provinceCode']}</span>
        </FieldRow>

        <FieldRow icon={<FiMapPin size={16} />} label="Quận/huyện">
          <UserAddressInput
            testId="district-input-dropdown"
            options={new ValueText(districts.map(d => ({ text: d.name, value: d.code })))}
            onChange={handleLocationChange}
            value={watch('districtCode')}
            level={LOCATION_LEVEL.DISTRICT}
            isLoading={locationQuery.isLoading} />
          <span className="text-sm text-red-500 mt-1">{errors['districtCode']}</span>
        </FieldRow>

        <FieldRow icon={<FiMapPin size={16} />} label="Xã/phường">
          <UserAddressInput
            testId="ward-input-dropdown"
            options={new ValueText(wards.map(w => ({ text: w.name, value: w.code })))}
            onChange={handleLocationChange}
            value={watch('wardCode')}
            level={LOCATION_LEVEL.WARD}
            isLoading={locationQuery.isLoading} />
          <span className="text-sm text-red-500 mt-1">{errors['wardCode']}</span>
        </FieldRow>

        <FieldRow icon={<FiMapPin size={16} />} label="Địa chỉ chi tiết">
          <Input
            id='inputStreet'
            onChange={(value) => setValue('street', value, { shouldDirty: true })}
            value={watch('street')}
            error={errors['street']} />
        </FieldRow>

        <div className="flex justify-center px-4 py-4 gap-2">
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

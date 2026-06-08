'use client';
import React, { useState } from 'react';
import { Alert } from '../ui/Alert';
import { LOCATION_LEVEL, ORG_TYPE, QUERY_KEYS } from '@/src/utils/constants';
import { useForm } from 'react-hook-form';
import { IOrgUpgradeRequest } from '@/src/interfaces/org';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/src/stores';
import { useMutation, useQuery } from '@/src/utils/hooks';
import { IApiResponse } from '@/src/interfaces/common';
import { upgradeToOrg } from '@/src/services/user.api';
import QueryButton from '../ui/button/QueryButton';
import { getErrorMessage } from '@/src/helpers/getErrorMessage';
import { ILocationRequest, ILocationResponse } from '@/src/interfaces/pet';
import { getProvince } from '@/src/services/pet.api';
import { ValidatorManager } from '@/src/utils/ValidatorManager';
import { ValueTextManager } from '@/src/utils/ValueTextManager';
import { SelectInput } from '../ui/input/SelectInput';
import { Input } from '../ui/input/Input';
import { HTMLArea } from '../ui/input/HTMLArea';
import { TermsCheckbox } from './TermsCheckbox';
import { AddressInput } from '../ui/input/AddressInput';

interface IUserUpgradeForm {
  onClose: () => void,
  onSuccess: () => void,
}

export const UserUpgradeForm = observer((props: IUserUpgradeForm) => {
  const { onClose, onSuccess } = props;

  // STATES
  const { userStore } = useStores();
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertShow, setAlertShow] = useState<boolean>(false);
  const [alertFail, setAlertFail] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<ILocationResponse[]>([]);
  const [districts, setDistricts] = useState<ILocationResponse[]>([]);
  const [wards, setWards] = useState<ILocationResponse[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // FORMS
  const { getValues, setValue, watch } = useForm<IOrgUpgradeRequest>({
    defaultValues: {
      entityName: '',
      email: userStore.userContext?.email || '',
      organizationName: '',
      phone: '',
      provinceCode: '',
      districtCode: '',
      wardCode: '',
      street: '',
      website: '',
      taxCode: '',
      type: ORG_TYPE.OTHER,
      description: '',
    },
  });

  const locationForm = useForm<ILocationRequest>({
    defaultValues: { Level: LOCATION_LEVEL.PROVINCE },
  });

  // HANDLERS
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validatingResult = ValidatorManager.userUpgradeValidator.validate(getValues());
    setErrors(validatingResult.errors);
    if (validatingResult.isValid) {
      upgradeAccountMutation.mutate(getValues());
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

  // QUERIES AND MUTATIONS
  const upgradeAccountMutation = useMutation<IApiResponse<boolean>, IOrgUpgradeRequest>(
    upgradeToOrg,
    {
      onError: (err) => {
        setAlertMessage(getErrorMessage(err.data.errorCode.toString()));
        setAlertShow(true);
        setAlertFail(true);
      },
      onSuccess: () => {
        setAlertMessage(
          'Yêu cầu của bạn đã được gửi đi, chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất'
        );
        setAlertShow(true);
        setAlertFail(false);
        onSuccess();
      },
    }
  );

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
    }
  );

  return (
    <div className="w-full h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full h-full flex flex-col rounded-2xl bg-yellow-100 p-5"
        test-id="org-upgrade-form">
        <h2 className="font-bold mb-4 shrink-0">Đơn xác minh tổ chức</h2>
        <div className="flex-1 min-h-0 bg-gray-50 p-4 rounded-lg overflow-hidden">
          <div className="overflow-auto h-full w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
              <div className="flex flex-col space-y-1">
                <label htmlFor="inputOrganizationName" className="text-sm font-medium">
                  Tên tổ chức
                </label>
                <Input
                  id='inputOrganizationName'
                  onChange={(value) => setValue('organizationName', value)}
                  value={watch('organizationName')}
                  error={errors['organizationName']} />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="inputEntityName" className="text-sm font-medium">
                  Tên pháp nhân
                </label>
                <Input
                  id='inputEntityName'
                  onChange={(value) => setValue('entityName', value)}
                  value={watch('entityName')}
                  error={errors['entityName']} />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="inputPhone" className="text-sm font-medium">
                  Số điện thoại
                </label>
                <Input
                  id="inputPhone"
                  type="tel"
                  onChange={(value) => setValue('phone', value)}
                  value={watch('phone')}
                  error={errors['phone']} />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="inputEmail" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="inputEmail"
                  type="email"
                  value={watch('email')}
                  disabled
                  error={errors['email']}
                  onChange={() => { }} />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="inputWebsite" className="text-sm font-medium">
                  Website
                </label>
                <Input
                  id="inputWebsite"
                  onChange={(value) => setValue('website', value)}
                  value={watch('website')}
                  error={errors['website']} />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="inputTaxCode" className="text-sm font-medium">
                  Mã số thuế
                </label>
                <Input
                  id="inputTaxCode"
                  onChange={(value) => setValue('taxCode', value)}
                  value={watch('taxCode')}
                  error={errors['taxCode']} />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium">Tỉnh/thành phố</label>
                <AddressInput
                  testId="province-input-dropdown"
                  options={new ValueText(provinces.map(ward => ({ text: ward.name, value: ward.code })))}
                  onChange={handleLocationChange}
                  value={watch('provinceCode')}
                  level={LOCATION_LEVEL.PROVINCE}
                  isLoading={locationQuery.isLoading} />
                <span className="text-sm text-red-500 mt-2">{errors['provinceCode']}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium">Huyện/quận</label>
                <AddressInput
                  testId="district-input-dropdown"
                  options={new ValueText(districts.map(ward => ({ text: ward.name, value: ward.code })))}
                  onChange={handleLocationChange}
                  value={watch('districtCode')}
                  level={LOCATION_LEVEL.DISTRICT}
                  isLoading={locationQuery.isLoading} />
                <span className="text-sm text-red-500 mt-2">{errors['districtCode']}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium">Xã/phường</label>
                <AddressInput
                  testId="ward-input-dropdown"
                  options={new ValueText(wards.map(ward => ({ text: ward.name, value: ward.code })))}
                  onChange={handleLocationChange}
                  value={watch('wardCode')}
                  level={LOCATION_LEVEL.WARD}
                  isLoading={locationQuery.isLoading} />
                <span className="text-sm text-red-500 mt-2">{errors['wardCode']}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium">
                  Loại tổ chức
                </label>
                <SelectInput
                  onChange={(value) => setValue('type', parseInt(value))}
                  options={ValueTextManager.OrganizationType}
                  defaultValue={watch('type').toString()}
                  isClearable={false} />
              </div>

              <div className="flex flex-col space-y-1 col-span-2">
                <label htmlFor="inputStreet" className="text-sm font-medium">
                  Số nhà, tên đường
                </label>
                <Input
                  id="inputStreet"
                  onChange={(value) => setValue('street', value)}
                  value={watch('street')}
                  error={errors['street']} />
              </div>

              <div className="flex flex-col space-y-1 col-span-2">
                <label htmlFor="org-mission" className="text-sm font-medium">
                  Giới thiệu về tổ chức
                </label>
                <HTMLArea
                  id={'inputDescription'}
                  value={watch('description')}
                  setValue={(html) => {
                    setValue('description', html);
                  }} />
                <span className="text-sm text-red-500 mt-2">{errors['description']}</span>
              </div>

              <TermsCheckbox />
            </div>
          </div>
        </div>
        <div className="shrink-0 flex justify-center pt-4">
          <QueryButton
            testId="org-upgrade-button"
            name={'Hoàn thành'}
            isLoading={upgradeAccountMutation.isLoading} />
        </div>
      </form>
      <Alert
        failed={alertFail}
        message={alertMessage}
        show={alertShow}
        setShow={setAlertShow}
        showCancel={false}
        action={() => !alertFail && onClose()} />
    </div>
  );
}
);

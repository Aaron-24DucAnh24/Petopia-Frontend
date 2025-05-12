import React, { useState } from 'react';
import { Alert } from '../common/general/Alert';
import { LOCATION_LEVEL, ORG_TYPE, PET_ORG_TYPE_OPTION, QUERY_KEYS } from '@/src/utils/constants';
import { useForm } from 'react-hook-form';
import { IOrgUpgradeRequest } from '@/src/interfaces/org';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/src/stores';
import { useMutation, useQuery } from '@/src/utils/hooks';
import { IApiResponse } from '@/src/interfaces/common';
import { upgradeToOrg } from '@/src/services/user.api';
import QueryButton from '../common/button/QueryButton';
import { getErrorMessage } from '@/src/helpers/getErrorMessage';
import { AddressInput } from './AddressInput';
import { ILocationRequest, ILocationResponse } from '@/src/interfaces/pet';
import { getProvince } from '@/src/services/pet.api';
import { ValidatorManager } from '@/src/utils/ValidatorManager';
import { ValueText } from '@/src/utils/ValueText';
import { SelectInput } from '../common/input/SelectInput';
import { Input } from '../common/input/Input';

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
  const [isReadTerms, setIsReadTerms] = useState<boolean>(false);
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
  const handleClickTerm = () => {
    setIsReadTerms(true);
    window.open('/terms');
  };

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
    <div className="container h-screen py-6">
      <form
        onSubmit={handleSubmit}
        className="w-full h-full rounded-2xl bg-blue-200 p-5"
        test-id="org-upgrade-form">
        <h2 className="h-[5%] font-bold">Đơn xác minh tổ chức</h2>
        <div className="w-full h-[85%] bg-gray-50 p-4 rounded-lg overflow-hidden">
          <div className="overflow-auto h-full w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
              <div className="flex flex-col space-y-1">
                <label htmlFor="inputOrganizationName" className="text-gray-700 text-base font-bold w-fit block">
                  Tên tổ chức
                </label>
                <Input
                  id='inputOrganizationName'
                  onChange={(value) => setValue('organizationName', value)}
                  value={watch('organizationName')}
                  error={errors['organizationName']} />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="inputEntityName" className="text-gray-700 text-base font-bold w-fit block">
                  Tên pháp nhân
                </label>
                <Input
                  id='inputEntityName'
                  onChange={(value) => setValue('entityName', value)}
                  value={watch('entityName')}
                  error={errors['entityName']} />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="inputPhone" className="text-gray-700 text-base font-bold w-fit block">
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
                <label htmlFor="inputEmail" className="text-gray-700 text-base font-bold w-fit block">
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
                <label htmlFor="inputWebsite" className="text-gray-700 text-base font-bold w-fit block">
                  Website
                </label>
                <Input
                  id="inputWebsite"
                  onChange={(value) => setValue('website', value)}
                  value={watch('website')}
                  error={errors['website']} />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="inputTaxCode" className="text-gray-700 text-base font-bold w-fit block">
                  Mã số thuế
                </label>
                <Input
                  id="inputTaxCode"
                  onChange={(value) => setValue('taxCode', value)}
                  value={watch('taxCode')}
                  error={errors['taxCode']} />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-gray-700 text-base font-bold w-fit block">Tỉnh/thành phố</label>
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
                <label className="text-gray-700 text-base font-bold w-fit block">Huyện/quận</label>
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
                <label className="text-gray-700 text-base font-bold w-fit block">Xã/phường</label>
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
                <label className="text-gray-700 text-base font-bold w-fit block">
                  Loại tổ chức
                </label>
                <SelectInput
                  onChange={(value) => setValue('type', parseInt(value))}
                  options={new ValueText(PET_ORG_TYPE_OPTION.map(option => ({ text: option.label, value: option.value.toString() })))}
                  defaultValue={watch('type').toString()}
                  isClearable={false} />
              </div>

              <div className="flex flex-col space-y-1 col-span-2">
                <label htmlFor="inputStreet" className="text-gray-700 text-base font-bold w-fit block">
                  Số nhà, tên đường
                </label>
                <Input
                  id="inputStreet"
                  onChange={(value) => setValue('street', value)}
                  value={watch('street')}
                  error={errors['street']} />
              </div>

              <div className="flex flex-col space-y-1 col-span-2">
                <label htmlFor="org-mission" className="text-gray-700 text-base font-bold w-fit block">
                  Giới thiệu về tổ chức
                </label>
                <Input
                  id="org-mission"
                  type="textarea"
                  onChange={(value) => setValue('description', value)}
                  value={watch('description')}
                  error={errors['description']} />
              </div>

              <div className="col-span-2 flex items-center">
                <input
                  test-id="org-terms-tickbox"
                  type="checkbox"
                  required
                  onChange={(e) => {
                    if (!isReadTerms) e.target.checked = false;
                  }} />
                <span className="ml-1">
                  {'Tôi cam kết tuân thủ các '}
                  <i
                    onClick={handleClickTerm}
                    className="text-blue-700 font-bold underline cursor-pointer">
                    {'điều khoản và điều kiện'}
                  </i>
                  {' của tổ chức'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[10%] flex justify-center py-4">
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

import React, { useState } from 'react';
import { Alert } from '../general/Alert';
import { LOCATION_LEVEL, ORG_TYPE, PET_ORG_TYPE_OPTION, QUERY_KEYS } from '@/src/utils/constants';
import { useForm } from 'react-hook-form';
import { IOrgUpgradeRequest } from '@/src/interfaces/org';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/src/stores';
import { useMutation, useQuery } from '@/src/utils/hooks';
import { IApiResponse } from '@/src/interfaces/common';
import { upgradeToOrg } from '@/src/services/user.api';
import QueryButton from '../general/QueryButton';
import { getErrorMessage } from '@/src/helpers/getErrorMessage';
import { AddressInput } from './AddressInput';
import { ILocationRequest, ILocationResponse } from '@/src/interfaces/pet';
import { getProvince } from '@/src/services/pet.api';
import { ValidatorManager } from '@/src/utils/ValidatorManager';
import { ValueText } from '@/src/utils/ValueText';
import { SelectInput } from '../general/SelectInput';

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
                <label
                  htmlFor="org-name"
                  className="text-gray-700 text-base font-bold">
                  Tên tổ chức
                </label>
                <input
                  test-id="org-name"
                  id="org-name"
                  name="org-name"
                  type="text"
                  onChange={(e) => {
                    setValue('organizationName', e.target.value);
                  }}
                  className="border-gray-300 border-2 bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-yellow-400 focus:outline-none focus:ring-0 focus:bg-white col-span-2 h-10" />
                <span className="text-sm text-red-500 mt-2">{errors['organizationName']}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="owner-name"
                  className="text-gray-700 text-base font-bold">
                  Tên pháp nhân
                </label>
                <input
                  test-id="org-owner-name"
                  id="owner-name"
                  name="owner-name"
                  type="text"
                  onChange={(e) => {
                    setValue('entityName', e.target.value);
                  }}
                  className="border-gray-300 border-2 bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-yellow-400 focus:outline-none focus:ring-0 focus:bg-white col-span-2 h-10" />
                <span className="text-sm text-red-500 mt-2">{errors['entityName']}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="org-phone"
                  className="text-gray-700 text-base font-bold">
                  Số điện thoại
                </label>
                <input
                  test-id="org-phone"
                  id="org-phone"
                  name="org-phone"
                  type="tel"
                  onChange={(e) => {
                    setValue('phone', e.target.value);
                  }}
                  className="border-gray-300 border-2 bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-yellow-400 focus:outline-none focus:ring-0 focus:bg-white col-span-2 h-10" />
                <span className="text-sm text-red-500 mt-2">{errors['phone']}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="org-email"
                  className="text-gray-700 text-base font-bold">
                  Email
                </label>
                <input
                  test-id="org-email"
                  id="org-email"
                  type="email"
                  value={watch('email')}
                  disabled
                  className="border-gray-300 border-2 bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-yellow-400 focus:outline-none focus:ring-0 focus:bg-white col-span-2 h-10" />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-gray-700 text-base font-bold">Tỉnh/thành phố</label>
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
                <label className="text-gray-700 text-base font-bold">Huyện/quận</label>
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
                <label className="text-gray-700 text-base font-bold">Xã/phường</label>
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
                <label
                  htmlFor="org-address"
                  className="text-gray-700 text-base font-bold">
                  Số nhà, tên đường
                </label>
                <input
                  test-id="org-street"
                  id="org-address"
                  name="org-address"
                  type="text"
                  onChange={(e) => {
                    setValue('street', e.target.value);
                  }}
                  className="border-gray-300 border-2 bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-yellow-400 focus:outline-none focus:ring-0 focus:bg-white col-span-2 h-10" />
                <span className="text-sm text-red-500 mt-2">{errors['street']}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="link"
                  className="text-gray-700 text-base font-bold">
                  Website
                </label>
                <input
                  test-id="org-website"
                  id="link"
                  type="text"
                  onChange={(e) => {
                    setValue('website', e.target.value);
                  }}
                  className="border-gray-300 border-2 bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-yellow-400 focus:outline-none focus:ring-0 focus:bg-white col-span-2 h-10" />
                <span className="text-sm text-red-500 mt-2">{errors['website']}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="tax-code"
                  className="text-gray-700 text-base font-bold">
                  Mã số thuế
                </label>
                <input
                  test-id="org-tax-code"
                  id="tax-code"
                  name="tax-code"
                  onChange={(e) => {
                    setValue('taxCode', e.target.value);
                  }}
                  className="border-gray-300 border-2 bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-yellow-400 focus:outline-none focus:ring-0 focus:bg-white col-span-2 h-10" />
                <span className="text-sm text-red-500 mt-2">{errors['taxCode']}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="org-type"
                  className="text-gray-700 text-base font-bold">
                  Loại tổ chức
                </label>
                <SelectInput
                  onChange={(value) => setValue('type', parseInt(value))}
                  options={new ValueText(PET_ORG_TYPE_OPTION.map(option => ({ text: option.label, value: option.value.toString() })))}
                  defaultValue={watch('type').toString()}
                  isClearable={false} />
              </div>

              <div className="flex flex-col space-y-1 col-span-2">
                <label
                  htmlFor="org-mission"
                  className="text-gray-700 text-base font-bold">
                  Giới thiệu về tổ chức
                </label>
                <textarea
                  test-id="org-mission"
                  id="org-mission"
                  name="org-mission"
                  onChange={(e) => {
                    setValue('description', e.target.value);
                  }}
                  className="border-gray-300 border-2 bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-yellow-400 focus:outline-none focus:ring-0 focus:bg-white col-span-2 h-full min-h-[80px]" />
                <span className="text-sm text-red-500 mt-2">{errors['description']}</span>
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

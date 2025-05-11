import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import {
  ICreatePetProfileRequest,
  IPetFilterItem,
} from '@/src/interfaces/pet';
import { UseQueryResult } from 'react-query';
import { AxiosResponse } from 'axios';
import { IApiErrorResponse } from '@/src/interfaces/common';
import { BsStars } from 'react-icons/bs';
interface AttributeSelectProps {
  label: string;
  options: IPetFilterItem[];
  value:
  | 'breed'
  | 'species'
  | 'sex'
  | 'age'
  | 'color'
  | 'size'
  | 'isVaccinated'
  | 'isSterillized';
  setValue: UseFormSetValue<ICreatePetProfileRequest>;
  watch: UseFormWatch<ICreatePetProfileRequest>;
  testId?: string;
}

export default function AttributeSelect({
  setValue,
  watch,
  label,
  value,
  options,
  testId,
}: AttributeSelectProps) {
  return (
    <div className="flex flex-col space-y-2">
      <select
        test-id={testId}
        onChange={(e) => setValue(value, e.target.value)}
        className={`text-black  border ${value === 'species'
          ? 'border-yellow-600 animate-pulse bg-yellow-200'
          : 'border-gray-300 hover:bg-slate-100'
          } focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center`}
        value={watch(value)}>
        <option value="-1">Chọn {label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

'use client';
import AttributeSelect from './AttributeSelect';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import ControlForm from './ControlForm';
import {
  GIVE_PET_STEP,
  PET_SELECT,
  PET_SPECIES_FILTER,
  QUERY_KEYS,
} from '@/src/utils/constants';
import {
  ICreatePetProfileRequest,
  IVaccine,
} from '@/src/interfaces/pet';
import BreedInput from './BreedInput';
import { useQuery } from '@/src/utils/hooks';
import { getVaccine } from '@/src/services/pet.api';
import Dropdown from '../ui/VaccineDropdown';
import { IApiResponse } from '@/src/interfaces/common';
import { Input } from '../ui/input/Input';
import { useState } from 'react';

export default function FormPetDetail({
  handleNext,
  handleBack,
  setValue,
  watch,
  errors = {},
}: {
  handleNext: () => void;
  handleBack: () => void;
  setValue: UseFormSetValue<ICreatePetProfileRequest>;
  watch: UseFormWatch<ICreatePetProfileRequest>;
  errors?: Record<string, string>;
}) {
  const [vaccines, setVaccines] = useState<IVaccine[]>();

  useQuery<IApiResponse<IVaccine[]>>(
    [QUERY_KEYS.GET_VACCINE],
    () => getVaccine(),
    {
      onSuccess: (data) => {
        setVaccines(data.data.data);
      },
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="w-full rounded-2xl bg-yellow-100 p-5 flex flex-col flex-1 min-h-0">
      <h2 className="font-bold mb-2 shrink-0">Thông tin về thú cưng của bạn</h2>

      {/* form */}
      <div className="w-full p-5 mb-5 bg-gray-50 rounded-lg overflow-y-auto flex-1 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tên thú cưng */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="pet-name" className="text-sm font-medium">Tên thú cưng</label>
            <Input
              id="pet-name"
              value={watch('name')}
              onChange={(v) => setValue('name', v)}
              error={errors['name']}
            />
          </div>

          <AttributeSelect
            setValue={setValue}
            watch={watch}
            label="Loài"
            value="species"
            options={{ ...PET_SPECIES_FILTER, kind: 'species' }.items}
            error={errors['species']}
          />

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Giống</label>
            <BreedInput watch={watch} setValue={setValue} />
          </div>

          {PET_SELECT.map((filter) => (
            <AttributeSelect
              testId={`dropdown-option-${filter.kind}`}
              key={filter.id}
              setValue={setValue}
              watch={watch}
              label={filter.label}
              value={filter.kind}
              options={filter.items}
              error={errors[filter.kind]}
            />
          ))}

          {vaccines && watch('isVaccinated') == 0 && (
            <Dropdown
              optionsList={vaccines}
              setValue={setValue}
              watch={watch}
            />
          )}

          {/* Giới thiệu về thú cưng */}
          <div className="flex flex-col space-y-2 md:col-span-2">
            <label htmlFor="pet-description" className="text-sm font-medium">Giới thiệu về thú cưng</label>
            <textarea
              test-id="pet-description-give-form"
              id="pet-description"
              value={watch('description')}
              onChange={(e) => setValue('description', e.target.value)}
              placeholder='Ví dụ: "Milu rất nghịch ngợm"'
              rows={4}
              className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-0 focus:border-yellow-400 ${errors['description'] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
            />
            {errors['description'] && (
              <span className="text-sm text-red-500">{errors['description']}</span>
            )}
          </div>
        </div>

        <div className="mt-4 space-x-2">
          <label className="text-sm font-medium" htmlFor="isAvailable">Sẵn sàng để cho</label>
          <input
            type="checkbox"
            id="isAvailable"
            onChange={(e) => setValue('isAvailable', e.target.checked)}
            checked={watch('isAvailable')}
          />
        </div>
      </div>

      {/* Controller */}
      <ControlForm
        handleBack={handleBack}
        handleNext={handleNext}
        step={GIVE_PET_STEP.PET_DETAIL}
      />
    </div>
  );
}

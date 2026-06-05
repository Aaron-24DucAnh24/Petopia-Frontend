'use client';
import React, { useEffect } from 'react';
import { useQuery } from '@/src/utils/hooks';
import { PET_SPECIES, QUERY_KEYS } from '@/src/utils/constants';
import { IApiResponse } from '@/src/interfaces/common';
import { getBreed } from '@/src/services/pet.api';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ICreatePetProfileRequest } from '@/src/interfaces/pet';

export default function BreedInput({
  setValue,
  watch,
}: {
  setValue: UseFormSetValue<ICreatePetProfileRequest>;
  watch: UseFormWatch<ICreatePetProfileRequest>;
}) {
  useQuery<IApiResponse<string[]>>(
    [QUERY_KEYS.GET_BREED_DETAIL, watch('species')],
    () => getBreed(watch('species')),
    {
      onSuccess: (res) => {
        setValue('listBreed', res.data.data);
        watch('presetBreed') && setValue('breed', watch('presetBreed'));
      },
      enabled:
        watch('species') === PET_SPECIES.DOG || watch('species') === PET_SPECIES.CAT,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    setValue('breed', '');
  }, [watch('species')]);

  return (
    <select
      onChange={(e) => setValue('breed', e.target.value)}
      disabled={watch('species') !== PET_SPECIES.DOG && watch('species') !== PET_SPECIES.CAT}
      className="border border-gray-300 hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      value={watch('breed')}
    >
      <option value="">Chọn giống</option>
      {watch('listBreed')?.map((breed) => (
        <option key={breed} value={breed}>{breed}</option>
      ))}
    </select>
  );
}

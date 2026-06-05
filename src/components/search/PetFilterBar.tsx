'use client';
import { IApiResponse } from '@/src/interfaces/common';
import { IPetFilter, IPetFilterRequest } from '@/src/interfaces/pet';
import { getAvailableBreeds } from '@/src/services/pet.api';
import { PET_FILTERS, PET_SPECIES, QUERY_KEYS } from '@/src/utils/constants';
import { useQuery } from '@/src/utils/hooks';
import { useEffect, useState } from 'react';
import { PetFilterCard } from './PetFilterCard';

const FILTER_ID_TO_FIELD: Record<number, keyof IPetFilterRequest> = {
  1: 'species',
  2: 'sex',
  3: 'color',
  4: 'size',
  5: 'age',
  6: 'isVaccinated',
  7: 'isSterillized',
};

const ARRAY_FILTER_KEYS: (keyof IPetFilterRequest)[] = [
  'species', 'sex', 'color', 'size', 'age', 'isVaccinated', 'isSterillized', 'breed',
];

interface IPetFilterBar {
  filter: IPetFilterRequest;
  disable: boolean;
  onToggle: (field: keyof IPetFilterRequest, value: number | string) => void;
  onClearAll: () => void;
}

export const PetFilterBar = ({ filter, disable, onToggle, onClearAll }: IPetFilterBar) => {
  const [breedFilter, setBreedFilter] = useState<IPetFilter>();

  const species =
    filter.species?.length === 1 &&
      (filter.species[0] === PET_SPECIES.DOG || filter.species[0] === PET_SPECIES.CAT)
      ? filter.species[0]
      : undefined;

  useEffect(() => {
    if (species === undefined) setBreedFilter(undefined);
  }, [species]);

  const getBreedQuery = useQuery<IApiResponse<string[]>>(
    [QUERY_KEYS.GET_PET_BREEDS, species],
    () => species !== undefined && getAvailableBreeds({ species }),
    {
      onSuccess: (res) => {
        setBreedFilter({
          id: PET_FILTERS.length + 10,
          items: res.data.data.map((value, index) => ({ id: index, value, label: value })),
          label: 'Giống',
          labelGetValues: 'breed',
        });
      },
      refetchOnWindowFocus: false,
      enabled: species !== undefined,
    }
  );

  const hasActiveFilters = ARRAY_FILTER_KEYS.some(k => {
    const v = filter[k];
    return Array.isArray(v) && v.length > 0;
  });

  return (
    <form className="hidden lg:block">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-gray-900">Bộ lọc</span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            Xoá tất cả
          </button>
        )}
      </div>

      {PET_FILTERS.map((f) => {
        const field = FILTER_ID_TO_FIELD[f.id];
        return (
          <div key={f.id}>
            <PetFilterCard
              filter={f}
              disabled={disable || getBreedQuery.isLoading}
              currentValues={(filter[field] as (number | string)[]) ?? []}
              onToggle={(v) => onToggle(field, v)}
              isMobile={false}
            />
            {f.id === 1 && breedFilter !== undefined && (
              <PetFilterCard
                filter={breedFilter}
                disabled={disable || getBreedQuery.isLoading}
                currentValues={filter.breed ?? []}
                onToggle={(v) => onToggle('breed', v)}
                isMobile={false}
              />
            )}
          </div>
        );
      })}
    </form>
  );
};

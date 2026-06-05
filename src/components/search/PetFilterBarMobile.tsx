'use client';
import { IPetFilter, IPetFilterRequest } from '@/src/interfaces/pet';
import { useRef, useState, useEffect } from 'react';
import { PET_FILTERS, PET_SPECIES, QUERY_KEYS } from '@/src/utils/constants';
import { useClickOutside, useQuery } from '@/src/utils/hooks';
import { PetFilterCard } from './PetFilterCard';
import { IApiResponse } from '@/src/interfaces/common';
import { getAvailableBreeds } from '@/src/services/pet.api';
import { IoClose } from 'react-icons/io5';

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

export function PetFilterBarMobile({
  showFilterMobile,
  setShowFilterMobile,
  filter,
  onToggle,
  onClearAll,
  disable,
}: {
  showFilterMobile: boolean;
  setShowFilterMobile: (show: boolean) => void;
  filter: IPetFilterRequest;
  onToggle: (field: keyof IPetFilterRequest, value: number | string) => void;
  onClearAll: () => void;
  disable: boolean;
}) {
  const [breedFilter, setBreedFilter] = useState<IPetFilter>();

  const species =
    filter.species?.length === 1 &&
      (filter.species[0] === PET_SPECIES.DOG || filter.species[0] === PET_SPECIES.CAT)
      ? filter.species[0]
      : undefined;

  useEffect(() => {
    if (species === undefined) setBreedFilter(undefined);
  }, [species]);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  useClickOutside(() => setShowFilterMobile(false), [buttonRef, divRef]);

  const getBreedQuery = useQuery<IApiResponse<string[]>>(
    [QUERY_KEYS.GET_PET_BREEDS, species],
    () => species !== undefined && getAvailableBreeds({ species }),
    {
      onSuccess: (res) => {
        setBreedFilter({
          id: PET_FILTERS.length + 1,
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

  if (!showFilterMobile) return null;

  return (
    <div className="relative z-40 lg:hidden" role="dialog">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px]" />

      <div className="fixed inset-0 z-40 flex">
        <div
          ref={divRef}
          className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Bộ lọc</span>
            </div>
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Xoá tất cả
                </button>
              )}
              <button
                type="button"
                ref={buttonRef}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setShowFilterMobile(false)}
              >
                <IoClose size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <form className="flex-1 overflow-y-auto">
            {PET_FILTERS.map((f) => {
              const field = FILTER_ID_TO_FIELD[f.id];
              return (
                <div key={f.id}>
                  <PetFilterCard
                    filter={f}
                    disabled={disable || getBreedQuery.isLoading}
                    currentValues={(filter[field] as (number | string)[]) ?? []}
                    onToggle={(v) => onToggle(field, v)}
                    isMobile={true}
                  />
                  {f.id === 1 && breedFilter !== undefined && (
                    <PetFilterCard
                      filter={breedFilter}
                      disabled={disable || getBreedQuery.isLoading}
                      currentValues={filter.breed ?? []}
                      onToggle={(v) => onToggle('breed', v)}
                      isMobile={true}
                    />
                  )}
                </div>
              );
            })}
          </form>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowFilterMobile(false)}
              className="w-full py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
            >
              Xem kết quả
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

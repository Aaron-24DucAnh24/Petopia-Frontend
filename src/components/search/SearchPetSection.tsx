'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { PetFilterBarMobile } from './PetFilterBarMobile';
import { PetSearchBar } from './PetSearchBar';
import { PetCard } from './PetCard';
import Pagination from '../ui/Pagination';
import { QueryProvider } from '../providers/QueryProvider';
import { SortBlock } from '../ui/SortBlock';
import { PetFilterBar } from './PetFilterBar';
import { useForm } from 'react-hook-form';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { useQuery } from '@/src/utils/hooks';
import { getPets } from '@/src/services/pet.api';
import { IPetFilterRequest, IPetResponse } from '@/src/interfaces/pet';
import {
  PAGE_SIZE,
  PET_AGE,
  PET_COLOR,
  PET_MEDICAL_STATUS,
  PET_SEX,
  PET_SIZE,
  PET_SPECIES,
  QUERY_KEYS,
} from '@/src/utils/constants';
import CardSkeleton from '../ui/CardSkeleton';
import { FaFilter } from 'react-icons/fa';
import { NoResultBackground } from '../ui/NoResultBackground';

type SearchParams = Pick<URLSearchParams, 'get' | 'getAll'>;

function paramsToFilter(p: SearchParams): IPetFilterRequest {
  return {
    text: p.get('text') || '',
    species: p.getAll('species').map(Number) as PET_SPECIES[],
    sex: p.getAll('sex').map(Number) as PET_SEX[],
    color: p.getAll('color').map(Number) as PET_COLOR[],
    size: p.getAll('size').map(Number) as PET_SIZE[],
    age: p.getAll('age').map(Number) as PET_AGE[],
    isVaccinated: p.getAll('isVaccinated').map(Number) as PET_MEDICAL_STATUS[],
    isSterillized: p.getAll('isSterillized').map(Number) as PET_MEDICAL_STATUS[],
    breed: p.getAll('breed'),
  };
}

function buildSearchParams(
  filter: IPetFilterRequest,
  orderBy: string,
  page: number,
): URLSearchParams {
  const p = new URLSearchParams();
  if (filter.text) p.set('text', filter.text);
  if (orderBy !== 'newest') p.set('orderBy', orderBy);
  if (page > 1) p.set('page', String(page));
  (
    ['species', 'sex', 'color', 'size', 'age', 'isVaccinated', 'isSterillized'] as (keyof IPetFilterRequest)[]
  ).forEach(k =>
    (filter[k] as number[] | undefined)?.forEach(v => p.append(k, String(v)))
  );
  filter.breed?.forEach(v => p.append('breed', v));
  return p;
}

const ARRAY_FILTER_KEYS: (keyof IPetFilterRequest)[] = [
  'species', 'sex', 'color', 'size', 'age', 'isVaccinated', 'isSterillized', 'breed',
];

export const SearchPetSection = QueryProvider(() => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showFilterMobile, setShowFilterMobile] = useState(false);
  const [pets, setPets] = useState<IPetResponse[]>([]);

  const filter = useMemo(() => paramsToFilter(searchParams), [searchParams]);
  const orderBy = (searchParams.get('orderBy') as 'newest' | 'popular') || 'newest';
  const urlPage = Number(searchParams.get('page') || '1');

  const paginationForm = useForm<IPaginationModel>({
    defaultValues: { pageIndex: urlPage, pageNumber: 1 },
  });

  const filterRef = useRef(filter);
  filterRef.current = filter;
  const orderByRef = useRef(orderBy);
  orderByRef.current = orderBy;

  const updateUrl = (
    newFilter: IPetFilterRequest,
    opts: { orderBy?: 'newest' | 'popular'; page?: number } = {},
  ) => {
    const newOrderBy = opts.orderBy ?? orderBy;
    const newPage = opts.page ?? 1;
    router.replace(`${pathname}?${buildSearchParams(newFilter, newOrderBy, newPage).toString()}`);
  };

  const toggleFilter = (field: keyof IPetFilterRequest, value: number | string) => {
    const current = (filter[field] as (number | string)[] | undefined) ?? [];
    const next = current.includes(value as number & string)
      ? current.filter(v => v !== value)
      : [...current, value];
    const newFilter: IPetFilterRequest = {
      ...filter,
      [field]: next,
      text: '',
      ...(field === 'species' ? { breed: [] } : {}),
    };
    updateUrl(newFilter);
  };

  const clearAllFilters = () => {
    const p = new URLSearchParams();
    if (filter.text) p.set('text', filter.text);
    if (orderBy !== 'newest') p.set('orderBy', orderBy);
    router.replace(`${pathname}?${p.toString()}`);
  };

  // Sync URL page → paginationForm (browser back/forward)
  useEffect(() => {
    paginationForm.setValue('pageIndex', urlPage);
  }, [urlPage, paginationForm]);

  // Sync paginationForm → URL (Pagination component changes page)
  const formPageIndex = paginationForm.watch('pageIndex');
  useEffect(() => {
    if (formPageIndex === urlPage) return;
    const params = buildSearchParams(filterRef.current, orderByRef.current, formPageIndex);
    router.replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formPageIndex]);

  const getPetsQuery = useQuery<IApiResponse<IPetResponse[]>>(
    [QUERY_KEYS.GET_PETS, searchParams.toString()],
    () =>
      getPets({
        pageIndex: urlPage,
        pageSize: PAGE_SIZE,
        orderBy,
        filter,
      }),
    {
      onSuccess: (res) => {
        const { data, pageNumber } = res.data;
        setPets(data);
        pageNumber && paginationForm.setValue('pageNumber', pageNumber);
      },
      refetchOnWindowFocus: false,
    }
  );

  const activeFilterCount = ARRAY_FILTER_KEYS.filter(k => {
    const v = filter[k];
    return Array.isArray(v) && v.length > 0;
  }).length;

  return (
    <div>
      <PetFilterBarMobile
        showFilterMobile={showFilterMobile}
        setShowFilterMobile={setShowFilterMobile}
        filter={filter}
        onToggle={toggleFilter}
        onClearAll={clearAllFilters}
        disable={getPetsQuery.isFetching}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="pt-6">
          <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-4">
            {/* Sidebar */}
            <PetFilterBar
              filter={filter}
              onToggle={toggleFilter}
              onClearAll={clearAllFilters}
              disable={getPetsQuery.isFetching}
            />

            {/* Main content */}
            <div className="lg:col-span-3">
              {/* Search + sort row */}
              <div className="flex items-center gap-3 mb-6">
                <PetSearchBar
                  text={filter.text}
                  onSearch={(t) => updateUrl({ ...filter, text: t })}
                  disable={getPetsQuery.isFetching}
                />
                <SortBlock
                  orderBy={orderBy}
                  setOrderBy={(v) =>
                    updateUrl(filter, {
                      orderBy: typeof v === 'function' ? v(orderBy) : v,
                    })
                  }
                  disable={getPetsQuery.isFetching}
                />
                <button
                  type="button"
                  className="relative flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors lg:hidden"
                  onClick={() => setShowFilterMobile(true)}
                >
                  <FaFilter size={13} />
                  Lọc
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 text-xs font-bold bg-orange-500 text-white rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Result label */}
              {filter.text && (
                <p className="text-sm text-gray-500 italic mb-4">
                  Kết quả cho:{' '}
                  <span className="font-medium text-gray-700 not-italic">{filter.text}</span>
                </p>
              )}

              {/* Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getPetsQuery.isLoading &&
                  Array.from({ length: PAGE_SIZE }).map((_, i) => <CardSkeleton key={i} />)}
                {!getPetsQuery.isLoading &&
                  pets.map((pet, index) => (
                    <PetCard
                      testId={`pet-card-${index}`}
                      isEditable={false}
                      key={pet.id}
                      id={pet.id}
                      name={pet.name}
                      breed={pet.breed}
                      sex={pet.sex}
                      age={pet.age}
                      image={pet.image}
                      isOrgOwned={pet.isOrgOwned}
                    />
                  ))}
              </div>

              <NoResultBackground show={pets.length === 0} />

              <div className="flex items-center justify-center mt-6">
                <Pagination
                  paginationForm={paginationForm}
                  disable={getPetsQuery.isFetching}
                  show={pets.length !== 0 && paginationForm.getValues('pageNumber') !== 1}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
});

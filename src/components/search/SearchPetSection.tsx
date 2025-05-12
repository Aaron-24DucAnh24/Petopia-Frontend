'use client';
import { useState } from 'react';
import { PetFilterBarMobile } from './PetFilterBarMobile';
import { PetSearchBar } from './PetSearchBar';
import { PetCard } from './PetCard';
import Pagination from '../common/general/Pagination';
import { QueryProvider } from '../common/provider/QueryProvider';
import { SortBlock } from '../common/general/SortBlock';
import { PetFilterBar } from './PetFilterBar';
import { useForm } from 'react-hook-form';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { useQuery } from '@/src/utils/hooks';
import { getPets } from '@/src/services/pet.api';
import { IPetFilterRequest, IPetResponse } from '@/src/interfaces/pet';
import { PAGE_SIZE, QUERY_KEYS } from '@/src/utils/constants';
import CardSkeleton from '../common/CardSkeleton';
import { FaFilter } from 'react-icons/fa';
import { NoResultBackground } from '../common/general/NoResultBackground';

export const SearchPetSection = QueryProvider(() => {
  // STATES
  const [showFilterMobile, setShowFilterMobile] = useState(false);
  const [pets, setPets] = useState<IPetResponse[]>([]);
  const [orderBy, setOrderBy] = useState<'newest' | 'popular'>('newest');

  // FORMS
  const filterFrom = useForm<IPetFilterRequest>({
    defaultValues: { text: '' },
  });
  const paginationForm = useForm<IPaginationModel>({
    defaultValues: {
      pageIndex: 1,
      pageNumber: 1,
    },
  });

  // GET PETS QUERY
  const getPetsQuery = useQuery<IApiResponse<IPetResponse[]>>(
    [
      QUERY_KEYS.GET_PETS,
      orderBy,
      filterFrom.watch(),
      paginationForm.watch('pageIndex'),
    ],
    () => getPets({
      pageIndex: paginationForm.getValues('pageIndex'),
      pageSize: PAGE_SIZE,
      orderBy: orderBy,
      filter: filterFrom.getValues(),
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

  return (
    <div>
      <PetFilterBarMobile
        showFilterMobile={showFilterMobile}
        setShowFilterMobile={setShowFilterMobile}
        filterForm={filterFrom}
        disable={getPetsQuery.isFetching} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="pt-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <PetFilterBar
              filterForm={filterFrom}
              disable={getPetsQuery.isFetching} />
            <div className="lg:col-span-3">
              <div className="flex w-full mb-10">
                <PetSearchBar
                  filterForm={filterFrom}
                  disable={getPetsQuery.isFetching} />
              </div>
              <div className="flex items-center justify-end w-full">
                {
                  filterFrom.getValues('text')
                    ? <div className="flex-1 text-xl italic font-light">
                      {`Hiễn thị kết quả cho: ${filterFrom.getValues('text')}`}
                    </div>
                    : <></>
                }
                <SortBlock
                  orderBy={orderBy}
                  setOrderBy={setOrderBy}
                  disable={getPetsQuery.isFetching} />
                <button
                  test-id="filter-button-mobile"
                  type="button"
                  className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                  onClick={() => setShowFilterMobile(true)}>
                  <FaFilter color="grey" size={24} />
                </button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-y-5 gap-x-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
                {
                  getPetsQuery.isLoading && Array.from({ length: PAGE_SIZE }).map((_, index) => (
                    <CardSkeleton key={index} />
                  ))
                }
                {
                  !getPetsQuery.isLoading
                  && pets.length > 0
                  && pets.map((pet, index) => (
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
                      isOrgOwned={pet.isOrgOwned} />
                  ))}
              </div>
              <NoResultBackground show={pets.length === 0} />
              <div className="flex items-center justify-center mt-5">
                <Pagination
                  paginationForm={paginationForm}
                  disable={getPetsQuery.isFetching}
                  show={
                    pets.length !== 0 &&
                    paginationForm.getValues('pageNumber') != 1
                  } />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
});

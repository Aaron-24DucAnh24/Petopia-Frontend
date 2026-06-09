'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IPetResponse } from '@/src/interfaces/pet';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { getPetsByUser } from '@/src/services/pet.api';
import { useQuery } from '@/src/utils/hooks';
import { QUERY_KEYS } from '@/src/utils/constants';
import { PetCard } from '../search/PetCard';
import { AddButton } from '../ui/button/AddButton';
import { QueryProvider } from '../providers/QueryProvider';
import Pagination from '../ui/Pagination';
import { useStores } from '@/src/stores';
import { ConfirmCloseModal } from '../ui/ConfirmCloseModal';
import PetProfileForm from './PetProfileForm';

const PAGE_SIZE = 6;


interface IPetGridProps {
  userId: string;
  initialData?: IApiResponse<IPetResponse[]>;
}

export const PetGrid = QueryProvider(({ userId, initialData }: IPetGridProps) => {
  const { userStore } = useStores();
  const [pets, setPets] = useState<IPetResponse[]>(initialData?.data ?? []);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreatePet, setShowCreatePet] = useState(false);

  const paginationForm = useForm<IPaginationModel>({
    defaultValues: { pageIndex: 1, pageNumber: initialData?.pageNumber ?? 1 },
  });

  useEffect(() => {
    const { unsubscribe } = paginationForm.watch((values) => {
      if (values.pageIndex !== undefined) {
        setCurrentPage(values.pageIndex);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPetsQuery = useQuery<IApiResponse<IPetResponse[]>>(
    [QUERY_KEYS.GET_PETS_BY_USER, currentPage],
    () => getPetsByUser({ pageIndex: currentPage, pageSize: PAGE_SIZE, filter: userId }),
    {
      enabled: !!userId && (currentPage !== 1 || initialData === undefined),
      onSuccess: (res) => {
        setPets(res.data.data ?? []);
        if (res.data.pageNumber !== undefined) {
          paginationForm.setValue('pageNumber', res.data.pageNumber);
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    setIsOwner(userStore.userContext?.id === userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.userContext?.id, userId]);

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-base font-semibold text-gray-700 uppercase tracking-widest">Thú cưng</h2>
        <div className="flex-1 h-px bg-gray-200" />
        {isOwner && <AddButton onClick={() => setShowCreatePet(true)} title="Thêm thú cưng" />}
      </div>

      {!getPetsQuery.isFetching && pets.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">Bạn chưa có thú cưng nào.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              {...pet}
              isEditable={isOwner}
              getPetQuery={getPetsQuery as any}
            />
          ))}
        </div>
      )}

      <Pagination
        paginationForm={paginationForm}
        disable={getPetsQuery.isFetching}
        show={paginationForm.getValues('pageNumber') > 1}
      />

      <ConfirmCloseModal
        open={showCreatePet}
        onClose={() => setShowCreatePet(false)}
        contentStyle={{ width: '90vw', maxWidth: '900px', padding: 0, borderRadius: '12px' }}>
        <div className="bg-white rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
          <PetProfileForm handleClose={() => {
            setShowCreatePet(false);
            getPetsQuery.refetch();
          }} />
        </div>
      </ConfirmCloseModal>
    </>
  );
});

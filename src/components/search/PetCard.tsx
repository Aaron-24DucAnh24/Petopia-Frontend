'use client';
import { getPetAgeText, getPetSexText } from '@/src/helpers/getPetTextDetails';
import { IPetResponse } from '@/src/interfaces/pet';
import { PET_SEX } from '@/src/utils/constants';
import Image from 'next/image';
import Link from 'next/link';
import { MdDelete } from 'react-icons/md';
import { Alert } from '../ui/Alert';
import { useState } from 'react';
import { useMutation } from '@/src/utils/hooks';
import { deletePet } from '@/src/services/pet.api';
import { CiEdit } from 'react-icons/ci';
import PetProfileForm from '../pet/PetProfileForm';
import { ConfirmCloseModal } from '../ui/ConfirmCloseModal';
import { FaShieldDog } from 'react-icons/fa6';
import { UseQueryResult } from 'react-query';
import { AxiosResponse } from 'axios';
import { IApiErrorResponse, IApiResponse } from '@/src/interfaces/common';
import { QueryProvider } from '../providers/QueryProvider';

interface IPetCard extends IPetResponse {
  isEditable?: boolean;
  simple?: boolean;
  getPetQuery?: UseQueryResult<
    AxiosResponse<IApiResponse<IPetResponse[]>, any>,
    AxiosResponse<IApiErrorResponse, any>
  >;
  testId?: string;
}

function PetCardInner(props: IPetCard) {
  const {
    id,
    name,
    breed,
    sex,
    age,
    image,
    isEditable = false,
    simple = false,
    isOrgOwned,
    getPetQuery,
    testId,
  } = props;

  const [showAlert, setShowAlert] = useState(false);
  const [isPetFormOpen, setIsPetFormOpen] = useState(false);

  const deletePetMutation = useMutation(deletePet, {
    onSuccess: () => getPetQuery?.refetch(),
  });

  const sexBadgeClass =
    sex === PET_SEX.MALE
      ? 'bg-blue-50 text-blue-600'
      : sex === PET_SEX.FEMALE
        ? 'bg-pink-50 text-pink-600'
        : 'bg-gray-50 text-gray-500';

  return (
    <div className="relative group h-full">
      <Link href={`/pet/${id}`} className="block h-full">
        <div
          test-id={testId}
          className="h-full rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="relative w-full pt-[100%]">
            <Image
              src={image}
              alt="profile"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover top-0 left-0"
            />
            {isOrgOwned && (
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
                <FaShieldDog size={14} className="text-green-600" title="Cộng tác viên" />
              </div>
            )}
          </div>
          <div className="p-3">
            <h5 className="font-bold text-gray-900 truncate text-base">{name}</h5>
            {!simple && (
              <>
                <p className="text-sm text-gray-400 truncate mb-2">{breed}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${sexBadgeClass}`}>
                    {getPetSexText(sex)}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600">
                    {getPetAgeText(age)} tuổi
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>

      {isEditable && (
        <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center transition-colors hover:bg-blue-500"
            onClick={() => setIsPetFormOpen(true)}
          >
            <CiEdit size={14} className="text-white" />
          </button>
          <button
            className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center transition-colors hover:bg-red-500"
            onClick={() => setShowAlert(true)}
          >
            <MdDelete size={14} className="text-white" />
          </button>
        </div>
      )}

      <ConfirmCloseModal
        open={isPetFormOpen}
        onClose={() => setIsPetFormOpen(false)}
        contentStyle={{ width: '90vw', maxWidth: '900px', padding: 0, borderRadius: '12px' }}
      >
        <div className="bg-white rounded-xl max-h-[85vh] overflow-hidden flex flex-col">
          <PetProfileForm id={id} handleClose={() => window.location.reload()} />
        </div>
      </ConfirmCloseModal>

      <Alert
        message="Bạn có chắc muốn xoá không?"
        failed={true}
        show={showAlert}
        title="Xác nhận xoá"
        setShow={setShowAlert}
        action={() => deletePetMutation.mutate({ id })}
      />
    </div>
  );
}

export const PetCard = QueryProvider(PetCardInner);

'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@/src/utils/hooks';
import { QUERY_KEYS, PET_SPECIES } from '@/src/utils/constants';
import { IAdminPetResponse, IAdminSearchFilter } from '@/src/interfaces/admin';
import { IApiResponse, IPaginationModel } from '@/src/interfaces/common';
import { getAdminPets, deactivatePet, activatePet } from '@/src/services/admin.api';
import { AxiosResponse } from 'axios';
import { AdminSearchBar } from './AdminSearchBar';
import { AdminStatusBadge } from './AdminStatusBadge';
import { AdminToggleButton } from './AdminToggleButton';
import Pagination from '@/src/components/ui/Pagination';
import { QueryProvider } from '../providers/QueryProvider';
import { formatDate } from '@/src/helpers/formatDate';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { ValueTextManager } from '@/src/utils/ValueTextManager';

const PAGE_SIZE = 10;

export const AdminPetsList = QueryProvider(() => {
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const paginationForm = useForm<IPaginationModel>({ defaultValues: { pageIndex: 1, pageNumber: 1 } });
  const pageIndex = paginationForm.watch('pageIndex');

  const { data, refetch, isLoading } = useQuery<IApiResponse<IAdminPetResponse[]>>(
    [QUERY_KEYS.ADMIN_PETS, pageIndex, keyword, statusFilter],
    () => getAdminPets({ pageIndex, pageSize: PAGE_SIZE, filter: { keyword: keyword || undefined, isActive: statusFilter } }),
    {
      onSuccess: (res: AxiosResponse<IApiResponse<IAdminPetResponse[]>>) => {
        const total = res.data.totalNumber ?? 0;
        paginationForm.setValue('pageNumber', Math.max(1, Math.ceil(total / PAGE_SIZE)));
      },
    }
  );

  const deactivateMutation = useMutation(deactivatePet, { onSuccess: () => refetch() });
  const activateMutation = useMutation(activatePet, { onSuccess: () => refetch() });

  const pets = (data as AxiosResponse<IApiResponse<IAdminPetResponse[]>>)?.data?.data ?? [];

  const handleSearch = (val: string) => {
    setKeyword(val);
    paginationForm.setValue('pageIndex', 1);
  };

  const handleStatusChange = (val: boolean | undefined) => {
    setStatusFilter(val);
    paginationForm.setValue('pageIndex', 1);
  };

  const handleToggle = async (pet: IAdminPetResponse) => {
    if (pet.isActive) {
      await deactivateMutation.mutateAsync(pet.id);
    } else {
      await activateMutation.mutateAsync(pet.id);
    }
  };

  return (
    <div>
      <AdminSearchBar
        value={keyword}
        onChange={handleSearch}
        placeholder="Tìm theo tên, giống loài..."
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên thú cưng</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Loài</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Giống</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Chủ sở hữu</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ngày tạo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    Không tìm thấy thú cưng nào.
                  </td>
                </tr>
              ) : (
                pets.map((pet) => (
                  <tr key={pet.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{pet.name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                      {ValueTextManager.PetSpecies.GetText(String(pet.species)) ?? 'Khác'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{pet.breed}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 truncate max-w-[110px]">{pet.ownerName}</span>
                        <a
                          href={`/user/${pet.ownerId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 hover:text-amber-500 transition-colors shrink-0"
                          title="Xem trang người dùng"
                        >
                          <FaExternalLinkAlt className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden lg:table-cell text-xs">{formatDate(pet.isCreatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <AdminStatusBadge isActive={pet.isActive} />
                        {pet.isAvailable && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-600">
                            Sẵn sàng
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/pet/${pet.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-amber-500 transition-colors"
                          title="Xem trang thú cưng"
                        >
                          <FaExternalLinkAlt className="w-3 h-3" />
                        </a>
                        <AdminToggleButton
                          isActive={pet.isActive}
                          onToggle={() => handleToggle(pet)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        paginationForm={paginationForm}
        disable={isLoading}
        show={paginationForm.watch('pageNumber') > 1}
      />
    </div>
  );
});

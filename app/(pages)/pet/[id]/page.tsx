import { Suspense } from 'react';
import {
  getPetAgeText,
  getPetColorText,
  getPetMedicalStatusText,
  getPetSexText,
  getPetSizeText,
  getPetSterilizedText,
} from '@/src/helpers/getPetTextDetails';
import { IPetDetailResponse } from '@/src/interfaces/pet';
import { getPetDetailServer } from '@/src/services/pet.server';
import { REPORT_ENTITY } from '@/src/utils/constants';
import { ValueTextManager } from '@/src/utils/ValueTextManager';
import PetDetailSkeleton from '@/src/components/ui/PetDetailSkeleton';
import SeeMore from '@/src/components/ui/SeeMore';
import Link from 'next/link';
import { FaHouseUser } from 'react-icons/fa';
import { FaShieldDog } from 'react-icons/fa6';
import { ReportBlock } from '@/src/components/ui/ReportBlock';
import { NoResultBackground } from '@/src/components/ui/NoResultBackground';
import { PetImageGallery } from '@/src/components/pet/PetImageGallery';

export default function PetDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<PetDetailSkeleton />}>
      <PetDetailContent petId={params.id} />
    </Suspense>
  );
}

async function PetDetailContent({ petId }: { petId: string }) {
  let petDetail: IPetDetailResponse;
  try {
    petDetail = await getPetDetailServer(petId);
  } catch {
    return <NoResultBackground className="h-fit-screen w-full items-center" />;
  }

  return (
    <div>
      <div className="container max-w-5xl mx-auto p-5 shadow-2xl rounded-2xl">
        <div className="grid md:grid-cols-2 grid-cols-1">
          <PetImageGallery images={petDetail.images} />

          <div className="md:pl-10">
            <div className="flex flex-row gap-2 mt-5 md:mt-0">
              <h1 test-id="pet-detail-name" className="font-bold text-4xl">
                {petDetail.name}
              </h1>
              {petDetail.isOrgOwned && (
                <span title="Cộng tác viên" className="flex items-center cursor-help">
                  <FaShieldDog color="green" size={25} />
                </span>
              )}
            </div>

            <div className="flex flex-col lg:flex-row mb-5 gap-2">
              <Link
                href={`/user/${petDetail.ownerId}`}
                className="w-fit flex items-center border border-black hover:bg-gray-100 p-3 px-8 rounded-full font-bold shadow-md lg:my-5"
              >
                <span className="mr-2">
                  <FaHouseUser size={30} />
                </span>
                Xem trang cá nhân
              </Link>
            </div>

            <div className="flex flex-col divide-y">
              <div className="flex flex-row py-2">
                <div className="w-1/3 font-bold">Loài</div>
                <div test-id="pet-detail-species" className="w-2/3">
                  <span>: </span>
                  {ValueTextManager.PetSpecies.GetText(petDetail.species.toString()) ?? 'Không rõ'}
                </div>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-1/3 font-bold">Giống</div>
                <div test-id="pet-detail-breed" className="w-2/3">
                  <span>: </span>
                  {petDetail.breed}
                </div>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-1/3 font-bold">Giới tính</div>
                <div test-id="pet-detail-sex" className="w-2/3">
                  <span>: </span>
                  {getPetSexText(petDetail.sex)}
                </div>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-1/3 font-bold">Tuổi</div>
                <div className="w-2/3" test-id="pet-detail-age">
                  <span>: </span>
                  {getPetAgeText(petDetail.age)} tuổi
                </div>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-1/3 font-bold">Kích thước</div>
                <div className="w-2/3" test-id="pet-detail-size">
                  <span>: </span>
                  {getPetSizeText(petDetail.size)}
                </div>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-1/3 font-bold">Màu</div>
                <div className="w-2/3" test-id="pet-detail-color">
                  <span>: </span>
                  {getPetColorText(petDetail.color)}
                </div>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-1/3 font-bold">Tiêm chủng</div>
                <div className="w-2/3" test-id="pet-detail-vaccine">
                  <span>: </span>
                  {getPetMedicalStatusText(petDetail.isVaccinated)}
                </div>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-1/3 font-bold">Vắc xin đã tiêm</div>
                <div className="w-2/3">
                  <span>: </span>
                  {petDetail.vaccines.length === 0
                    ? 'Chưa rõ'
                    : petDetail.vaccines.map((v) => v.name).join(', ')}
                </div>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-1/3 font-bold">Triệt sản</div>
                <div className="w-2/3" test-id="pet-detail-spay">
                  <span>: </span>
                  {getPetSterilizedText(petDetail.isSterilized)}
                </div>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-1/3 font-bold">Địa chỉ</div>
                <div className="w-2/3" test-id="pet-detail-address">
                  <span>: </span>
                  {petDetail.address}
                </div>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-1/3 font-bold">Ngày đăng</div>
                <div className="w-2/3">
                  <span>: </span>
                  {new Date(petDetail.isCreatedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-row py-2">
                <div className="w-1/3 font-bold">Đôi nét</div>
                <div className="w-2/3">
                  <span>: </span>
                  {petDetail.description}
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end mt-3">
              <ReportBlock id={petId} type={REPORT_ENTITY.Pet} />
            </div>
          </div>
        </div>
      </div>

      <SeeMore petList={petDetail.seeMore} />
    </div>
  );
}

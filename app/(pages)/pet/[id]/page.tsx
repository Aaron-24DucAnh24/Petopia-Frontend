import { Suspense } from 'react';
import {
  getPetAgeText,
  getPetColorText,
  getPetSexText,
  getPetSizeText,
} from '@/src/helpers/getPetTextDetails';
import { IPetDetailResponse } from '@/src/interfaces/pet';
import { getPetDetailServer } from '@/src/services/pet.server';
import { getOtherUserServer } from '@/src/services/user.server';
import { PET_MEDICAL_STATUS, REPORT_ENTITY, STATIC_URLS } from '@/src/utils/constants';
import { ValueTextManager } from '@/src/utils/ValueTextManager';
import PetDetailSkeleton from '@/src/components/ui/PetDetailSkeleton';
import SeeMore from '@/src/components/ui/SeeMore';
import Link from 'next/link';
import Image from 'next/image';
import { FaShieldDog } from 'react-icons/fa6';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSyringe,
  FaCut,
  FaArrowRight,
} from 'react-icons/fa';
import { MdPets } from 'react-icons/md';
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

  let ownerImage: string = STATIC_URLS.NO_AVATAR;
  try {
    const ownerInfo = await getOtherUserServer(petDetail.ownerId);
    ownerImage = ownerInfo.image || STATIC_URLS.NO_AVATAR;
  } catch {
    // owner info is optional; page still renders
  }

  const isVaccinated = petDetail.isVaccinated === PET_MEDICAL_STATUS.YES;
  const isSterillized = petDetail.isSterillized === PET_MEDICAL_STATUS.YES;

  const sexBadgeClass =
    petDetail.sex === 0
      ? 'bg-blue-100 text-blue-700'
      : petDetail.sex === 1
        ? 'bg-pink-100 text-pink-700'
        : 'bg-gray-100 text-gray-600';

  return (
    <div className="py-6 space-y-5">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
          {/* Left: image gallery */}
          <PetImageGallery images={petDetail.images} />

          {/* Right: details */}
          <div className="flex flex-col gap-4">
            {/* Availability badge + name */}
            <div>
              <span
                className={`inline-block text-xs font-semibold px-3 py-0.5 rounded-full mb-2 ${petDetail.isAvailable
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                  }`}
              >
                {petDetail.isAvailable ? 'Đang tìm nhà' : 'Đã có nhà'}
              </span>

              <div className="flex items-center gap-2">
                <h1
                  test-id="pet-detail-name"
                  className="text-3xl font-bold text-gray-900"
                >
                  {petDetail.name}
                </h1>
                {petDetail.isOrgOwned && (
                  <span title="Cộng tác viên" className="cursor-help">
                    <FaShieldDog color="green" size={22} />
                  </span>
                )}
              </div>
            </div>

            {/* Quick-scan attribute chips */}
            <div className="flex flex-wrap gap-2">
              <span
                test-id="pet-detail-species"
                className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700"
              >
                {ValueTextManager.PetSpecies.GetText(
                  petDetail.species.toString()
                ) ?? 'Không rõ'}
              </span>
              <span
                test-id="pet-detail-sex"
                className={`px-3 py-1 rounded-full text-sm font-medium ${sexBadgeClass}`}
              >
                {getPetSexText(petDetail.sex)}
              </span>
              <span
                test-id="pet-detail-age"
                className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700"
              >
                {getPetAgeText(petDetail.age)} tuổi
              </span>
              <span
                test-id="pet-detail-size"
                className="px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700"
              >
                {getPetSizeText(petDetail.size)}
              </span>
            </div>

            {/* Breed + Color mini-cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-0.5">Giống</div>
                <div
                  test-id="pet-detail-breed"
                  className="font-semibold text-gray-800 truncate"
                >
                  {petDetail.breed}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-0.5">Màu lông</div>
                <div
                  test-id="pet-detail-color"
                  className="font-semibold text-gray-800"
                >
                  {getPetColorText(petDetail.color)}
                </div>
              </div>
            </div>

            {/* Location + date */}
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt
                  className="mt-0.5 flex-shrink-0 text-red-400"
                  size={14}
                />
                <span test-id="pet-detail-address">{petDetail.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt
                  className="flex-shrink-0 text-gray-400"
                  size={14}
                />
                <span>
                  Đăng ngày{' '}
                  {new Date(petDetail.isCreatedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Health status cards */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`rounded-xl p-3 flex items-center gap-2 ${isVaccinated ? 'bg-green-50' : 'bg-red-50'}`}
              >
                <FaSyringe
                  size={16}
                  className={isVaccinated ? 'text-green-500' : 'text-red-400'}
                />
                <div>
                  <div className="text-xs text-gray-400">Tiêm chủng</div>
                  <div
                    test-id="pet-detail-vaccine"
                    className={`text-sm font-semibold ${isVaccinated ? 'text-green-700' : 'text-red-600'}`}
                  >
                    {isVaccinated ? 'Đã tiêm' : 'Chưa tiêm'}
                  </div>
                </div>
              </div>
              <div
                className={`rounded-xl p-3 flex items-center gap-2 ${isSterillized ? 'bg-green-50' : 'bg-orange-50'}`}
              >
                <FaCut
                  size={16}
                  className={isSterillized ? 'text-green-500' : 'text-orange-400'}
                />
                <div>
                  <div className="text-xs text-gray-400">Triệt sản</div>
                  <div
                    test-id="pet-detail-spay"
                    className={`text-sm font-semibold ${isSterillized ? 'text-green-700' : 'text-orange-600'}`}
                  >
                    {isSterillized ? 'Đã triệt sản' : 'Chưa triệt sản'}
                  </div>
                </div>
              </div>
            </div>

            {/* Vaccine tags */}
            {petDetail.vaccines.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {petDetail.vaccines.map((v) => (
                  <span
                    key={v.id}
                    className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-100"
                  >
                    {v.name}
                  </span>
                ))}
              </div>
            )}

            {/* Owner link */}
            <Link
              href={`/user/${petDetail.ownerId}`}
              className="flex items-center gap-3 border border-gray-200 hover:bg-gray-50 py-2.5 px-4 rounded-full font-semibold text-gray-700 transition-colors shadow-sm"
            >
              <Image
                src={ownerImage}
                alt="owner"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
              />
              <span className="flex-1">Xem trang cá nhân</span>
              <FaArrowRight size={14} className="text-gray-400" />
            </Link>

            {/* Report */}
            <div className="flex justify-end">
              <ReportBlock id={petId} type={REPORT_ENTITY.Pet} />
            </div>
          </div>
        </div>

        {/* Description */}
        {petDetail.description && (
          <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="flex items-center gap-2 font-bold text-lg mb-3 text-amber-800">
              <MdPets size={20} />
              Đôi nét về {petDetail.name}
            </div>
            <p className="text-gray-700 leading-relaxed">{petDetail.description}</p>
          </div>
        )}
      </div>

      <SeeMore petList={petDetail.seeMore} />
    </div>
  );
}

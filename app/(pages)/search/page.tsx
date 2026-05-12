import { SearchPetSection } from '@/src/components/search/SearchPetSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tìm kiếm - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default function page() {
  return (
    <div className="container mx-auto">
      <SearchPetSection />
    </div>
  );
}

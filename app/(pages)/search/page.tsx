import { SearchPetSection } from '@/src/components/search/SearchPetSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tìm kiếm - Petopia',
  description: 'Nền tảng nhận nuôi thú cưng trực tuyến',
};

export default function page() {
  return (
    <div className="container mx-auto">
      <SearchPetSection />
    </div>
  );
}

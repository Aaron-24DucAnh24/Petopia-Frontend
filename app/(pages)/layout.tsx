import { Navbar } from '@/src/components/layout/navbar';
import { Footer } from '@/src/components/layout/Footer';
import { StoreHydrator } from '@/src/components/providers/StoreHydrator';
import { getCurrentUserCoreServer } from '@/src/services/user.server';

export default async function PagesLayout({ children }: { children: React.ReactNode }) {
  const userContext = await getCurrentUserCoreServer();
  return (
    <div className="flex flex-col min-h-screen">
      <StoreHydrator userContext={userContext} />
      <Navbar userContext={userContext} />
      <div className="mt-20 flex-1">{children}</div>
      <Footer />
    </div>
  );
}

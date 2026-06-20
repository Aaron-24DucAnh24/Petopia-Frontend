import { Navbar } from '@/src/components/layout/navbar';
import { Footer } from '@/src/components/layout/Footer';
import { StoreHydrator } from '@/src/components/providers/StoreHydrator';
import { RealTimeProvider } from '@/src/components/providers/RealTimeProvider';
import { getCurrentUserCoreServer } from '@/src/services/user.server';
import { getNotificationsServer } from '@/src/services/notification.server';

export default async function PagesLayout({ children }: { children: React.ReactNode }) {
  const userContext = await getCurrentUserCoreServer();
  const notifications = userContext ? await getNotificationsServer() : null;
  return (
    <div className="flex flex-col min-h-screen">
      <StoreHydrator userContext={userContext} />
      <RealTimeProvider userContext={userContext} />
      <Navbar userContext={userContext} notifications={notifications ?? []} />
      <div className="mt-20 flex-1">{children}</div>
      <Footer />
    </div>
  );
}

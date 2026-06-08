import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div test-id="authentication-layout">{children}</div>;
}

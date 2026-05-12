import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className='h-dvh'>
        {children}
      </body>
    </html>
  );
}

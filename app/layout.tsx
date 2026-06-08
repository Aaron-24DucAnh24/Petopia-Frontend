import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';
import './datepicker.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

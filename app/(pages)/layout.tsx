import { Inter } from 'next/font/google';
import '../globals.css';
import '../datepicker.css';
import { Navbar } from '@/src/components/common/navigator';
import { Footer } from '@/src/components/common/general/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="mt-20">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

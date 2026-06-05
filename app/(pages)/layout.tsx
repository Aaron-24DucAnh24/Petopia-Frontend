import { Inter } from 'next/font/google';
import '../globals.css';
import '../datepicker.css';
import { Navbar } from '@/src/components/layout/navbar';
import { Footer } from '@/src/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Navbar />
        <div className="mt-20 flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

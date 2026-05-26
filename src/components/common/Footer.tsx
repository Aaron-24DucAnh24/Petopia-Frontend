import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-orange-50 rounded-t-3xl shadow mt-10">
      <div className="w-full max-w-screen-xl mx-auto px-4 py-5 flex flex-col items-center gap-3">
        <div className="text-2xl font-semibold">
          <span className="text-yellow-300">Pet</span>opia
        </div>
        <ul className="flex flex-row items-center gap-6 font-medium text-gray-500 text-sm">
          <li>
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Bài đăng
            </Link>
          </li>
          <li>
            <Link href="/search" className="hover:text-gray-700 transition-colors">
              Thú cưng
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-gray-700 transition-colors">
              Blog
            </Link>
          </li>
        </ul>
        <hr className="w-full border-gray-200" />
        <span className="text-xs text-gray-400 text-center">
          © 2026{' '}
          <Link href="/" className="hover:underline">
            Petopia™
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

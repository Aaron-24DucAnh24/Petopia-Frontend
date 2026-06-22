'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaChartBar,
  FaUsers,
  FaDog,
  FaNewspaper,
  FaBook,
  FaCreditCard,
  FaFlag,
  FaBuilding,
  FaSignOutAlt,
  FaEnvelope,
} from 'react-icons/fa';

const NAV_ITEMS = [
  { href: '/admin', label: 'Tổng quan', icon: FaChartBar },
  { href: '/admin/users', label: 'Người dùng', icon: FaUsers },
  { href: '/admin/pets', label: 'Thú cưng', icon: FaDog },
  { href: '/admin/posts', label: 'Bài đăng', icon: FaNewspaper },
  { href: '/admin/blogs', label: 'Blog', icon: FaBook },
  { href: '/admin/payments', label: 'Thanh toán', icon: FaCreditCard },
  { href: '/admin/reports', label: 'Báo cáo', icon: FaFlag },
  { href: '/admin/upgrades', label: 'Xác minh tổ chức', icon: FaBuilding },
  { href: '/admin/email-templates', label: 'Mẫu email', icon: FaEnvelope },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-gray-900 flex flex-col z-40">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-700">
        <span className="text-2xl">🐾</span>
        <span className="text-white font-bold text-lg tracking-wide">Petopia Admin</span>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
              isActive(href)
                ? 'bg-amber-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-700 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-2 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
        >
          <FaSignOutAlt className="w-4 h-4" />
          Về trang chủ
        </Link>
      </div>
    </aside>
  );
}

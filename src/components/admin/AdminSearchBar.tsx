'use client';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface IAdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  statusFilter?: boolean | undefined;
  onStatusChange?: (value: boolean | undefined) => void;
}

const STATUS_OPTIONS: { label: string; value: boolean | undefined }[] = [
  { label: 'Tất cả', value: undefined },
  { label: 'Hoạt động', value: true },
  { label: 'Vô hiệu', value: false },
];

export function AdminSearchBar({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  statusFilter,
  onStatusChange,
}: IAdminSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {onStatusChange && (
        <div className="flex gap-1.5 items-center">
          {STATUS_OPTIONS.map(({ label, value: optVal }) => (
            <button
              key={String(optVal)}
              onClick={() => onStatusChange(optVal)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === optVal
                  ? 'bg-yellow-300 text-black'
                  : 'text-gray-600 hover:bg-yellow-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

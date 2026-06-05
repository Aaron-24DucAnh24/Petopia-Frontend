'use client';
import { Dispatch, SetStateAction } from 'react';

interface ISortBlock {
  orderBy: 'newest' | 'popular';
  setOrderBy: Dispatch<SetStateAction<'newest' | 'popular'>>;
  disable: boolean;
}

export const SortBlock = ({ orderBy, setOrderBy, disable }: ISortBlock) => {
  const options = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'popular', label: 'Phổ biến' },
  ] as const;

  return (
    <div className="flex rounded-full bg-gray-100 p-1 gap-1">
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          disabled={disable}
          onClick={() => !disable && value !== orderBy && setOrderBy(value)}
          className={`text-sm px-4 py-1.5 rounded-full font-medium transition-all disabled:cursor-not-allowed ${
            orderBy === value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

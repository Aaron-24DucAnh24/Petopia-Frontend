'use client';
import { useRef, useState } from 'react';
import { useClickOutside } from '@/src/utils/hooks';

interface IOption {
  id: string;
  name: string;
}

interface IMultiSelectDropdown {
  label: string;
  options: IOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  error?: string;
}

export const MultiSelectDropdown = ({ label, options, value, onChange, error }: IMultiSelectDropdown) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useClickOutside(() => setIsOpen(false), [buttonRef, listRef]);

  const toggle = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    );
  };

  const selectedLabel = value.length > 0
    ? options.filter((o) => value.includes(o.id)).map((o) => o.name).join(', ')
    : label;

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        <button
          type="button"
          ref={buttonRef}
          onClick={() => setIsOpen((o) => !o)}
          className={`relative flex flex-row items-center justify-between w-full text-sm font-medium text-black border rounded-lg px-4 py-2.5 focus:ring-4 focus:outline-none focus:ring-blue-300 ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-slate-100'}`}
        >
          <span className="truncate text-left">{selectedLabel}</span>
          <svg className="w-2.5 h-2.5 ml-3 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
        </button>

        {isOpen && (
          <div
            ref={listRef}
            className="absolute z-10 w-full bg-white rounded-lg shadow top-full mt-1"
          >
            <ul className="p-3 space-y-1 text-sm text-gray-700 max-h-48 overflow-y-auto">
              {options.map((option) => (
                <li key={option.id}>
                  <label className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.id}
                      checked={value.includes(option.id)}
                      onChange={() => toggle(option.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span>{option.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

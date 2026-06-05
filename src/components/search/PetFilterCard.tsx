'use client';
import { IPetFilter } from '@/src/interfaces/pet';

interface IPetFilterCard {
  filter: IPetFilter;
  disabled: boolean;
  currentValues: (number | string)[];
  onToggle: (value: number | string) => void;
  isMobile: boolean;
}

export const PetFilterCard = ({ filter, disabled, currentValues, onToggle, isMobile }: IPetFilterCard) => {
  return (
    <div className={`${isMobile ? 'border-t border-gray-100 px-4 py-5' : 'border-b border-gray-100 py-5'}`}>
      <p className="text-sm font-semibold text-gray-900 mb-3">{filter.label}</p>
      <div className="flex flex-wrap gap-2">
        {filter.items.map((item) => {
          const isChecked = currentValues.includes(item.value as number & string);
          return (
            <button
              test-id="filter-card"
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(item.value)}
              className={`text-sm px-3 py-1 rounded-full border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isChecked
                  ? 'bg-orange-50 text-orange-700 border-orange-300 font-medium'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-200 hover:text-orange-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

import { IApiErrorResponse } from '@/src/interfaces/common';
import { useClickOutside } from '@/src/utils/hooks';
import { AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { BsStars } from 'react-icons/bs';
import { UseQueryResult } from 'react-query';

interface IFilterDropDownOption {
  label: string;
  value: string;
}

interface IFilterDropDown {
  testId?: string;
  options: IFilterDropDownOption[];
  value: string;
  setValue: (value: string) => void;
  title?: string;
  disabled?: boolean;
}

export const FilterDropDown = (props: IFilterDropDown) => {
  const {
    title = '',
    options,
    value,
    setValue,
    disabled,
  } = props;

  // STATES
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>('');
  const [displayedOptions, setDisplayedOptions] =
    useState<IFilterDropDownOption[]>(options);

  // EFFECTS
  const listRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLInputElement>(null);
  useClickOutside(() => {
    setShowDropdown(false);
  }, [listRef, buttonRef]);

  useEffect(() => {
    if (value) {
      const currentOptions = options.filter((e) => e.value === value);
      currentOptions.length && setFilterText(currentOptions[0].label);
    } else {
      setFilterText('Không rõ');
    }
  }, [value]);

  useEffect(() => {
    if (options.filter((e) => e.label === filterText).length) {
      setDisplayedOptions(options);
    } else {
      const newOptions = options.filter((e) =>
        e.label.toLowerCase().includes(filterText.toLowerCase())
      );
      setDisplayedOptions(newOptions);
    }
  }, [filterText]);

  useEffect(() => {
    setDisplayedOptions(options);
  }, [options]);

  return (
    <div className="relative inline-block text-left">
      {title && (
        <div className="text-sm flex font-medium mb-2">
          {title}
        </div>
      )}
      {showDropdown && options.length !== 0 && (
        <div
          ref={listRef}
          className="w-full absolute text-center max-h-80 overflow-y-auto mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 "
        >
          <div className="py-1" role="menu">
            {displayedOptions.map((option, index) => (
              <div
                test-id="dropdown-option"
                key={index}
                className="block px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer"
                role="menuitem"
                onClick={() => {
                  setValue(option.value);
                  setShowDropdown(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

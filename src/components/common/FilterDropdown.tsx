import { useClickOutside } from '@/src/utils/hooks';
import { useEffect, useRef, useState } from 'react';

interface IFilterDropDownOption {
  label: string;
  value: string;
}

interface IFilterDropDown {
  options: IFilterDropDownOption[];
  value: string;
  setValue: (value: string) => void;
}

export const FilterDropDown = (props: IFilterDropDown) => {
  const {
    options,
    value,
    setValue,
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
    <div className="flex w-full">
      <div>
        {value}
      </div>
      <div
        ref={listRef}
        className="w-full absolute text-center max-h-80 overflow-y-auto mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ">
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
              }}>
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

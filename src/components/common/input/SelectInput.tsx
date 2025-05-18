import { ValueText } from '@/src/utils/ValueText';
import { useEffect, useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { ClipLoader } from 'react-spinners';

interface ISelectInput {
  id?: string;
  onChange: (value: string) => void;
  options: ValueText;
  defaultValue: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
}

export const SelectInput = (props: ISelectInput) => {
  const {
    id,
    onChange,
    options,
    defaultValue,
    isDisabled = false,
    isLoading = false,
    isClearable = true,
  } = props;

  // States
  const [keywords, setKeywords] = useState<string | undefined>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Handlers
  const handleSelect = (value: string, text: string) => {
    onChange(value);
    setKeywords(text);
    setIsFocused(false);
  };

  const filteredOptions = options.valueTextMap.filter((option) =>
    keywords
      ? option.text.toLowerCase().includes(keywords.toLowerCase())
      : option
  );

  // Effects
  useEffect(() => {
    setKeywords(options.GetText(defaultValue));
  }, [options]);

  return (
    <div className="relative">
      {!isLoading ? (
        <input
          id={id}
          className='border-gray-300 border bg-gray-50 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:border-yellow-400 focus:outline-none focus:ring-0 focus:bg-white'
          value={keywords}
          disabled={isDisabled}
          onChange={(e) => setKeywords(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)} />
      ) : (
        <span className='border-gray-300 border bg-gray-50 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight'>
          <ClipLoader
            color="#000000"
            loading={isLoading}
            size={14}
            aria-label="Loading Spinner"
            data-testid="loader" />
        </span>
      )}

      {
        !isLoading && isClearable && (
          <span
            className="absolute right-3 top-3 cursor-pointer hover:text-yellow-500"
            onClick={() => handleSelect('', '')}>
            <IoMdCloseCircle size={16} />
          </span>
        )
      }

      {!isLoading && isFocused && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-md max-h-48 overflow-y-auto">
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              className="px-3 py-2 cursor-pointer hover:bg-yellow-100"
              onClick={() => handleSelect(option.value, option.text)}>
              {option.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

import OriginalDatePicker, { registerLocale } from 'react-datepicker';
import { vi } from 'date-fns/locale/vi';
import { useRef } from 'react';
import { SlCalender } from 'react-icons/sl';
registerLocale('vi', vi);

interface IDatePicker {
  id: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  locale?: string;
  require?: boolean;
}

export const DatePicker = (props: IDatePicker) => {
  const { id, value, onChange, locale = 'vi', require = false } = props;
  const currentDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(currentDate.getFullYear() - 100);
  const inputRef = useRef<OriginalDatePicker>(null);

  return (
    <div className='relative'>
      <OriginalDatePicker
        id={id}
        ref={inputRef}
        className={'border-gray-300 border bg-gray-50 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:border-yellow-400 focus:outline-none focus:ring-0 focus:bg-white'}
        selected={value}
        locale={locale}
        required={require}
        onChange={(date) => onChange(date)}
        showYearDropdown
        scrollableYearDropdown
        maxDate={currentDate}
        minDate={minDate}
        yearDropdownItemNumber={100}
        dateFormat="yyyy/MM/dd" />
      <span
        className="absolute right-3 top-3 cursor-pointer hover:text-yellow-500"
        onClick={() => inputRef.current?.onInputClick()}>
        <SlCalender size={16} />
      </span>
    </div>
  );
};
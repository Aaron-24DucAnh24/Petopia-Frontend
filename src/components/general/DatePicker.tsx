import OriginalDatePicker, { registerLocale } from 'react-datepicker';
import { vi } from 'date-fns/locale/vi';
registerLocale('vi', vi);

interface IDatePicker {
  className: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  locale?: string;
  require?: boolean;
}

export const DatePicker = (props: IDatePicker) => {
  const { className, value, onChange, locale = 'vi', require = false } = props;
  const currentDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(currentDate.getFullYear() - 100);

  return (
    <OriginalDatePicker
      className={className}
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
  );
};
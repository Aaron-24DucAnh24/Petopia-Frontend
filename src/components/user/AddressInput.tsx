import { LOCATION_LEVEL } from '@/src/utils/constants';
import { SelectInput } from '../common/input/SelectInput';
import { ValueText } from '@/src/utils/ValueText';

interface IAddressInput {
  testId: string;
  options: ValueText;
  onChange: (level: LOCATION_LEVEL, code: string) => void;
  value: string;
  level: number;
  isLoading: boolean;
}

export const AddressInput = (props: IAddressInput) => {
  const {
    options,
    onChange,
    level,
    value,
    isLoading,
  } = props;

  // HANDLERS
  const handleOnChange = (value: string) => {
    onChange(level, value);
  };

  return (
    options && <SelectInput
      onChange={handleOnChange}
      options={options}
      defaultValue={value}
      isLoading={isLoading} />
  );
};

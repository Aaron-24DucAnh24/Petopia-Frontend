import { LOCATION_LEVEL } from '@/src/utils/constants';
import { ValueText } from '@/src/utils/ValueText';
import { SelectInput } from './SelectInput';

interface IAddressInput {
  testId: string;
  options: ValueText;
  onChange: (level: LOCATION_LEVEL, code: string) => void;
  value: string;
  level: number;
  isLoading: boolean;
}

export const AddressInput = (props: IAddressInput) => {
  const { options, onChange, level, value, isLoading } = props;

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

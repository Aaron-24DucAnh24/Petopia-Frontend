import { UseFormReturn } from 'react-hook-form';
import { IPaginationModel } from '../../interfaces/common';
import { useEffect } from 'react';

interface IPagination {
  paginationForm: UseFormReturn<IPaginationModel, any, IPaginationModel>;
  disable: boolean;
  show: boolean;
}

export default function Pagination(props: IPagination) {
  const { getValues, setValue, watch } = props.paginationForm;
  const { disable, show } = props;

  const handleClickNavigate = (action: 'up' | 'down') => {
    const pageIndex = getValues('pageIndex');
    const pageNumber = getValues('pageNumber');
    if (action == 'up' && pageIndex < pageNumber)
      setValue('pageIndex', pageIndex + 1);
    if (action == 'down' && pageIndex > 1) setValue('pageIndex', pageIndex - 1);
  };

  const handleClickValue = (value: number) => {
    const pageIndex = getValues('pageIndex');
    const pageNumber = getValues('pageNumber');
    if (value >= 1 && value <= pageNumber && value != pageIndex)
      !disable && setValue('pageIndex', value);
  };

  const getBlocks = (pageIndex: number, pageNumber: number) => {
    const result: any[] = [];
    for (let i = 1; i <= pageNumber; i += 1) {
      if (i === pageIndex) {
        result.push(
          <li key={i}>
            <a
              className="flex items-center justify-center w-9 h-9 rounded-full text-gray-800 font-bold bg-amber-300 hover:bg-amber-400 transition-colors select-none cursor-pointer"
              onClick={() => handleClickValue(i)}
            >
              {i}
            </a>
          </li>
        );
      } else {
        result.push(
          <li key={i}>
            <a
              className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 font-medium hover:bg-gray-100 hover:text-gray-700 transition-colors select-none cursor-pointer"
              onClick={() => handleClickValue(i)}
            >
              {i}
            </a>
          </li>
        );
      }
    }
    return result;
  };

  useEffect(() => { }, [watch('pageIndex')]);

  return show ? (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="inline-flex items-center space-x-1 text-sm">
          <li>
            <a
              className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer select-none"
              onClick={() => handleClickNavigate('down')}
            >
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
              </svg>
            </a>
          </li>

          {getBlocks(getValues('pageIndex'), getValues('pageNumber'))}

          <li>
            <a
              className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer select-none"
              onClick={() => handleClickNavigate('up')}
            >
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  ) : (
    <></>
  );
}

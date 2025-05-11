import React from 'react';
import { ClipLoader } from 'react-spinners';

export default function QueryButton({
  testId,
  name,
  isLoading,
  action = undefined,
  isDisabled = false
}: {
  testId?: string;
  name: string;
  isLoading: boolean;
  action?: () => void;
  isDisabled?: boolean;
}) {
  return (
    <button
      test-id={testId}
      type={action ? 'button' : 'submit'}
      className={`w-full text-black ${isDisabled ? 'bg-gray-200' : 'bg-yellow-300 hover:bg-yellow-500'} font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
      onClick={() => action && action()}
      disabled={isLoading || isDisabled}
    >
      {name}
      <span>
        <ClipLoader
          color={'#000000'}
          loading={isLoading}
          size={14}
          aria-label="Loading Spinner"
          data-testid="loader" />
      </span>
    </button>
  );
}

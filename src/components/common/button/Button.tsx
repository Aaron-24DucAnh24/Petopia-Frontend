import React from 'react';
import { ClipLoader } from 'react-spinners';

export default function Button({
  name,
  isLoading = false,
  action = undefined
}: {
  name: string;
  isLoading?: boolean;
  action?: () => void;
}) {
  return (
    <button
      type={action ? 'button' : 'submit'}
      className="w-full text-black bg-white border border-black hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      onClick={() => action && action()}
      disabled={isLoading}
    >
      {name}
      <span className="ml-2">
        <ClipLoader
          color={'#000000'}
          loading={isLoading}
          size={14}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </span>
    </button>
  );
}

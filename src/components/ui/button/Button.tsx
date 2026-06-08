import React from 'react';
import { ClipLoader } from 'react-spinners';

type ButtonVariant = 'default' | 'danger';

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  default: 'w-full text-black bg-white border border-black hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center',
  danger: 'text-sm text-red-500 hover:text-red-700 underline px-2',
};

export default function Button({
  name,
  isLoading = false,
  action = undefined,
  variant = 'default',
}: {
  name: string;
  isLoading?: boolean;
  action?: () => void;
  variant?: ButtonVariant;
}) {
  return (
    <button
      type={action ? 'button' : 'submit'}
      className={VARIANT_STYLES[variant]}
      onClick={() => action && action()}
      disabled={isLoading}
    >
      {name}
      {variant === 'default' && (
        <span className="ml-2">
          <ClipLoader
            color={'#000000'}
            loading={isLoading}
            size={14}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </span>
      )}
    </button>
  );
}

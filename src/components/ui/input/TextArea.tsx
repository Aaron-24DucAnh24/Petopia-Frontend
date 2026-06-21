interface ITextArea {
  id: string;
  className?: string;
  containerClassName?: string;
  errorClassName?: string;
  rows?: number;
  onChange: (value: string) => void;
  value: string;
  error?: string;
  disabled?: boolean;
}

export const TextArea = (props: ITextArea) => {
  const {
    id,
    className,
    containerClassName,
    errorClassName,
    rows = 3,
    onChange,
    value,
    error,
    disabled = false,
  } = props;

  return (
    <div className={containerClassName || 'flex flex-col'}>
      <textarea
        id={id}
        rows={rows}
        className={className
          || `${disabled ? 'bg-gray-300' : 'bg-gray-50'} border-gray-300 border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:border-yellow-400 focus:outline-none focus:ring-0 focus:bg-white resize-y`}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        disabled={disabled}
      />
      <span className={errorClassName || 'text-sm text-red-500 mt-2'}>
        {error}
      </span>
    </div>
  );
};

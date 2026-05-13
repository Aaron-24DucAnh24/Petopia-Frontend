import { IoAdd } from 'react-icons/io5';

export function AddButton({ onClick, title }: { onClick: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-400 hover:bg-orange-500 text-white transition-colors shadow-sm"
    >
      <IoAdd size={20} />
    </button>
  );
}

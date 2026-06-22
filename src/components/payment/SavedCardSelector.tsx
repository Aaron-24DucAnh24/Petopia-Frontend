'use client';
import Image from 'next/image';
import { ISavedCardResponse } from '@/src/interfaces/payment';
import { FaTrash, FaCreditCard, FaPlus } from 'react-icons/fa';

interface SavedCardSelectorProps {
  cards: ISavedCardResponse[];
  selectedToken: string | null;
  onSelect: (token: string | null) => void;
  onDelete: (token: string) => void;
  isDeleting?: boolean;
}

export default function SavedCardSelector({
  cards,
  selectedToken,
  onSelect,
  onDelete,
  isDeleting,
}: SavedCardSelectorProps) {
  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">Thẻ đã lưu</p>
        <span className="text-xs text-gray-400">{cards.length}/5 thẻ đã lưu</span>
      </div>

      {cards.map((card) => (
        <div
          key={card.token}
          onClick={() => onSelect(card.token)}
          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
            selectedToken === card.token
              ? 'border-yellow-400 bg-yellow-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 flex items-center justify-center">
              {card.imageUrl ? (
                <Image src={card.imageUrl} alt={card.cardType} width={44} height={24} className="object-contain" />
              ) : (
                <FaCreditCard className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {card.cardType} **** {card.last4}
              </p>
              <p className="text-xs text-gray-400">
                {card.cardholderName} &middot; {card.expirationMonth}/{card.expirationYear}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!isDeleting && confirm('Bạn có chắc muốn xóa thẻ này?')) {
                onDelete(card.token);
              }
            }}
            className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
            title="Xóa thẻ"
          >
            <FaTrash className="w-3 h-3" />
          </button>
        </div>
      ))}

      <div
        onClick={() => onSelect(null)}
        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
          selectedToken === null
            ? 'border-yellow-400 bg-yellow-50'
            : 'border-gray-200 hover:bg-gray-50'
        }`}
      >
        <div className="w-10 h-7 flex items-center justify-center">
          <FaPlus className="w-4 h-4 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600">Sử dụng thẻ mới</p>
      </div>
    </div>
  );
}

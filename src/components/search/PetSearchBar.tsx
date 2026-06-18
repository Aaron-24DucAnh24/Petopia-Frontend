'use client';
import { IApiResponse } from '@/src/interfaces/common';
import { getKeywords } from '@/src/services/pet.api';
import { QUERY_KEYS } from '@/src/utils/constants';
import { useClickOutside, useQuery } from '@/src/utils/hooks';
import { useEffect, useRef, useState } from 'react';
import { IoSearchOutline as SearchIcon } from 'react-icons/io5';

interface IPetSearchBar {
  text: string;
  onSearch: (text: string) => void;
  disable: boolean;
}

export function PetSearchBar({ text: textProp, onSearch, disable }: IPetSearchBar) {
  const [text, setText] = useState<string>(textProp);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [showedKeywords, setShowedKeywords] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useQuery<IApiResponse<string[]>>(
    [QUERY_KEYS.GET_KEYWORDS],
    getKeywords,
    {
      onSuccess: (res) => setKeywords(res.data.data),
      refetchOnWindowFocus: false,
    }
  );

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useClickOutside(() => setShowDropdown(false), [listRef, inputRef]);

  // Sync URL-driven text changes (e.g. filter chip clears text)
  useEffect(() => {
    setText(textProp);
  }, [textProp]);

  useEffect(() => {
    const temp = keywords.filter((k) =>
      k.toLowerCase().includes(text.toLowerCase())
    );
    setShowedKeywords(temp);
  }, [text, keywords]);

  const handleSelect = (keyword: string) => {
    if (!disable) {
      onSearch(keyword);
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(text);
      setShowDropdown(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="relative w-full">
        <label htmlFor="text-search" className="absolute top-1/2 -translate-y-1/2 left-4 pointer-events-none">
          <SearchIcon className="text-gray-400" size={18} />
        </label>
        <input
          type="search"
          ref={inputRef}
          id="text-search"
          className="block w-full py-3 pl-11 pr-4 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
          placeholder="Tìm kiếm thú cưng..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onClick={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
        />
        {showDropdown && showedKeywords.length > 0 && (
          <div
            ref={listRef}
            className="w-full absolute mt-2 rounded-2xl shadow-lg z-50 bg-white border border-gray-100 overflow-hidden max-h-64 overflow-y-auto"
          >
            {showedKeywords.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 cursor-pointer transition-colors"
                onClick={() => handleSelect(keyword)}
              >
                <SearchIcon size={14} className="text-gray-400 flex-shrink-0" />
                {keyword}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

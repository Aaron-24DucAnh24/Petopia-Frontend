'use client';
import Link from 'next/link';
import { useClickOutside } from '@/src/utils/hooks';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { SlOptions } from 'react-icons/sl';
import { FiEdit2, FiLock, FiAward } from 'react-icons/fi';

interface IUserActionsBlock {
  setShowEdit: Dispatch<SetStateAction<boolean>>;
  setShowUpgrade: Dispatch<SetStateAction<boolean>>;
  allowUpgrade: boolean;
}

export const UserActionsBlock = (props: IUserActionsBlock) => {
  const { setShowEdit, setShowUpgrade, allowUpgrade } = props;

  const [showOptions, setShowOptions] = useState<boolean>(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  useClickOutside(() => {
    setShowOptions(false);
  }, [buttonRef, divRef]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
        onClick={() => setShowOptions((prev) => !prev)}
      >
        <SlOptions size={14} className="text-gray-600" />
      </button>

      {showOptions && (
        <div
          ref={divRef}
          className="absolute right-0 top-11 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50"
        >
          <button
            test-id="show-edit-button"
            onClick={() => {
              setShowEdit((prev) => !prev);
              setShowOptions(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiEdit2 size={15} className="text-gray-400 flex-shrink-0" />
            Thay đổi thông tin
          </button>

          <Link
            href="user/change-password"
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiLock size={15} className="text-gray-400 flex-shrink-0" />
            Đổi mật khẩu
          </Link>

          {allowUpgrade && (
            <>
              <div className="mx-4 my-1 border-t border-gray-100" />
              <button
                test-id="show-upgrade-button"
                onClick={() => {
                  setShowUpgrade((prev) => !prev);
                  setShowEdit(false);
                  setShowOptions(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-orange-500 hover:bg-orange-50 transition-colors"
              >
                <FiAward size={15} className="flex-shrink-0" />
                Đăng ký tổ chức
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

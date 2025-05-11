import Link from 'next/link';
import { useClickOutside } from '@/src/utils/hooks';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { SlOptions } from 'react-icons/sl';

interface IActionsBlock {
  setShowEdit: Dispatch<SetStateAction<boolean>>;
  setShowUpgrade: Dispatch<SetStateAction<boolean>>;
  allowUpgrade: boolean;
}

export const ActionsBlock = (props: IActionsBlock) => {
  const { setShowEdit, setShowUpgrade, allowUpgrade } = props;

  // STATES
  const [showOptions, setShowOptions] = useState<boolean>(false);

  // EFFECTS
  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  useClickOutside(() => {
    setShowOptions(false);
  }, [buttonRef, divRef]);

  return (
    <div className='relative'>
      <div className='flex justify-end'>
        <button
          ref={buttonRef}
          className='flex justify-center items-center text-sm bg-gray-100 ring-1 ring-gray-300 hover:ring-2 rounded-full overflow-hidden w-8 h-8 relative'
          onClick={() => setShowOptions(prev => !prev)}>
          <SlOptions color='#000' />
        </button>
      </div>

      {showOptions && (
        <div
          ref={divRef}
          className='absolute shadow-lg bg-white right-9 top-0 w-60 rounded-lg border flex flex-col items-start overflow-hidden'>
          <button
            test-id="show-edit-button"
            onClick={() => {
              setShowEdit((prev) => !prev);
              setShowOptions(false);
            }}
            className="flex items-center w-full justify-center px-2 pt-1 font-thin text-gray-700 border-b hover:bg-yellow-300 hover:font-normal">
            {'Thay đổi thông tin'}
          </button>

          <Link
            href={'user/change-password'}
            className="flex items-center w-full justify-center px-2 pt-1 font-thin text-gray-700 border-b hover:bg-yellow-300 hover:font-normal">
            {'Đổi mật khẩu'}
          </Link>

          {allowUpgrade && (
            <button
              test-id="show-upgrade-button"
              className="flex items-center w-full justify-center px-2 pt-1 font-thin text-gray-700 border-b hover:bg-yellow-300 hover:font-normal"
              onClick={() => {
                setShowUpgrade((prev) => !prev);
                setShowEdit(false);
                setShowOptions(false);
              }}>
              {'Đăng ký thông tin tổ chức'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

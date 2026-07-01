'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { FaNewspaper, FaPaw, FaFeather, FaPlus } from 'react-icons/fa6';
import { ICurrentUserCoreResponse } from '@/src/interfaces/user';
import { USER_ROLE } from '@/src/utils/constants';
import { useClickOutside } from '@/src/utils/hooks';
import { UserPostCreateForm } from '@/src/components/user/UserPostCreateForm';
import PetProfileForm from '@/src/components/pet/PetProfileForm';
import { ConfirmCloseModal } from '@/src/components/ui/ConfirmCloseModal';

interface INavCreateMenu {
  userContext: ICurrentUserCoreResponse | null;
  variant?: 'button' | 'fab';
}

export const NavCreateMenu = ({ userContext, variant = 'button' }: INavCreateMenu) => {
  const isOrgOrAdmin = userContext?.role === USER_ROLE.ORGANIZATION || userContext?.role === USER_ROLE.SYSTEM_ADMIN;
  const isFab = variant === 'fab';

  const [isOpen, setIsOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(() => setIsOpen(false), [buttonRef, dropdownRef]);

  if (!userContext) return null;

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        test-id={isFab ? undefined : 'create-new-button'}
        title="Tạo mới"
        onClick={() => setIsOpen((v) => !v)}
        className={isFab
          ? 'flex items-center justify-center w-12 h-12 bg-yellow-300 rounded-full hover:bg-yellow-400 transition-colors text-black shadow-lg'
          : 'flex items-center gap-1.5 py-1.5 px-3 bg-yellow-300 rounded-full hover:bg-yellow-400 transition-colors font-medium text-black'}>
        <FaPlus size={isFab ? 18 : 12} />
        {!isFab && (
          <>
            Tạo mới
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className={isFab
            ? 'absolute bottom-full right-0 mb-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden'
            : 'absolute top-full left-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden'}>
          <button
            test-id={isFab ? undefined : 'create-post-option'}
            onClick={() => { setIsOpen(false); setIsPostModalOpen(true); }}
            className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 transition-colors">
            <FaNewspaper size={13} />
            Tạo bài đăng
          </button>
          <button
            test-id={isFab ? undefined : 'create-pet-option'}
            onClick={() => { setIsOpen(false); setIsPetModalOpen(true); }}
            className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 transition-colors">
            <FaPaw size={13} />
            Tạo thú cưng
          </button>
          {isOrgOrAdmin && (
            <Link
              href="/blog/new"
              test-id={isFab ? undefined : 'create-blog-option'}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 transition-colors">
              <FaFeather size={13} />
              Tạo blog
            </Link>
          )}
        </div>
      )}

      <ConfirmCloseModal open={isPostModalOpen} onClose={() => setIsPostModalOpen(false)}>
        <UserPostCreateForm onSuccess={() => setIsPostModalOpen(false)} />
      </ConfirmCloseModal>

      <ConfirmCloseModal
        open={isPetModalOpen}
        onClose={() => setIsPetModalOpen(false)}
        contentStyle={{ width: '90vw', maxWidth: '900px', padding: 0, borderRadius: '12px' }}>
        <div className="bg-white rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
          <PetProfileForm />
        </div>
      </ConfirmCloseModal>
    </div>
  );
};

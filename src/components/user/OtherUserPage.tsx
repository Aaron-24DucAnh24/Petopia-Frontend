'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaMessage } from 'react-icons/fa6';
import { IUserInfoResponse } from '@/src/interfaces/user';
import { STATIC_URLS, REPORT_ENTITY } from '@/src/utils/constants';
import { createConversation } from '@/src/services/chat.api';
import { ReportBlock } from '../ui/ReportBlock';
import { UserInformationBlock } from './UserInformationBlock';
import { UserRoleName } from './UserRoleName';

interface IOtherUserPageProps {
  userId: string;
  userInfo: IUserInfoResponse;
  currentUserId: string | null;
}

export const OtherUserPage = ({ userId, userInfo, currentUserId }: IOtherUserPageProps) => {
  const router = useRouter();
  const [chatLoading, setChatLoading] = useState(false);

  const isOwnProfile = currentUserId === userId;

  const handleStartChat = async () => {
    if (!currentUserId) return;
    setChatLoading(true);
    try {
      const res = await createConversation({
        type: 'direct',
        participants: [currentUserId, userId],
      });
      router.push(`/chat?conversationId=${res.data.id}`);
    } catch {
      // silently ignore — user can retry
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl p-5 mx-auto shadow-2xl rounded-2xl mt-36">
      <div className="flex relative md:-mb-10">
        <div className="relative h-32 w-32 md:h-52 md:w-52 bottom-10 md:bottom-20">
          <Image
            src={userInfo.image || STATIC_URLS.NO_AVATAR}
            alt="Picture of the author"
            fill
            objectFit="cover"
            className="rounded-full"
            quality={50} />
        </div>
        <UserRoleName
          userName={userInfo.attributes.organizationName
            || (userInfo.attributes.firstName + ' ' + userInfo.attributes.lastName)}
          userRole={userInfo.role}
          orgType={userInfo.attributes.type}
          website={userInfo.attributes.website} />
      </div>

      <UserInformationBlock userInfo={userInfo} visible />

      <div className="mt-3 flex justify-end gap-2">
        {currentUserId && !isOwnProfile && (
          <button
            onClick={handleStartChat}
            disabled={chatLoading}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-300 hover:bg-yellow-400 disabled:opacity-50 text-sm font-medium rounded-xl transition-colors"
          >
            <FaMessage size={14} />
            {chatLoading ? 'Đang mở...' : 'Nhắn tin'}
          </button>
        )}
        <ReportBlock id={userId} type={REPORT_ENTITY.User} />
      </div>
    </div>
  );
};

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUserCoreServer } from '@/src/services/user.server';
import { ChatPage } from '@/src/components/chat/ChatPage';

export const metadata: Metadata = {
  title: 'Tin nhắn - Petopia',
  description: 'Mạng xã hội dành cho thú cưng',
};

export default async function Page({
  searchParams,
}: {
  searchParams: { conversationId?: string };
}) {
  const userContext = await getCurrentUserCoreServer();
  if (!userContext) redirect('/login');

  return <ChatPage userContext={userContext} initialConversationId={searchParams.conversationId} />;
}

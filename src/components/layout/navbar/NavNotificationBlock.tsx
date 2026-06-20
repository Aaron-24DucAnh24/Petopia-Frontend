'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBell, FaXmark } from 'react-icons/fa6';
import { useClickOutside } from '@/src/utils/hooks';
import { checkNotification, markAllAsSeen, deleteNotification } from '@/src/services/notification.api';
import { INotificationResponse, ReferenceType } from '@/src/interfaces/notification';
import { getTimeAgo } from '@/src/helpers/getTimeAgo';
import { getGlobalConnection } from '@/src/components/providers/RealTimeProvider';

function getNotificationLink(notification: INotificationResponse): string {
  switch (notification.referenceType) {
    case ReferenceType.Pet:
      return `/pet/${notification.referenceId}`;
    case ReferenceType.Blog:
      return `/blog/${notification.referenceId}`;
    case ReferenceType.Post:
      return '/user';
    case ReferenceType.User:
      return '/user';
    case ReferenceType.UpgradeForm:
      return '/user';
    default:
      return '/';
  }
}

interface INavNotificationBlock {
  initialNotifications: INotificationResponse[];
}

export const NavNotificationBlock = ({ initialNotifications }: INavNotificationBlock) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotificationResponse[]>(initialNotifications);
  const bellRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside(() => setIsOpen(false), [bellRef, panelRef]);

  const unreadCount = notifications.filter((n) => !n.isChecked).length;

  const handleReceiveNotification = useCallback((notification: INotificationResponse) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  useEffect(() => {
    const connection = getGlobalConnection();
    if (!connection) return;

    connection.on('ReceiveNotification', handleReceiveNotification);
    return () => {
      connection.off('ReceiveNotification', handleReceiveNotification);
    };
  }, [handleReceiveNotification]);

  const handleClickNotification = async (notification: INotificationResponse) => {
    if (!notification.isChecked) {
      await checkNotification(notification.id).catch(() => {});
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isChecked: true } : n))
      );
    }
    setIsOpen(false);
    router.push(getNotificationLink(notification));
  };

  const handleDeleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id).catch(() => {});
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsSeen = async () => {
    await markAllAsSeen().catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, isChecked: true })));
  };

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <FaBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-10 w-80 max-h-96 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-sm text-gray-800">
              Thông báo
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsSeen}
                className="text-xs text-blue-500 hover:text-blue-700"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                Không có thông báo
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleClickNotification(notification)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50 ${
                    !notification.isChecked ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        !notification.isChecked
                          ? 'bg-blue-500'
                          : 'bg-transparent'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {getTimeAgo(notification.isCreatedAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteNotification(e, notification.id)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 rounded"
                    >
                      <FaXmark className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

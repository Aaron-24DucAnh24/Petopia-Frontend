'use client';
import { UPGRADE_STATUS } from '@/src/utils/constants';
import { ValueTextManager } from '@/src/utils/ValueTextManager';

const STATUS_COLORS: Record<UPGRADE_STATUS, string> = {
  [UPGRADE_STATUS.PENDING]: 'bg-yellow-100 text-yellow-700',
  [UPGRADE_STATUS.APPROVED]: 'bg-green-100 text-green-700',
  [UPGRADE_STATUS.REJECTED]: 'bg-red-100 text-red-700',
  [UPGRADE_STATUS.CANCELLED]: 'bg-gray-100 text-gray-500',
};

interface IUpgradeStatusBadgeProps {
  status: UPGRADE_STATUS;
  size?: 'sm' | 'md';
}

export function UpgradeStatusBadge({ status, size = 'sm' }: IUpgradeStatusBadgeProps) {
  const padding = size === 'md' ? 'px-3 py-1' : 'px-2.5 py-0.5';
  return (
    <span className={`inline-flex items-center ${padding} rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}>
      {ValueTextManager.UpgradeStatus.GetText(String(status))}
    </span>
  );
}

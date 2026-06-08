'use client';
import { ReactNode } from 'react';
import Button from '../ui/button/Button';
import { IUpgradeResponse } from '@/src/interfaces/org';
import { ValueTextManager } from '@/src/utils/ValueTextManager';
import { UpgradeStatusBadge } from './UpgradeStatusBadge';
import { formatDate } from '@/src/helpers/formatDate';
import {
  FiBriefcase, FiFileText, FiPhone, FiMail,
  FiGlobe, FiHash, FiTag, FiMapPin, FiCalendar,
} from 'react-icons/fi';

interface IUpgradeRequestDetail {
  request: IUpgradeResponse;
  onCancelRequest?: () => void;
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-orange-400">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-800 mt-0.5 break-words">{value || '—'}</p>
      </div>
    </div>
  );
}

export function UpgradeRequestDetail({ request, onCancelRequest }: IUpgradeRequestDetail) {
  return (
    <div className="w-full h-full flex flex-col rounded-2xl bg-yellow-100 p-5">
      <h2 className="font-bold mb-4 shrink-0">Chi tiết đơn xác minh</h2>

      <div className="flex-1 min-h-0 bg-gray-50 rounded-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white shrink-0">
          <UpgradeStatusBadge status={request.status} size="md" />
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <FiCalendar size={12} />
            {formatDate(request.isCreatedAt)}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoRow icon={<FiBriefcase size={15} />} label="Tên tổ chức" value={request.organizationName} />
            <InfoRow icon={<FiFileText size={15} />} label="Tên pháp nhân" value={request.entityName} />
            <InfoRow icon={<FiPhone size={15} />} label="Số điện thoại" value={request.phone} />
            <InfoRow icon={<FiMail size={15} />} label="Email" value={request.email} />
            <InfoRow icon={<FiGlobe size={15} />} label="Website" value={request.website} />
            <InfoRow icon={<FiHash size={15} />} label="Mã số thuế" value={request.taxCode} />
            <InfoRow
              icon={<FiTag size={15} />}
              label="Loại tổ chức"
              value={ValueTextManager.OrganizationType.GetText(String(request.type)) ?? ''} />
            <InfoRow icon={<FiMapPin size={15} />} label="Địa chỉ" value={request.address} />
          </div>

          {request.description && (
            <div className="mt-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Giới thiệu về tổ chức</p>
              <div
                className="bg-white border border-gray-200 rounded-lg p-4 text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: request.description }} />
            </div>
          )}
        </div>
      </div>

      {onCancelRequest && (
        <div className="shrink-0 pt-4">
          <Button name="Hủy yêu cầu" action={onCancelRequest} variant="danger" />
        </div>
      )}
    </div>
  );
}

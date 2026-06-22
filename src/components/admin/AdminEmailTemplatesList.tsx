'use client';
import { useState } from 'react';
import { useQuery } from '@/src/utils/hooks';
import { QUERY_KEYS } from '@/src/utils/constants';
import { IAdminEmailTemplateResponse } from '@/src/interfaces/admin';
import { IApiResponse } from '@/src/interfaces/common';
import { getAdminEmailTemplates } from '@/src/services/admin.api';
import { AxiosResponse } from 'axios';
import { QueryProvider } from '../providers/QueryProvider';
import { FaTimes, FaEye, FaTag } from 'react-icons/fa';
import Popup from 'reactjs-popup';

const EMAIL_TYPE_LABELS: Record<number, string> = {
  0: 'Xác thực đăng ký',
  1: 'Quên mật khẩu',
  2: 'Nâng cấp tổ chức thành công',
  3: 'Nâng cấp tổ chức thất bại',
  4: 'Được nâng cấp thành Admin',
  5: 'Lời mời trở thành Admin',
  6: 'Hóa đơn thanh toán',
};

const PLACEHOLDER_LABELS: Record<string, string> = {
  '{email}': 'Email',
  '{foRoute}': 'URL trang chủ',
  '{registerToken}': 'Token đăng ký',
  '{passwordToken}': 'Token mật khẩu',
  '{paymentId}': 'Mã thanh toán',
  '{startDate}': 'Ngày bắt đầu',
  '{endDate}': 'Ngày kết thúc',
  '{description}': 'Mô tả',
  '{price}': 'Giá',
  '{password}': 'Mật khẩu',
};

export const AdminEmailTemplatesList = QueryProvider(() => {
  const [viewingTemplate, setViewingTemplate] = useState<IAdminEmailTemplateResponse | null>(null);

  const { data, isLoading } = useQuery<IApiResponse<IAdminEmailTemplateResponse[]>>(
    [QUERY_KEYS.ADMIN_EMAIL_TEMPLATES],
    () => getAdminEmailTemplates(),
    { refetchOnWindowFocus: false }
  );

  const templates = (data as AxiosResponse<IApiResponse<IAdminEmailTemplateResponse[]>>)?.data?.data ?? [];

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Thẻ thay thế
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : templates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                    Không có mẫu email nào.
                  </td>
                </tr>
              ) : (
                templates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {EMAIL_TYPE_LABELS[template.type] ?? template.typeName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 truncate max-w-[300px]">
                        {template.subject}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {template.placeholders.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-100 text-gray-500"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.placeholders.length > 3 && (
                          <span className="text-[10px] text-gray-400">
                            +{template.placeholders.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setViewingTemplate(template)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FaEye className="w-3 h-3" />
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Popup
        open={!!viewingTemplate}
        modal
        overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}
        onClose={() => setViewingTemplate(null)}
      >
        <div className="container max-w-4xl rounded-2xl bg-white p-6 overflow-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {EMAIL_TYPE_LABELS[viewingTemplate?.type ?? 0]}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-700">Tiêu đề:</span> {viewingTemplate?.subject}
              </p>
            </div>
            <button
              onClick={() => setViewingTemplate(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
              <FaTag className="w-3 h-3" /> Thẻ thay thế:
            </span>
            {(viewingTemplate?.placeholders ?? []).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200"
              >
                {PLACEHOLDER_LABELS[tag] || tag}
                <span className="ml-1 text-amber-500 font-mono text-[10px]">{tag}</span>
              </span>
            ))}
          </div>

          <div
            className="border border-gray-200 rounded-lg p-6 bg-white prose max-w-none"
            dangerouslySetInnerHTML={{ __html: viewingTemplate?.body ?? '' }}
          />
        </div>
      </Popup>
    </div>
  );
});

'use client';
import React, { useState } from 'react';
import { REPORT_ENTITY, REPORT_TYPE } from '@/src/utils/constants';
import { IReportRequest } from '@/src/interfaces/user';
import { IApiResponse } from '@/src/interfaces/common';
import { report } from '@/src/services/user.api';
import { useMutation } from '@/src/utils/hooks';
import { Alert } from './Alert';
import { MdOutlineFlag } from 'react-icons/md';
import { IoCheckmark } from 'react-icons/io5';
import { ClipLoader } from 'react-spinners';

const REPORT_OPTIONS = [
  {
    value: REPORT_TYPE.SPAM,
    label: 'Tin rác',
    desc: 'Người dùng đăng thông tin không liên quan',
  },
  {
    value: REPORT_TYPE.SCAM,
    label: 'Lừa đảo',
    desc: 'Người dùng có dấu hiệu lừa đảo',
  },
  {
    value: REPORT_TYPE.INAPPROPRIATE_CONTENT,
    label: 'Nội dung không phù hợp',
    desc: 'Nội dung vi phạm tiêu chuẩn cộng đồng',
  },
  {
    value: REPORT_TYPE.OTHER,
    label: 'Khác',
    desc: 'Báo cáo vi phạm khác',
  },
];

export default function ReportForm({
  id,
  type,
  handleClose,
}: {
  id: string;
  type: REPORT_ENTITY;
  handleClose: () => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertFailed, setAlertFailed] = useState(false);

  const toggle = (value: number) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const reportMutation = useMutation<IApiResponse<boolean>, IReportRequest>(
    report,
    {
      onError: () => {
        setAlertMessage('Đã có lỗi xảy ra');
        setAlertFailed(true);
        setAlertShow(true);
      },
      onSuccess: () => {
        setAlertMessage('Báo cáo thành công');
        setAlertFailed(false);
        setAlertShow(true);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportMutation.mutate({ id, entity: type, reportTypes: selected });
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 px-6 py-5 border-b border-gray-100">
        <div className="p-2 bg-red-50 rounded-xl mt-0.5">
          <MdOutlineFlag size={20} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Báo cáo</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Chọn lý do báo cáo bên dưới
          </p>
        </div>
      </div>

      {/* Options */}
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-2">
        {REPORT_OPTIONS.map(({ value, label, desc }) => {
          const isSelected = selected.includes(value);
          return (
            <label
              key={value}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                isSelected
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-100 bg-gray-50 hover:border-red-200 hover:bg-red-50/40'
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={isSelected}
                onChange={() => toggle(value)}
              />
              <div
                className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'border-red-500 bg-red-500'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {isSelected && <IoCheckmark size={10} color="white" />}
              </div>
              <div>
                <div className="font-medium text-gray-800 text-sm">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
              </div>
            </label>
          );
        })}

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={selected.length === 0 || reportMutation.isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-colors bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-200 disabled:text-gray-400"
          >
            {reportMutation.isLoading ? (
              <ClipLoader color="#fff" size={14} />
            ) : (
              'Gửi báo cáo'
            )}
          </button>
        </div>
      </form>

      <Alert
        message={alertMessage}
        show={alertShow}
        setShow={setAlertShow}
        failed={alertFailed}
        action={handleClose}
        showCancel={false}
      />
    </div>
  );
}

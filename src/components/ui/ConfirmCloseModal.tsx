'use client';
import { useState, ReactNode } from 'react';
import { Alert } from './Alert';
import { IoClose } from 'react-icons/io5';

interface IConfirmCloseModal {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  contentStyle?: React.CSSProperties;
}

export function ConfirmCloseModal({ open, onClose, children, contentStyle }: IConfirmCloseModal) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!open) return null;

  const requestClose = () => setShowConfirm(true);

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 500, background: 'rgba(0, 0, 0, 0.5)' }}
      >
        {/* Backdrop — click to request close */}
        <div className="absolute inset-0" onClick={requestClose} />

        {/* Modal content */}
        <div className="relative z-10" style={contentStyle}>
          <button
            type="button"
            className="absolute top-3 right-3 z-20 p-1.5 bg-white/90 rounded-full hover:bg-gray-100 shadow-sm"
            onClick={requestClose}
          >
            <IoClose size={18} />
          </button>
          {children}
        </div>
      </div>

      <Alert
        show={showConfirm}
        setShow={setShowConfirm}
        title="Xác nhận đóng"
        message="Bạn có chắc muốn đóng không? Dữ liệu chưa lưu sẽ bị mất."
        failed={true}
        action={onClose}
      />
    </>
  );
}

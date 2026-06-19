'use client';
import { useState } from 'react';
import { Alert } from '@/src/components/ui/Alert';

interface IAdminToggleButtonProps {
  isActive: boolean;
  onToggle: () => Promise<void>;
}

export function AdminToggleButton({ isActive, onToggle }: IAdminToggleButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    onToggle().finally(() => setLoading(false));
  };

  return (
    <>
      <button
        onClick={() => setShowAlert(true)}
        disabled={loading}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isActive
            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
            : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
        }`}
      >
        {loading ? '...' : isActive ? 'Vô hiệu' : 'Kích hoạt'}
      </button>
      <Alert
        show={showAlert}
        setShow={setShowAlert}
        failed={isActive}
        title={isActive ? 'Xác nhận vô hiệu hoá' : 'Xác nhận kích hoạt'}
        message={
          isActive
            ? 'Mục này sẽ bị vô hiệu hoá. Bạn có chắc chắn không?'
            : 'Mục này sẽ được kích hoạt lại. Bạn có chắc chắn không?'
        }
        action={handleConfirm}
        showCancel
      />
    </>
  );
}

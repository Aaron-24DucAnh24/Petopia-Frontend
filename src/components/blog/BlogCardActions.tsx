'use client';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import { CiEdit } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import { Alert } from '../ui/Alert';
import { useMutation } from '@/src/utils/hooks';
import { deleteBlog } from '@/src/services/blog.api';

interface BlogCardActionsProps {
  id: string;
  onRefetch?: () => void;
}

export function BlogCardActions({ id, onRefetch }: BlogCardActionsProps) {
  const [showAlert, setShowAlert] = useState(false);

  const deleteBlogMutation = useMutation(deleteBlog, {
    onSuccess: () => { onRefetch?.(); },
  });

  return (
    <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <Popup
        modal
        overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
        trigger={
          <button className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center transition-colors hover:bg-blue-500">
            <CiEdit size={14} className="text-white" />
          </button>
        }
      >
        <div className="container max-w-xs md:max-w-3xl rounded-2xl bg-yellow-100 p-5">
          <div
            className="w-full p-5 mb-5 bg-gray-50 rounded-lg overflow-auto"
            style={{ maxHeight: '400px' }}
          >
            {/* Blog editor placeholder */}
          </div>
        </div>
      </Popup>

      <button
        className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center transition-colors hover:bg-red-500"
        onClick={() => setShowAlert(true)}
      >
        <MdDelete size={14} className="text-white" />
      </button>

      <Alert
        message="Bạn có chắc muốn xoá không?"
        failed={true}
        show={showAlert}
        title="Xác nhận xoá"
        setShow={setShowAlert}
        action={() => deleteBlogMutation.mutate(id)}
      />
    </div>
  );
}

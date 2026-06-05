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
    <div className="absolute top-2 right-2 flex gap-1">
      <Popup
        modal
        overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
        trigger={
          <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
            <CiEdit size={20} />
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
        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        onClick={() => setShowAlert(true)}
      >
        <MdDelete size={20} />
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

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const deleteBlogMutation = useMutation(deleteBlog, {
    onSuccess: () => { onRefetch?.(); },
  });

  return (
    <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center transition-colors hover:bg-blue-500"
        onClick={() => router.push(`/blog/${id}/edit`)}
      >
        <CiEdit size={14} className="text-white" />
      </button>

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

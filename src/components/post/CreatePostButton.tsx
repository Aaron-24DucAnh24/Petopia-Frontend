import { FaPlus } from 'react-icons/fa';
import CreatePostForm from './CreatePostForm';
import { useState } from 'react';
import { ConfirmCloseModal } from '../common/ConfirmCloseModal';

export default function CreatePostButton({
  petId,
  query,
  show,
}: {
  petId: string;
  query: any;
  show: boolean;
}) {
  const [open, setOpen] = useState(false);
  return !show
    ? <></>
    : (<div>
      <ConfirmCloseModal open={open} onClose={() => setOpen(false)}>
        <CreatePostForm
          petId={petId}
          query={query}
          action={() => setOpen(false)}
        />
      </ConfirmCloseModal>
      <button
        className="p-3 flex items-center w-fit font-medium bg-yellow-300 rounded-full hover:bg-yellow-400"
        onClick={() => setOpen(true)}
      >
        <span className="mr-2">
          <FaPlus />
        </span>
        Tạo bài đăng
      </button>
    </div>);
}

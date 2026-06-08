import Image from 'next/image';
import { FaHeart, FaComment } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IGetPostResponse } from '@/src/interfaces/post';

function ImageGrid({ images }: { images: string[] }) {
  const n = images.length;

  if (n === 0) {
    return (
      <div className="w-full h-44 bg-gray-100 rounded-t-2xl flex items-center justify-center">
        <span className="text-gray-400 text-xs">Không có ảnh</span>
      </div>
    );
  }

  if (n === 1) {
    return (
      <div className="relative w-full h-44 overflow-hidden rounded-t-2xl">
        <Image src={images[0]} alt="post" fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
      </div>
    );
  }

  if (n === 2) {
    return (
      <div className="flex gap-0.5 h-44 overflow-hidden rounded-t-2xl">
        {images.map((img, i) => (
          <div key={i} className="flex-1 relative overflow-hidden">
            <Image src={img} alt="post" fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  if (n === 3) {
    return (
      <div className="flex gap-0.5 h-44 overflow-hidden rounded-t-2xl">
        <div className="flex-1 relative overflow-hidden">
          <Image src={images[0]} alt="post" fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
        </div>
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="flex-1 relative overflow-hidden">
            <Image src={images[1]} alt="post" fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
          </div>
          <div className="flex-1 relative overflow-hidden">
            <Image src={images[2]} alt="post" fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
          </div>
        </div>
      </div>
    );
  }

  // 4+ images: 2×2 grid, last cell shows "+N" overlay
  const visible = images.slice(0, 4);
  const extra = n - 4;

  return (
    <div className="grid grid-cols-2 gap-0.5 h-44 overflow-hidden rounded-t-2xl">
      {visible.map((img, i) => (
        <div key={i} className="relative overflow-hidden">
          <Image src={img} alt="post" fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
          {i === 3 && extra > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xl font-bold">+{extra}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function PostCard({
  post,
  onClick,
  onDelete,
}: {
  post: IGetPostResponse;
  onClick: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col relative"
      onClick={onClick}
    >
      <ImageGrid images={post.images} />
      <div className="flex items-center gap-3 px-3 py-2 mt-auto">
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <FaHeart size={12} className={post.isLiked ? 'text-red-400' : ''} />
          <span>{post.like}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <FaComment size={12} />
          <span>{post.commentCount}</span>
        </div>
      </div>
      {onDelete && (
        <button
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Xoá bài đăng"
        >
          <MdDelete size={14} className="text-white" />
        </button>
      )}
    </div>
  );
}

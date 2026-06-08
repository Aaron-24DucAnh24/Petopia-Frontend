'use client';
import { useState } from 'react';
import Image from 'next/image';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface PostImageCarouselProps {
  images: string[];
  onClick: () => void;
  priority?: boolean;
}

export function PostImageCarousel({ images, onClick, priority = false }: PostImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < images.length - 1;

  return (
    <div
      className="relative w-full aspect-square bg-gray-100 cursor-pointer border-b border-gray-100"
      onClick={onClick}
    >
      {images.length > 0 ? (
        <>
          <Image src={images[currentIndex]} alt="post" fill sizes="(max-width: 640px) 100vw, 33vw" priority={priority} className="object-cover" />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => i - 1); }}
                disabled={!canGoBack}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center disabled:opacity-20 hover:bg-white transition-colors shadow"
              >
                <IoChevronBack size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => i + 1); }}
                disabled={!canGoForward}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center disabled:opacity-20 hover:bg-white transition-colors shadow"
              >
                <IoChevronForward size={18} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                    className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          Không có ảnh
        </div>
      )}
    </div>
  );
}

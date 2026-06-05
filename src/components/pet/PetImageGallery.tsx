'use client';
import { useState } from 'react';
import Image from 'next/image';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

const THUMB_PAGE_SIZE = 5;

export function PetImageGallery({ images }: { images: string[] }) {
  const [displayedImage, setDisplayedImage] = useState(images[0]);
  const [startIndex, setStartIndex] = useState(0);

  const visibleThumbs = images.slice(startIndex, startIndex + THUMB_PAGE_SIZE);
  const canPrev = startIndex > 0;
  const canNext = startIndex + THUMB_PAGE_SIZE < images.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full relative pt-[100%] rounded-2xl overflow-hidden shadow-md bg-gray-100">
        <Image
          alt="pet-avatar"
          src={displayedImage}
          fill
          className="object-cover transition-opacity duration-200"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-2">
          {images.length > THUMB_PAGE_SIZE && (
            <button
              onClick={() => setStartIndex((i) => Math.max(i - THUMB_PAGE_SIZE, 0))}
              disabled={!canPrev}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
            >
              <SlArrowLeft size={16} />
            </button>
          )}

          <div className="flex gap-2 flex-1">
            {visibleThumbs.map((img, i) => {
              const isActive = img === displayedImage;
              return (
                <button
                  key={startIndex + i}
                  onClick={() => setDisplayedImage(img)}
                  className={`relative flex-1 aspect-square rounded-xl overflow-hidden transition-all border-2 ${
                    isActive ? 'border-orange-400 shadow-md' : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <Image
                    alt={`thumb-${startIndex + i}`}
                    src={img}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              );
            })}
          </div>

          {images.length > THUMB_PAGE_SIZE && (
            <button
              onClick={() => setStartIndex((i) => Math.min(i + THUMB_PAGE_SIZE, images.length - 1))}
              disabled={!canNext}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
            >
              <SlArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

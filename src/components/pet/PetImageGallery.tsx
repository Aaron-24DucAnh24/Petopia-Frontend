'use client';
import { useState } from 'react';
import Image from 'next/image';
import ImageCarousel from '../ui/Carousel';

export function PetImageGallery({ images }: { images: string[] }) {
  const [displayedImage, setDisplayedImage] = useState(images[0]);

  return (
    <div>
      <div className="w-full relative pt-[100%]">
        <Image
          alt="pet-avatar"
          src={displayedImage}
          fill
          className="w-full h-3/4 top-0 left-0 object-cover rounded-lg"
        />
      </div>
      {images.length > 1 && (
        <div className="p-5">
          <ImageCarousel
            images={images}
            setDisplayedImage={setDisplayedImage}
            disPlayedImage={displayedImage}
          />
        </div>
      )}
    </div>
  );
}

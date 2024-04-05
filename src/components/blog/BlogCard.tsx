import { IBlogResponse } from '@/src/interfaces/blog';
import React from 'react';
import Image from 'next/image';

const BlogCard = ({
  image,
  category,
  title,
  excerpt,
}: IBlogResponse) => {
  return (
    <div
      className="blog-card rounded-lg overflow-hidden border border-gray-200 relative"
      style={{ width: '380px', height: '424px' }}
    >
      {/* Image with rounded corners */}
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={364}
          height={240}
          className="object-cover object-center rounded-t-lg mt-2 ml-2"
        />
        {/* Category */}
        <div className="bg-yellow-400 text-black text-xs font-bold uppercase px-2 py-1 absolute top-0 left-0 rounded-br-lg">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        {/* Excerpt */}
        <p className="text-sm text-gray-600">{excerpt}</p>
      </div>
    </div>
  );
};

export default BlogCard;
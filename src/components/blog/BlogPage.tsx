import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoEye } from 'react-icons/io5';
import { ReportBlock } from '../ui/ReportBlock';
import { IBlogResponse } from '@/src/interfaces/blog';
import { REPORT_ENTITY } from '@/src/utils/constants';
import { ValueTextManager } from '@/src/utils/ValueTextManager';

interface Props {
  blog: IBlogResponse;
}

const BlogPage: React.FC<Props> = ({ blog }) => {
  // Modify only the images within the htmlContent
  const styledHTMLContent = blog.content.replace(
    /<img/g,
    '<img style="display: block; margin: 0 auto; max-width: 90%; height: auto; object-fit:contain; margin-top: 20px; margin-bottom: 20px;"'
  );

  return (
    <div className="container max-w-3xl mx-auto p-5 mb-16">
      <div className="relative w-full pt-[42%] rounded-2xl overflow-hidden shadow-sm">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-black text-xs font-bold uppercase px-2.5 py-1 rounded-full shadow-sm">
          {ValueTextManager.BlogCategory.GetText(blog.category.toString())}
        </div>
        {blog.isAdvertised && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-white text-xs font-bold uppercase px-2.5 py-1 rounded-full shadow-sm">
            Quảng cáo
          </div>
        )}
      </div>

      <h1
        test-id="blog-page-title"
        className="text-3xl md:text-4xl font-bold text-gray-900 mt-6 leading-tight text-center"
      >
        {blog.title}
      </h1>

      <p className="text-lg text-gray-500 mt-3 leading-relaxed text-center">{blog.excerpt}</p>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5 text-sm text-gray-500">
          <Link href={`/user/${blog.userId}`} className="relative h-9 w-9 flex-shrink-0">
            <Image
              src={blog.userImage}
              alt={blog.userName}
              fill
              className="object-cover rounded-full"
            />
          </Link>
          <span>
            <Link href={`/user/${blog.userId}`} className="font-semibold text-gray-700 hover:underline">
              {blog.userName}
            </Link>
            {' · '}
            {new Date(blog.isCreatedAt).toLocaleDateString('vi-VN')}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
            <IoEye size={16} />
            <span>{blog.view}</span>
          </div>
          <ReportBlock id={blog.id} type={REPORT_ENTITY.Blog} />
        </div>
      </div>

      <div
        className="prose prose-img:rounded-xl max-w-none text-justify text-gray-800 leading-relaxed mt-8"
        dangerouslySetInnerHTML={{ __html: styledHTMLContent }}
      />
    </div>
  );
};

export default BlogPage;

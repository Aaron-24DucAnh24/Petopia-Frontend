'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IBlogResponse, IBlogUpdate } from '@/src/interfaces/blog';
import { IApiResponse, IUploadImage } from '@/src/interfaces/common';
import { updateBlog } from '@/src/services/blog.api';
import { uploadMany } from '@/src/services/storage.api';
import { useMutation } from '@/src/utils/hooks';
import { QueryProvider } from '../providers/QueryProvider';
import { Input } from '../ui/input/Input';
import { TextArea } from '../ui/input/TextArea';
import { SelectInput } from '../ui/input/SelectInput';
import Dropzone from '../ui/Dropzone';
import QueryButton from '../ui/button/QueryButton';
import { Alert } from '../ui/Alert';
import { BlogHTMLArea } from '../ui/input/BlogHTMLArea';
import { ValueTextManager } from '@/src/utils/ValueTextManager';
import { BlogAdModal } from './BlogAdModal';

interface IBlogEditForm {
  title: string;
  excerpt: string;
  category: string;
  content: string;
}

interface BlogEditFormProps {
  blog: IBlogResponse;
}

export const BlogEditForm = QueryProvider(({ blog }: BlogEditFormProps) => {
  const router = useRouter();

  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [isAdvertised, setIsAdvertised] = useState(blog.isAdvertised);

  const uploadImageForm = useForm<IUploadImage>({
    defaultValues: { showImages: [], files: [], images: [] },
  });

  const blogForm = useForm<IBlogEditForm>({
    defaultValues: {
      title: blog.title,
      excerpt: blog.excerpt,
      category: String(blog.category),
      content: blog.content,
    },
  });

  const updateBlogMutation = useMutation<IApiResponse<boolean>, IBlogUpdate>(
    updateBlog,
    {
      onError: (err) => {
        setAlertMessage(err?.data?.errorMessage || 'Cập nhật bài viết thất bại');
        setAlertShow(true);
      },
      onSuccess: () => {
        router.push(`/blog/${blog.id}`);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = blog.image;
      const files = uploadImageForm.getValues('files');

      if (files.length > 0) {
        const formData = new FormData();
        formData.append('images', files[0]);
        const uploadRes = await uploadMany(formData);
        const urls = (uploadRes.data as IApiResponse<string[]>).data;
        if (!urls.length) throw new Error('upload_failed');
        imageUrl = urls[0];
      }

      await updateBlogMutation.mutateAsync({
        id: blog.id,
        title: blogForm.getValues('title').trim(),
        excerpt: blogForm.getValues('excerpt').trim(),
        image: imageUrl,
        category: Number(blogForm.getValues('category')),
        content: blogForm.getValues('content'),
      });
    } catch (err: unknown) {
      if ((err as Error)?.message === 'upload_failed') {
        setAlertMessage('Tải ảnh lên thất bại');
        setAlertShow(true);
      }
      // mutation errors are handled by onError callback
    } finally {
      setIsUploading(false);
    }
  };

  const titleValue = blogForm.watch('title');
  const excerptValue = blogForm.watch('excerpt');
  const categoryValue = blogForm.watch('category');
  const contentValue = blogForm.watch('content');

  const isSubmittable =
    !!titleValue.trim() &&
    !!excerptValue.trim() &&
    !!categoryValue &&
    !!contentValue;

  return (
    <div className="container max-w-3xl mx-auto p-5 mb-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Chỉnh sửa bài viết</h1>
        {!isAdvertised && (
          <button
            type="button"
            onClick={() => setShowAdModal(true)}
            className="px-4 py-2 rounded-lg bg-yellow-300 hover:bg-yellow-400 text-sm font-semibold transition-colors"
          >
            Quảng cáo bài viết
          </button>
        )}
      </div>

      {isAdvertised ? (
        <div className="flex items-center gap-3 mb-8 px-4 py-3 rounded-xl bg-yellow-50 border border-yellow-300">
          <span className="bg-yellow-400 text-white text-xs font-bold uppercase px-2.5 py-1 rounded-full">
            Quảng cáo
          </span>
          <p className="text-sm text-yellow-800">
            Bài viết đang được quảng cáo
            {blog.advertisingDate && (
              <> · Đến ngày <span className="font-semibold">{new Date(blog.advertisingDate).toLocaleDateString('vi-VN')}</span></>
            )}
          </p>
        </div>
      ) : (
        <div className="mb-8" />
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="blog-title" className="block text-sm font-medium mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <Input
            id="blog-title"
            value={titleValue}
            onChange={(v) => blogForm.setValue('title', v)}
          />
        </div>

        <div>
          <label htmlFor="blog-excerpt" className="block text-sm font-medium mb-2">
            Tóm tắt <span className="text-red-500">*</span>
          </label>
          <TextArea
            id="blog-excerpt"
            rows={3}
            value={excerptValue}
            onChange={(v) => blogForm.setValue('excerpt', v)}
          />
        </div>

        <div>
          <label htmlFor="blog-category" className="block text-sm font-medium mb-2">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <SelectInput
            id="blog-category"
            options={ValueTextManager.BlogCategory}
            defaultValue={categoryValue}
            onChange={(v) => blogForm.setValue('category', v)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ảnh bìa</label>
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Ảnh hiện tại:</p>
            <div className="relative w-40 h-28 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={blog.image}
                alt="Ảnh bìa hiện tại"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-2">Tải ảnh mới (tuỳ chọn):</p>
          <Dropzone
            id="blog-cover-dropzone"
            setValue={uploadImageForm.setValue}
            watch={uploadImageForm.watch}
            imagesNumber={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <BlogHTMLArea
            id="blog-content"
            value={contentValue}
            setValue={(v) => blogForm.setValue('content', v)}
          />
        </div>

        <QueryButton
          name="Lưu thay đổi"
          isLoading={isUploading}
          isDisabled={!isSubmittable}
        />
      </form>

      <Alert
        show={alertShow}
        setShow={setAlertShow}
        message={alertMessage}
        failed={true}
        showCancel={false}
      />

      <BlogAdModal
        blogId={blog.id}
        show={showAdModal}
        onClose={() => setShowAdModal(false)}
        onPaymentSuccess={() => setIsAdvertised(true)}
      />
    </div>
  );
});
